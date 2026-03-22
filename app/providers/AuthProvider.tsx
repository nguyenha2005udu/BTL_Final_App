import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUserProfile, type UserRole } from "../services/auth.service";
import { listenAuthChange } from "../services/firebase/authProviders";

type AuthContextType = {
  user: any;
  loading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsub = listenAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const profile = await getCurrentUserProfile();
      setRole(profile?.role ?? "user");
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
