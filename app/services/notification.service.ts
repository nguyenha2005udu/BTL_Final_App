import {
    collection,
    onSnapshot,
    orderBy,
    query,
    type DocumentData,
} from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';

export type NotificationEntity = 'transaction' | 'category';
export type NotificationAction = 'added' | 'modified' | 'removed';

export type AppNotification = {
  id: string;
  entity: NotificationEntity;
  action: NotificationAction;

  title: string;
  body: string;

  createdAt: Date;
  read: boolean;

  icon: string;         // tên MaterialIcons
  iconColor: string;    // màu icon
  iconBgLight: string;  // nền icon (light)
  iconBgDark: string;   // nền icon (dark)
};

const toDateSafe = (v: any): Date => {
  if (!v) return new Date();
  if (typeof v?.toDate === 'function') return v.toDate();
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : new Date();
};

const moneyVND = (n: number) => `${Math.round(Math.max(0, n)).toLocaleString('vi-VN')}₫`;

const withAlpha = (hex: string, alphaHex = '22', fallback = '#e5e7eb') => {
  if (typeof hex !== 'string') return fallback;
  if (!hex.startsWith('#')) return fallback;

  // #RRGGBBAA
  if (hex.length === 9) return hex;

  // #RGB -> #RRGGBB + alpha
  if (hex.length === 4) {
    const r = hex[1], g = hex[2], b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}${alphaHex}`;
  }

  // #RRGGBB -> add alpha
  if (hex.length === 7) return `${hex}${alphaHex}`;

  return fallback;
};

type CatInfo = { id: string; name: string; icon?: string; color?: string; type?: 'income' | 'expense' };
type TxInfo = { id: string; categoryId?: string; mount?: number; amount?: number; note?: string; type?: 'income' | 'expense'; createdAt?: any; updatedAt?: any; date?: any };

const getTxAmount = (t: TxInfo) => {
  const raw =
    typeof t.mount === 'number'
      ? t.mount
      : typeof t.amount === 'number'
      ? t.amount
      : Number((t as any)?.mount ?? (t as any)?.amount ?? 0);

  return Number.isFinite(raw) ? Math.abs(raw) : 0;
};

const makeNotif = (p: Omit<AppNotification, 'id' | 'read'>): AppNotification => ({
  ...p,
  id: `${p.entity}_${p.action}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  read: false,
});

export const listenAppNotifications = (
  onNew: (n: AppNotification) => void,
  onError?: (e: Error) => void,
) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  // Map categoryId -> info để build nội dung + icon/màu theo danh mục
  let catMap = new Map<string, CatInfo>();
  const catsRef = collection(db, 'users', user.uid, 'categories');
  const unsubCats = onSnapshot(
    catsRef,
    snap => {
      const next = new Map<string, CatInfo>();
      snap.docs.forEach(d => {
        const data = d.data() as any;
        next.set(d.id, {
          id: d.id,
          name: data.name ?? 'Danh mục',
          icon: data.icon,
          color: data.color,
          type: data.type,
        });
      });
      catMap = next;
    },
    err => onError?.(err as Error),
  );

  // Listen transactions (realtime changes)
  const txRef = collection(db, 'users', user.uid, 'transactions');
  const qTx = query(txRef, orderBy('date', 'desc'));

  let didInitTx = false;
  const unsubTx = onSnapshot(
    qTx,
    snap => {
      // Bỏ qua lần snapshot đầu tiên (tránh spam notify toàn bộ dữ liệu cũ)
      if (!didInitTx) {
        didInitTx = true;
        return;
      }

      snap.docChanges().forEach(ch => {
        const data = { id: ch.doc.id, ...(ch.doc.data() as DocumentData) } as TxInfo;
        const action = ch.type as NotificationAction;

        const cat = data.categoryId ? catMap.get(data.categoryId) : undefined;
        const amount = getTxAmount(data);
        const isExpense = data.type === 'expense';

        // icon + màu theo danh mục (nếu có), fallback theo loại giao dịch
        const icon = cat?.icon ?? (isExpense ? 'payments' : 'savings');
        const iconColor = cat?.color ?? (isExpense ? '#EF4444' : '#22C55E');
        const iconBgLight = withAlpha(iconColor, '22', isExpense ? '#FEE2E2' : '#DCFCE7');
        const iconBgDark = withAlpha(iconColor, '33', isExpense ? '#4a1d1d' : '#1e3d2e');

        const when = toDateSafe(data.updatedAt ?? data.createdAt ?? data.date ?? new Date());

        if (action === 'added') {
          onNew(
            makeNotif({
              entity: 'transaction',
              action,
              title: 'Giao dịch mới',
              body: `Bạn đã ${isExpense ? 'chi tiêu' : 'nhận'} ${moneyVND(amount)}${cat?.name ? ` cho ${cat.name}` : ''}.`,
              createdAt: when,
              icon,
              iconColor,
              iconBgLight,
              iconBgDark,
            }),
          );
        } else if (action === 'modified') {
          onNew(
            makeNotif({
              entity: 'transaction',
              action,
              title: 'Cập nhật giao dịch',
              body: `Giao dịch ${cat?.name ? cat.name : ''} đã được cập nhật (${moneyVND(amount)}).`.trim(),
              createdAt: when,
              icon: 'edit',
              iconColor: '#3c83f6',
              iconBgLight: '#DBEAFE',
              iconBgDark: '#1e3a5f',
            }),
          );
        } else if (action === 'removed') {
          onNew(
            makeNotif({
              entity: 'transaction',
              action,
              title: 'Đã xoá giao dịch',
              body: `Một giao dịch đã bị xoá.`,
              createdAt: new Date(),
              icon: 'delete',
              iconColor: '#EF4444',
              iconBgLight: '#FEE2E2',
              iconBgDark: '#4a1d1d',
            }),
          );
        }
      });
    },
    err => onError?.(err as Error),
  );

  // Listen categories changes (optional nhưng đúng yêu cầu “mọi thay đổi firebase”)
  let didInitCat = false;
  const qCats = query(catsRef, orderBy('createdAt', 'desc'));
  const unsubCatChanges = onSnapshot(
    qCats,
    snap => {
      if (!didInitCat) {
        didInitCat = true;
        return;
      }

      snap.docChanges().forEach(ch => {
        const data = { id: ch.doc.id, ...(ch.doc.data() as DocumentData) } as any;
        const action = ch.type as NotificationAction;

        const name = data.name ?? 'Danh mục';
        const icon = data.icon ?? 'category';
        const color = data.color ?? '#3c83f6';

        onNew(
          makeNotif({
            entity: 'category',
            action,
            title:
              action === 'added'
                ? 'Thêm danh mục'
                : action === 'modified'
                ? 'Cập nhật danh mục'
                : 'Xoá danh mục',
            body:
              action === 'removed'
                ? `Một danh mục đã bị xoá.`
                : `Danh mục "${name}" đã ${action === 'added' ? 'được tạo' : 'được cập nhật'}.`,
            createdAt: new Date(),
            icon: action === 'removed' ? 'delete' : icon,
            iconColor: action === 'removed' ? '#EF4444' : color,
            iconBgLight: action === 'removed' ? '#FEE2E2' : withAlpha(color, '22', '#DBEAFE'),
            iconBgDark: action === 'removed' ? '#4a1d1d' : withAlpha(color, '33', '#1e3a5f'),
          }),
        );
      });
    },
    err => onError?.(err as Error),
  );

  return () => {
    unsubTx?.();
    unsubCats?.();
    unsubCatChanges?.();
  };
};
