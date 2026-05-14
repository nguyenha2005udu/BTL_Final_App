import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const emailSignUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const emailSignIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = () => signOut(auth);

export const listenAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

