// services/auth.service.ts
import { emailSignIn, emailSignUp, logout } from './firebase/authProviders';
import { auth, db } from './firebase/firebaseConfig';
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';

export interface RegisterPayload {
  fullName?: string;
  email: string;
  password: string;
  photoUrl?: string; // 👈 thêm
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  amount?: number;
  emailVerified?: boolean;
  photoUrl?: string; // 👈 thêm
  createdAt?: any;
}

// Đăng ký với email + password
export const registerWithEmail = async (
  payload: RegisterPayload,
): Promise<User> => {
  const { email, password, fullName, photoUrl } = payload;

  // 1. Tạo user bằng email & password
  const cred = await emailSignUp(email, password);
  const user = cred.user;

  // 2. Lưu thông tin user vào Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email,
    fullName: fullName || '',
    photoUrl: photoUrl || '',     // 👈 lưu kèm photoUrl (có thể rỗng)
    createdAt: serverTimestamp(),
    emailVerified: user.emailVerified ?? false,
    amount: 0,
    phone: '',
    birthDate: null,
  });

  // 3. Gửi email xác thực
  await sendEmailVerification(user);

  return user;
};

// Đăng nhập với email + password
export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  const cred = await emailSignIn(email, password);
  return cred.user;
};

// Đăng xuất
export const logoutUser = async (): Promise<void> => {
  await logout();
};

// Gửi email đặt lại mật khẩu
export const sendResetPasswordEmail = async (
  email: string,
): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Lấy profile user hiện tại từ Firestore
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data() as Omit<UserProfile, 'id'>;

  return {
    id: snap.id,
    ...data,
  };
};

// 👇 Cập nhật profile user
export interface UpdateUserProfilePayload {
  fullName?: string;
  phone?: string;
  birthDate?: string | null;
  photoUrl?: string;
}

export const updateUserProfile = async (payload: UpdateUserProfilePayload): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No logged-in user');

  const userRef = doc(db, 'users', user.uid);

  await updateDoc(userRef, {
    ...payload,
  });
};
