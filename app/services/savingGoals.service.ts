import { db } from "./firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { SavingGoal } from "../type/types";

// collection name dưới user
const SAVING_GOALS_SUBCOLLECTION = "savingGoals";

/**
 * Tạo mục tiêu tiết kiệm
 * path: users/{userId}/savingGoals/{goalId}
 */
export const createSavingGoal = async (
  userId: string,
  goal: Omit<SavingGoal, "id" | "userId" | "createdAt">
) => {
  const ref = collection(
    db,
    "users",
    userId,
    SAVING_GOALS_SUBCOLLECTION // = "savingGoals"
  );

  const docRef = await addDoc(ref, {
    ...goal,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Lấy danh sách goal của user
 */
export const getSavingGoalsByUser = async (
  userId: string
): Promise<SavingGoal[]> => {
  const ref = collection(
    db,
    "users",
    userId,
    SAVING_GOALS_SUBCOLLECTION
  );

  const snapshot = await getDocs(ref);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<SavingGoal, "id">),
  }));
};

/**
 * Cập nhật goal
 */
export const updateSavingGoal = async (
  userId: string,
  goalId: string,
  data: Partial<SavingGoal>
) => {
  const docRef = doc(
    db,
    "users",
    userId,
    SAVING_GOALS_SUBCOLLECTION,
    goalId
  );

  await updateDoc(docRef, data);
};
export const addGoalContribution = async (
  userId: string,
  goalId: string,
  amount: number
) => {
  const ref = collection(
    db,
    "users",
    userId,
    "savingGoals",
    goalId,
    "contributions"
  );

  await addDoc(ref, {
    amount,
    createdAt: serverTimestamp(),
  });
};
export interface GoalContribution {
  id: string;
  amount: number;
  createdAt: any;
}

export const getGoalContributions = async (
  userId: string,
  goalId: string
): Promise<GoalContribution[]> => {
  const ref = collection(
    db,
    "users",
    userId,
    "savingGoals",
    goalId,
    "contributions"
  );

  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));
};
/**
 * Lấy chi tiết goal
 */
export const getGoalDetail = async (
  userId: string,
  goalId: string
): Promise<SavingGoal | null> => {
  const docRef = doc(
    db,
    "users",
    userId,
    SAVING_GOALS_SUBCOLLECTION,
    goalId
  );

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<SavingGoal, "id">),
  };
};
