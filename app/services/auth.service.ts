// services/auth.service.ts
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { emailSignIn, emailSignUp, logout } from "./firebase/authProviders";
import { auth, db } from "./firebase/firebaseConfig";

export type UserRole = "admin" | "user";

export interface RegisterPayload {
  fullName?: string;
  email: string;
  password: string;
  photoUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  phone?: string;
  birthDate?: string | null;
  amount?: number;
  emailVerified?: boolean;
  photoUrl?: string;
  createdAt?: any;
}

// Đăng ký với email + password
export const registerWithEmail = async (
  payload: RegisterPayload,
): Promise<User> => {
  const { email, password, fullName, photoUrl } = payload;

  const cred = await emailSignUp(email, password);
  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    role: "user",
    fullName: fullName || "",
    photoUrl: photoUrl || "",
    createdAt: serverTimestamp(),
    emailVerified: user.emailVerified ?? false,
    amount: 0,
    phone: "",
    birthDate: null,
  });

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
export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Lấy profile user hiện tại từ Firestore
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data() as Omit<UserProfile, "id">;

  return {
    id: snap.id,
    ...data,
    role: (data.role as UserRole) ?? "user",
  };
};

// Kiểm tra admin
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const profile = await getCurrentUserProfile();
  return profile?.role === "admin";
};

// Cập nhật profile user
export interface UpdateUserProfilePayload {
  fullName?: string;
  phone?: string;
  birthDate?: string | null;
  photoUrl?: string;
}

export const updateUserProfile = async (
  payload: UpdateUserProfilePayload,
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("No logged-in user");

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    ...payload,
  });
};

// Đồng bộ profile từ auth provider (ví dụ Google)
export const upsertUserProfileFromAuth = async (user: User): Promise<void> => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const googleName = (user.displayName ?? "").trim();
  const googlePhoto = user.photoURL ?? "";

  const existingData = snap.exists() ? (snap.data() as any) : null;
  const existingFullName = String(existingData?.fullName ?? "").trim();
  const existingRole: UserRole =
    existingData?.role === "admin" ? "admin" : "user";

  const fullNameToSave = existingFullName || googleName;

  const baseData = {
    email: user.email ?? "",
    role: existingRole,
    fullName: fullNameToSave,
    photoUrl: googlePhoto,
    emailVerified: user.emailVerified ?? false,
  };

  if (!snap.exists()) {
    await setDoc(userRef, {
      ...baseData,
      createdAt: serverTimestamp(),
      amount: 0,
      phone: "",
      birthDate: null,
    });
  } else {
    await updateDoc(userRef, {
      ...baseData,
    });
  }
};
