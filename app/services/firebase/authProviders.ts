import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
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