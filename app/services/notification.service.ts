import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type DocumentData
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

  icon: string;         // MaterialIcons name
  iconColor: string;    // icon color
  iconBgLight: string;  // icon background light
  iconBgDark: string;   // icon background dark
};

type Tx = {
  id: string;
  title?: string;
  amount?: number;      // ✅ theo screen của bạn
  mount?: number;       // fallback nếu chỗ khác dùng mount
  categoryId?: string;
  icon?: string;
  type?: 'income' | 'expense';
  note?: string;
  date?: any;
  createdAt?: any;
  updatedAt?: any;
};

type Cat = {
  id: string;
  name?: string;
  icon?: string;
  color?: string;
  type?: 'income' | 'expense';
  createdAt?: any;
  updatedAt?: any;
};

const toDateSafe = (v: any): Date => {
  if (!v) return new Date();
  if (typeof v?.toDate === 'function') return v.toDate(); // Firestore Timestamp
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : new Date();
};

const formatVnd = (n: number) => `${Math.round(Math.max(0, n)).toLocaleString('vi-VN')}₫`;

const getTxAmount = (t: Tx) => {
  const raw =
    typeof t.amount === 'number'
      ? t.amount
      : typeof t.mount === 'number'
      ? t.mount
      : Number((t as any)?.amount ?? (t as any)?.mount ?? 0);

  return Number.isFinite(raw) ? Math.abs(raw) : 0;
};

const withAlpha = (hex: string, alpha = '22', fallback = '#e5e7eb') => {
  if (typeof hex !== 'string') return fallback;
  if (!hex.startsWith('#')) return fallback;
  if (hex.length === 9) return hex; // #RRGGBBAA
  if (hex.length === 7) return `${hex}${alpha}`; // #RRGGBB
  if (hex.length === 4) {
    const r = hex[1], g = hex[2], b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}${alpha}`; // #RGB
  }
  return fallback;
};

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

export const listenAppNotifications = (
  onNew: (n: AppNotification) => void,
  onError?: (e: Error) => void,
) => {
  let unsubTx: undefined | (() => void);
  let unsubCat: undefined | (() => void);
  let unsubAuth: undefined | (() => void);

  // Cache để dựng nội dung + màu danh mục
  let catMap = new Map<string, Cat>();

  // Track id để tránh “modified” đầu tiên bị hiểu sai
  let knownTxIds = new Set<string>();
  let knownCatIds = new Set<string>();

  const emit = (n: Omit<AppNotification, 'id' | 'read'>) => {
    onNew({ ...n, id: makeId(), read: false });
  };

  const setup = (uid: string) => {
    // 1) Listen categories (để lấy name/color/icon và cũng tạo noti khi danh mục đổi)
    const catsRef = collection(db, 'users', uid, 'categories');
    const catsQ = query(catsRef, orderBy('updatedAt', 'desc'), limit(50));

    let catsInited = false;
    unsubCat = onSnapshot(
      catsQ,
      snap => {
        // update catMap
        const nextMap = new Map<string, Cat>();
        snap.docs.forEach(d => {
          const data = d.data() as DocumentData;
          nextMap.set(d.id, {
            id: d.id,
            name: data.name,
            icon: data.icon,
            color: data.color,
            type: data.type,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        catMap = nextMap;

        // tạo notification theo change
        const changes = snap.docChanges();
        if (!catsInited) {
          // Lần đầu: để khỏi spam, chỉ tạo tối đa 6 noti danh mục mới nhất
          catsInited = true;
          knownCatIds = new Set(snap.docs.map(d => d.id));

          changes
            .filter(c => c.type === 'added')
            .slice(0, 6)
            .forEach(ch => {
              const d = ch.doc;
              const data = d.data() as any;
              const name = data?.name ?? 'Danh mục';
              const color = data?.color ?? '#3c83f6';
              const icon = data?.icon ?? 'category';

              emit({
                entity: 'category',
                action: 'added',
                title: 'Danh mục',
                body: `Đã có danh mục: ${name}`,
                createdAt: toDateSafe(data?.updatedAt ?? data?.createdAt ?? new Date()),
                icon,
                iconColor: color,
                iconBgLight: withAlpha(color, '22', '#DBEAFE'),
                iconBgDark: withAlpha(color, '33', '#1e3a5f'),
              });
            });

          return;
        }

        changes.forEach(ch => {
          const id = ch.doc.id;
          const data = ch.doc.data() as any;

          if (ch.type === 'added') knownCatIds.add(id);
          if (ch.type === 'removed') knownCatIds.delete(id);

          const name = data?.name ?? 'Danh mục';
          const color = data?.color ?? '#3c83f6';
          const icon = data?.icon ?? 'category';

          if (ch.type === 'added') {
            emit({
              entity: 'category',
              action: 'added',
              title: 'Thêm danh mục',
              body: `${name}`,
              createdAt: new Date(),
              icon,
              iconColor: color,
              iconBgLight: withAlpha(color, '22', '#DBEAFE'),
              iconBgDark: withAlpha(color, '33', '#1e3a5f'),
            });
          } else if (ch.type === 'modified') {
            emit({
              entity: 'category',
              action: 'modified',
              title: 'Cập nhật danh mục',
              body: `${name}`,
              createdAt: new Date(),
              icon: 'edit',
              iconColor: '#3c83f6',
              iconBgLight: '#DBEAFE',
              iconBgDark: '#1e3a5f',
            });
          } else if (ch.type === 'removed') {
            emit({
              entity: 'category',
              action: 'removed',
              title: 'Xoá danh mục',
              body: `Một danh mục đã bị xoá.`,
              createdAt: new Date(),
              icon: 'delete',
              iconColor: '#EF4444',
              iconBgLight: '#FEE2E2',
              iconBgDark: '#4a1d1d',
            });
          }
        });
      },
      err => onError?.(err as Error),
    );

    // 2) Listen transactions
    const txRef = collection(db, 'users', uid, 'transactions');
    const txQ = query(txRef, orderBy('date', 'desc'), limit(50));

    let txInited = false;
    unsubTx = onSnapshot(
      txQ,
      snap => {
        const changes = snap.docChanges();

        if (!txInited) {
          txInited = true;
          knownTxIds = new Set(snap.docs.map(d => d.id));

          // Lần đầu: tạo noti từ 8 giao dịch mới nhất để bạn “thấy có dữ liệu”
          changes
            .filter(c => c.type === 'added')
            .slice(0, 8)
            .forEach(ch => {
              const data = { id: ch.doc.id, ...(ch.doc.data() as DocumentData) } as Tx;

              const amount = getTxAmount(data);
              const isExpense = data.type === 'expense';

              const cat = data.categoryId ? catMap.get(data.categoryId) : undefined;
              const catName = cat?.name;
              const color = cat?.color ?? (isExpense ? '#EF4444' : '#22C55E');

              emit({
                entity: 'transaction',
                action: 'added',
                title: 'Giao dịch',
                body: `${isExpense ? 'Chi' : 'Thu'} ${formatVnd(amount)}${catName ? ` • ${catName}` : ''}`,
                createdAt: toDateSafe(data.updatedAt ?? data.createdAt ?? data.date ?? new Date()),
                icon: (data.icon as any) ?? cat?.icon ?? (isExpense ? 'payments' : 'savings'),
                iconColor: color,
                iconBgLight: withAlpha(color, '22', isExpense ? '#FEE2E2' : '#DCFCE7'),
                iconBgDark: withAlpha(color, '33', isExpense ? '#4a1d1d' : '#1e3d2e'),
              });
            });

          return;
        }

        changes.forEach(ch => {
          const data = { id: ch.doc.id, ...(ch.doc.data() as DocumentData) } as Tx;
          const id = data.id;

          // nếu Firestore báo modified mà id chưa từng có => coi như added
          let type = ch.type;
          if (type === 'modified' && !knownTxIds.has(id)) type = 'added';

          if (type === 'added') knownTxIds.add(id);
          if (type === 'removed') knownTxIds.delete(id);

          const amount = getTxAmount(data);
          const isExpense = data.type === 'expense';

          const cat = data.categoryId ? catMap.get(data.categoryId) : undefined;
          const catName = cat?.name;
          const color = cat?.color ?? (isExpense ? '#EF4444' : '#22C55E');
          const title = data.title?.trim();

          if (type === 'added') {
            emit({
              entity: 'transaction',
              action: 'added',
              title: 'Giao dịch mới',
              body: `${isExpense ? 'Chi' : 'Thu'} ${formatVnd(amount)}${catName ? ` • ${catName}` : ''}${title ? ` • ${title}` : ''}`,
              createdAt: toDateSafe(data.updatedAt ?? data.createdAt ?? data.date ?? new Date()),
              icon: (data.icon as any) ?? cat?.icon ?? (isExpense ? 'payments' : 'savings'),
              iconColor: color,
              iconBgLight: withAlpha(color, '22', isExpense ? '#FEE2E2' : '#DCFCE7'),
              iconBgDark: withAlpha(color, '33', isExpense ? '#4a1d1d' : '#1e3d2e'),
            });
          } else if (type === 'modified') {
            emit({
              entity: 'transaction',
              action: 'modified',
              title: 'Cập nhật giao dịch',
              body: `${isExpense ? 'Chi' : 'Thu'} ${formatVnd(amount)}${catName ? ` • ${catName}` : ''}${title ? ` • ${title}` : ''}`,
              createdAt: new Date(),
              icon: 'edit',
              iconColor: '#3c83f6',
              iconBgLight: '#DBEAFE',
              iconBgDark: '#1e3a5f',
            });
          } else if (type === 'removed') {
            emit({
              entity: 'transaction',
              action: 'removed',
              title: 'Xoá giao dịch',
              body: `Một giao dịch đã bị xoá.`,
              createdAt: new Date(),
              icon: 'delete',
              iconColor: '#EF4444',
              iconBgLight: '#FEE2E2',
              iconBgDark: '#4a1d1d',
            });
          }
        });
      },
      err => onError?.(err as Error),
    );
  };

  unsubAuth = onAuthStateChanged(
    auth,
    user => {
      // cleanup cũ
      unsubTx?.(); unsubTx = undefined;
      unsubCat?.(); unsubCat = undefined;

      catMap = new Map();
      knownTxIds = new Set();
      knownCatIds = new Set();

      if (!user) return;
      setup(user.uid);
    },
    err => onError?.(err as Error),
  );

  return () => {
    unsubTx?.();
    unsubCat?.();
    unsubAuth?.();
  };
};
