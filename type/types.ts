import { Timestamp } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

export type MaterialIconName =
  React.ComponentProps<typeof MaterialIcons>["name"];
/* ================= UI MODELS ================= */

export interface UITransaction {
  id: string;
  title: string;
  subtitle: string;      // "15/12/2025 • Ăn trưa"
  amount: number;        // + thu | - chi
  date: Date;
  icon: MaterialIconName;
  colorClass: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  icon: MaterialIconName;
  colorClass: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  title: string;
  savedAmount: number;
  targetAmount: number;
  status: 'ongoing' | 'completed' | 'cancelled';
  deadline?: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  spent?: number;
  type: 'income' | 'expense';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  dob?: string;
}

/* ================= FIRESTORE MODELS ================= */

export interface SavingGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Timestamp;
  createdAt: Timestamp;
}
