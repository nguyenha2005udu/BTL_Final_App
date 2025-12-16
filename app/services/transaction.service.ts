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
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  categoryId: string;
  icon: string;
  amount: number;
  note: string;
  type: TransactionType;
  date: Date;
  createdAt?: any;
  updatedAt?: any;
}

/* ================== INTERNAL ================== */

const getTransactionsCollection = () => {
  const user = auth.currentUser;
  if (!user) return null;
  return collection(db, 'users', user.uid, 'transactions');
};

/* ================== LISTEN REALTIME ================== */

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
        const date =
          rawDate?.toDate instanceof Function
            ? rawDate.toDate()
            : new Date();

        return {
          id: docSnap.id,
          title: data.title ?? '',
          categoryId: data.categoryId ?? '',
          icon: data.icon ?? 'category',
          amount: typeof data.amount === 'number' ? data.amount : 0,
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

/* ================== CREATE ================== */

export interface CreateTransactionInput {
  title: string;
  categoryId: string;
  icon: string;
  amount: number;           // luôn truyền dương
  type: TransactionType;
  note?: string;
  date?: Date;
}

export const createTransaction = async (
  input: CreateTransactionInput,
) => {
  const colRef = getTransactionsCollection();
  if (!colRef) {
    throw new Error('User not logged in');
  }

  await addDoc(colRef, {
    title: input.title,
    categoryId: input.categoryId,
    icon: input.icon,
    amount: Math.abs(input.amount),
    type: input.type,
    note: input.note ?? '',
    date: Timestamp.fromDate(input.date ?? new Date()),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/* ================== UPDATE ================== */

export const updateTransaction = async (
  id: string,
  data: Partial<CreateTransactionInput>,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'transactions', id);

  const payload: any = {
    updatedAt: serverTimestamp(),
  };

  if (data.title !== undefined) payload.title = data.title;
  if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
  if (data.icon !== undefined) payload.icon = data.icon;
  if (data.type !== undefined) payload.type = data.type;
  if (data.note !== undefined) payload.note = data.note;
  if (typeof data.amount === 'number') {
    payload.amount = Math.abs(data.amount);
  }
  if (data.date instanceof Date) {
    payload.date = Timestamp.fromDate(data.date);
  }

  await updateDoc(ref, payload);
};

/* ================== DELETE ================== */

export const deleteTransaction = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'transactions', id);
  await deleteDoc(ref);
};

/* ================== GET BY ID ================== */

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

  const date =
    rawDate?.toDate instanceof Function
      ? rawDate.toDate()
      : new Date();

  return {
    id: snap.id,
    title: data.title ?? '',
    categoryId: data.categoryId ?? '',
    icon: data.icon ?? 'category',
    amount: typeof data.amount === 'number' ? data.amount : 0,
    note: data.note ?? '',
    type: (data.type as TransactionType) ?? 'expense',
    date,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
