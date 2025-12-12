// app/services/transaction.service.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  limit as qLimit,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase/firebaseConfig";
import type { Category, Transaction as UITransaction } from "../type/types";

export type TransactionType = "expense" | "income";

// ✅ Transaction đúng theo Firestore
export type TxDoc = {
  id: string;
  categoryId: string;
  createdAt?: any;
  date: any; // Timestamp
  mount: number;
  note: string;
  type: TransactionType;
  updatedAt?: any;
};

// =======================
// Helpers
// =======================
const getTransactionsCollection = () => {
  const user = auth.currentUser;
  if (!user) return null;
  return collection(db, "users", user.uid, "transactions");
};

const normalizeMount = (data: any) => {
  // hỗ trợ cả mount/amount nếu lỡ có doc cũ
  if (typeof data?.mount === "number") return data.mount;
  if (typeof data?.amount === "number") return data.amount;
  return 0;
};

const tsToDate = (ts: any): Date => {
  if (!ts) return new Date();
  if (typeof ts?.toDate === "function") return ts.toDate();
  return new Date(ts);
};

const formatDateYYYYMMDD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// =======================
// CRUD
// =======================
export const listenTransactions = (
  onChange: (transactions: TxDoc[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = getTransactionsCollection();
  if (!colRef) {
    onChange([]);
    return () => {};
  }

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: TxDoc[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<TxDoc, "id">),
      }));
      onChange(list);
    },
    (error) => onError?.(error as Error)
  );
};

export const createTransaction = async (input: {
  categoryId: string;
  date: Date;
  mount: number;
  note?: string;
  type: TransactionType;
}) => {
  const colRef = getTransactionsCollection();
  if (!colRef) throw new Error("User not logged in");

  await addDoc(colRef, {
    categoryId: input.categoryId,
    date: Timestamp.fromDate(input.date),
    mount: input.mount,
    note: input.note ?? "",
    type: input.type,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateTransaction = async (
  id: string,
  data: Partial<Pick<TxDoc, "categoryId" | "date" | "mount" | "note" | "type">>
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const ref = doc(db, "users", user.uid, "transactions", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const ref = doc(db, "users", user.uid, "transactions", id);
  await deleteDoc(ref);
};

// =======================
// HOME: Summary (thu/chi/số dư)
// =======================

// ✅ 1) Lấy summary 1 lần (non-realtime)
export const getCurrentUserSummary = async () => {
  const colRef = getTransactionsCollection();
  if (!colRef) return { totalIncome: 0, totalExpense: 0, balance: 0 };

  const snap = await getDocs(colRef);

  let totalIncome = 0;
  let totalExpense = 0;

  snap.forEach((d) => {
    const x = d.data() as any;
    const mount = normalizeMount(x);
    if (x.type === "income") totalIncome += mount;
    if (x.type === "expense") totalExpense += mount;
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

// ✅ 2) Realtime summary (Home mở là tự update)
export const listenHomeSummary = (
  onChange: (summary: { totalIncome: number; totalExpense: number; balance: number }) => void,
  onError?: (error: Error) => void
) => {
  const colRef = getTransactionsCollection();
  if (!colRef) {
    onChange({ totalIncome: 0, totalExpense: 0, balance: 0 });
    return () => {};
  }

  return onSnapshot(
    colRef,
    (snap) => {
      let totalIncome = 0;
      let totalExpense = 0;

      snap.forEach((d) => {
        const x = d.data() as any;
        const mount = normalizeMount(x);
        if (x.type === "income") totalIncome += mount;
        if (x.type === "expense") totalExpense += mount;
      });

      onChange({
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      });
    },
    (error) => onError?.(error as Error)
  );
};

// =======================
// HOME: Recent transactions (3 giao dịch gần đây)
// =======================

export const listenRecentTransactions = (
  take: number,
  onChange: (tx: TxDoc[]) => void,
  onError?: (error: Error) => void
) => {
  const colRef = getTransactionsCollection();
  if (!colRef) {
    onChange([]);
    return () => {};
  }

  const q = query(colRef, orderBy("date", "desc"), qLimit(take));

  return onSnapshot(
    q,
    (snap) => {
      const list: TxDoc[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<TxDoc, "id">),
      }));
      onChange(list);
    },
    (error) => onError?.(error as Error)
  );
};

// =======================
// MAP: Firestore TxDoc -> UI Transaction (đúng interface bạn gửi)
// =======================

export const mapToHomeTransactions = (
  txDocs: TxDoc[],
  categories: Category[]
): UITransaction[] => {
  const catMap: Record<string, Category> = {};
  categories.forEach((c) => (catMap[c.id] = c));

  return txDocs.map((tx) => {
    const cat = catMap[tx.categoryId];
    const d = tsToDate(tx.date);

    const mount = typeof tx.mount === "number" ? tx.mount : 0;

    return {
      id: tx.id,
      title: cat?.name || "Danh mục",
      subtitle: tx.note?.trim() ? tx.note : formatDateYYYYMMDD(d),
      // ✅ UI amount: income dương, expense âm
      amount: tx.type === "income" ? mount : -mount,
      date: formatDateYYYYMMDD(d),
      icon: cat?.icon || "category",
      colorClass: cat?.color || "#3c83f6",
      type: tx.type,
    };
  });
};
  export const getTransactionById = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const ref = doc(db, "users", user.uid, "transactions", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as any),
    };
  };