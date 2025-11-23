// services/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 👉 chính là đoạn bạn copy từ console
const firebaseConfig = {
  apiKey: "AIzaSyBZq8chnGtikag5h2jef8WS36TChotRc2Y",
  authDomain: "expense-tracker-93b08.firebaseapp.com",
  projectId: "expense-tracker-93b08",
  storageBucket: "expense-tracker-93b08.firebasestorage.app",
  messagingSenderId: "6055580612",
  appId: "1:6055580612:web:3d79d2663eb2a62c1e8a91",
  measurementId: "G-841YSZ8JLE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);