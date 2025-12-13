import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const emailSignUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const emailSignIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => signOut(auth);

export const listenAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

// ✅ Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ✅ Đăng nhập bằng Google (tạo account nếu chưa có)
export const googleSignIn = () => signInWithPopup(auth, googleProvider);

// ✅ Link Google vào user đang đăng nhập (email/password)
export const linkGoogleToCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No logged-in user');
  return linkWithPopup(user, googleProvider);
};
