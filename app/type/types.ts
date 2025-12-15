import { Timestamp } from "firebase/firestore";

export interface Transaction {
  id: string;
  title: string;
  subtitle: string; // Date or Category
  amount: number; // Positive for income, negative for expense
  date: string;
  icon: string;
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
export type SavingGoal = {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Timestamp;
  createdAt: Timestamp;
};


