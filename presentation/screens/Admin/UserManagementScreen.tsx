import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@services/firebase/firebaseConfig";
import { logoutUser } from "@services/auth.service";
import { useNavigation } from "@react-navigation/native";

type Role = "admin" | "user";

interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isBanned: boolean;
}

export default function UserManagementScreen() {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const checkAdminAndLoad = useCallback(async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setAccessDenied(true);
        return;
      }

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (!snap.exists() || snap.data()?.role !== "admin") {
        setAccessDenied(true);
        return;
      }

      setAccessDenied(false);
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const docs = await getDocs(q);
      const mapped: AppUser[] = docs.docs.map((item) => ({
        id: item.id,
        fullName: String(item.data()?.fullName ?? item.data()?.name ?? "No name"),
        email: String(item.data()?.email ?? "No email"),
        role: item.data()?.role === "admin" ? "admin" : "user",
        isBanned: Boolean(item.data()?.isBanned ?? false),
      }));
      setUsers(mapped);
    } catch (error) {
      Alert.alert("Loi", "Khong the tai danh sach nguoi dung.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAndLoad();
  }, [checkAdminAndLoad]);

  const onRefresh = () => {
    setRefreshing(true);
    checkAdminAndLoad();
  };

  const totalAdmins = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users],
  );

  const toggleRole = async (user: AppUser) => {
    const nextRole: Role = user.role === "admin" ? "user" : "admin";
    try {
      setUpdatingId(`${user.id}-role`);
      await updateDoc(doc(db, "users", user.id), { role: nextRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)),
      );
    } catch {
      Alert.alert("Loi", "Khong the cap nhat quyen.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleBan = async (user: AppUser) => {
    const nextValue = !user.isBanned;
    try {
      setUpdatingId(`${user.id}-ban`);
      await updateDoc(doc(db, "users", user.id), { isBanned: nextValue });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: nextValue } : u)),
      );
    } catch {
      Alert.alert("Loi", "Khong the cap nhat trang thai khoa.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Dang tai du lieu admin...</Text>
      </SafeAreaView>
    );
  }

  if (accessDenied) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialIcons name="lock" size={56} color="#DC2626" />
        <Text style={styles.title}>Truy cap bi tu choi</Text>
        <Text style={styles.subtitle}>Chi tai khoan admin moi duoc vao man hinh nay.</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Dang xuat</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>
            Tong {users.length} user - {totalAdmins} admin
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Dang xuat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const roleUpdating = updatingId === `${item.id}-role`;
          const banUpdating = updatingId === `${item.id}-ban`;
          return (
            <View style={styles.card}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.fullName}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.meta}>
                  Role: {item.role} | Status: {item.isBanned ? "banned" : "active"}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.smallBtn}
                  disabled={roleUpdating || banUpdating}
                  onPress={() => toggleRole(item)}
                >
                  <Text style={styles.smallBtnText}>
                    {roleUpdating ? "..." : item.role === "admin" ? "Set User" : "Set Admin"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.warnBtn]}
                  disabled={roleUpdating || banUpdating}
                  onPress={() => toggleBan(item)}
                >
                  <Text style={styles.smallBtnText}>
                    {banUpdating ? "..." : item.isBanned ? "Unban" : "Ban"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    color: "#475569",
  },
  loadingText: {
    marginTop: 12,
    color: "#334155",
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  userInfo: {
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  email: {
    color: "#334155",
  },
  meta: {
    color: "#64748B",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  smallBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  warnBtn: {
    backgroundColor: "#DC2626",
  },
  smallBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
