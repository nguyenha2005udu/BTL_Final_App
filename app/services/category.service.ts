import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { Category } from '../type/types';
import { auth, db } from './firebase/firebaseConfig';

// KHÔNG throw nữa, chỉ trả về null nếu chưa login
const getCategoriesCollection = () => {
  const user = auth.currentUser;
  if (!user) return null;
  return collection(db, 'users', user.uid, 'categories');
};

// Lắng nghe realtime danh mục
export const listenCategories = (
  onChange: (categories: Category[]) => void,
  onError?: (error: Error) => void,
) => {
  const colRef = getCategoriesCollection();

  // Chưa login: trả về mảng rỗng, không quăng lỗi
  if (!colRef) {
    onChange([]);
    return () => {}; // unsubscribe rỗng
  }

  return onSnapshot(
    colRef,
    snapshot => {
      const list: Category[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Category, 'id'>),
      }));
      onChange(list);
    },
    error => {
      console.log('listenCategories error', error);
      onError?.(error as Error);
    },
  );
};

// Tạo danh mục mới – ở đây vẫn yêu cầu phải login
export const createCategory = async (input: {
  name: string;
  icon: string;
  color: string;
  budget?: number;
  type: 'income' | 'expense';
}) => {
  const colRef = getCategoriesCollection();
  if (!colRef) {
    throw new Error('User not logged in'); // người dùng bấm Lưu khi chưa login
  }

  await addDoc(colRef, {
    name: input.name,
    icon: input.icon,
    color: input.color,
    budget: input.budget ?? null,
    spent: 0,
    type: input.type,
    createdAt: serverTimestamp(),
  });
};

export const updateCategory = async (
  id: string,
  data: Partial<Pick<Category, 'name' | 'icon' | 'color' | 'budget' | 'type'>>,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'categories', id);
  await updateDoc(ref, data);
};

export const deleteCategory = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const ref = doc(db, 'users', user.uid, 'categories', id);
  await deleteDoc(ref);
};
