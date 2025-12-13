import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc, 
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  categoryId: string;
  mount: number;           // số tiền (dương)
  note: string;
  type: TransactionType;   // 'income' | 'expense'
  date: Date;              // ngày giao dịch
  createdAt?: any;
  updatedAt?: any;
}

const getTransactionsCollection = () => {
  const user = auth.currentUser;
  if (!user) return null;
  return collection(db, 'users', user.uid, 'transactions');
};

// Lắng nghe realtime danh sách giao dịch
export const listenTransactions = (
  onChange: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void,
) => {
  const colRef = getTransactionsCollection();
  if (!colRef) {
    onChange([]);
    return () => {};
  }

  const q = query(colRef, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    snapshot => {
      const list: Transaction[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        const rawDate = data.date;

        let date: Date;
        if (rawDate?.toDate) {
          date = rawDate.toDate();
        } else if (rawDate instanceof Date) {
          date = rawDate;
        } else {
          date = new Date();
        }

        return {
          id: docSnap.id,
          categoryId: data.categoryId || '',
          mount: typeof data.mount === 'number' ? data.mount : 0,
          note: data.note ?? '',
          type: (data.type as TransactionType) ?? 'expense',
          date,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });

      onChange(list);
    },
    error => {
      console.log('listenTransactions error', error);
      onError?.(error as Error);
    },
  );
};

export interface CreateTransactionInput {
  categoryId: string;
  mount: number;         // truyền dương, type quyết định thu/chi
  note?: string;
  type: TransactionType;
  date?: Date;
}

// Tạo giao dịch mới
export const createTransaction = async (input: CreateTransactionInput) => {
  const colRef = getTransactionsCollection();
  if (!colRef) {
    throw new Error('User not logged in');
  }

  const normalizedMount = Math.abs(input.mount);

  await addDoc(colRef, {
    categoryId: input.categoryId,
    mount: normalizedMount,
    note: input.note ?? '',
    type: input.type,
    date: input.date ?? new Date(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Cập nhật giao dịch
export const updateTransaction = async (
  id: string,
  data: Partial<CreateTransactionInput>,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'transactions', id);

  const payload: any = { ...data, updatedAt: serverTimestamp() };
  if (typeof data.mount === 'number') {
    payload.mount = Math.abs(data.mount);
  }

  await updateDoc(ref, payload);
};

// Xoá giao dịch
export const deleteTransaction = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'transactions', id);
  await deleteDoc(ref);
};

// 👇 HÀM MỚI: lấy 1 giao dịch theo id
export const getTransactionById = async (
  id: string,
): Promise<Transaction | null> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'transactions', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;
  const rawDate = data.date;

  let date: any = rawDate;
  if (rawDate?.toDate) {
    date = rawDate.toDate();
  }

  return {
    id: snap.id,
    categoryId: data.categoryId || '',
    mount: typeof data.mount === 'number' ? data.mount : 0,
    note: data.note ?? '',
    type: (data.type as TransactionType) ?? 'expense',
    date,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
