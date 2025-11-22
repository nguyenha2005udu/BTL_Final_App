import { emailSignIn, emailSignUp, logout } from './firebase/authProviders';
import { auth } from './firebase/firebaseConfig';
import { db } from './firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

export interface RegisterPayload {
  fullName?: string;
  email: string;
  password: string;
}

export const registerWithEmail = async (payload: RegisterPayload) => {
  const { email, password, fullName } = payload;

  // 1. Tạo user bằng email & password
  const cred = await emailSignUp(email, password);
  const user = cred.user;

  // 2. Lưu thông tin user vào Firestore (nếu bạn muốn)
  await setDoc(doc(db, 'users', user.uid), {
    email,
    fullName: fullName || '',
    createdAt: serverTimestamp(),
    emailVerified: user.emailVerified ?? false,
  });

  // 3. Gửi email xác thực
  // (dùng user vừa tạo hoặc auth.currentUser đều được)
  await sendEmailVerification(user);

  return user;
};


export const loginWithEmail = async (email: string, password: string) => {
  const cred = await emailSignIn(email, password);
  return cred.user;
};

export const logoutUser = async () => {
  await logout();
};

export const sendResetPasswordEmail = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};