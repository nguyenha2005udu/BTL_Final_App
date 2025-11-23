// services/transaction.service.ts
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';

export type Transaction = {
  id: string;
  userId: string;
  categoryId: string;
  kind: 'income' | 'expense';
  mount: number;
  note?: string;
  date?: any;
  createdAt?: any;
  updatedAt?: any;
};

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export const getCurrentUserSummary = async (): Promise<TransactionSummary> => {
  const user = auth.currentUser;
  if (!user) {
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }

  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', user.uid) // 👈 đảm bảo mỗi transaction có userId
  );

  const snapshot = await getDocs(q);

  let totalIncome = 0;
  let totalExpense = 0;

  snapshot.forEach(docSnap => {
    const data = docSnap.data() as any;

    const mount = typeof data.mount === 'number' ? data.mount : 0;
    const kind = data.kind as string;

    if (kind === 'income') {
      totalIncome += mount;
    } else if (kind === 'expense') {
      totalExpense += mount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};
