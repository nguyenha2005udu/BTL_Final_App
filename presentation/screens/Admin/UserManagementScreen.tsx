
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
    } catch {
      Alert.alert("Lỗi", "Không thể tải dữ liệu.");
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
    [users]
  );

  const toggleRole = async (user: AppUser) => {
    const nextRole: Role = user.role === "admin" ? "user" : "admin";

    try {
      setUpdatingId(`${user.id} -role`);

      await updateDoc(doc(db, "users", user.id), {
        role: nextRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
              ...u,
              role: nextRole,
            }
            : u
        )
      );
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật quyền.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleBan = async (user: AppUser) => {
    try {
      setUpdatingId(`${user.id} -ban`);

      await updateDoc(doc(db, "users", user.id), {
        isBanned: !user.isBanned,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
              ...u,
              isBanned: !u.isBanned,
            }
            : u
        )
      );
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
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
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (accessDenied) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialIcons name="lock" size={70} color="#EF4444" />

        <Text style={styles.title}>Truy cập bị từ chối</Text>

        <Text style={styles.subtitle}>
          Chỉ tài khoản admin mới có thể truy cập màn hình này.
        </Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Quản lý tài khoản người dùng</Text>

          <Text style={styles.subtitle}>
            {users.length} users • {totalAdmins} admins
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <MaterialIcons
            name="logout"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.logoutBtnText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const roleUpdating = updatingId === `${item.id} -role`;
          const banUpdating = updatingId === `${item.id} -ban`;

          return (
            <View style={styles.card}>

              {/* User Info */}
              <View style={styles.topRow}>

                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {item.fullName}
                  </Text>

                  <Text style={styles.email}>
                    {item.email}
                  </Text>

                  <View style={styles.badgeRow}>

                    <View
                      style={
                        item.role === "admin"
                          ? styles.adminBadge
                          : styles.userBadge
                      }
                    >
                      <Text style={styles.badgeText}>
                        {item.role === "admin"
                          ? "ADMIN"
                          : "USER"}
                      </Text>
                    </View>

                    <View
                      style={
                        item.isBanned
                          ? styles.bannedBadge
                          : styles.activeBadge
                      }
                    >
                      <Text style={styles.badgeText}>
                        {item.isBanned
                          ? "BANNED"
                          : "ACTIVE"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>

                <TouchableOpacity
                  style={styles.smallBtn}
                  disabled={roleUpdating || banUpdating}
                  onPress={() => toggleRole(item)}
                >
                  <Text style={styles.smallBtnText}>
                    {roleUpdating
                      ? "..."
                      : item.role === "admin"
                        ? "Set User"
                        : "Set Admin"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallBtn, styles.warnBtn]}
                  disabled={roleUpdating || banUpdating}
                  onPress={() => toggleBan(item)}
                >
                  <Text style={styles.smallBtnText}>
                    {banUpdating
                      ? "..."
                      : item.isBanned
                        ? "Unban"
                        : "Ban"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Navigation */}
      <View style={styles.footer}>

        {/* Quản lý */}
        <TouchableOpacity
          style={[
            styles.footerTab,
            styles.activeFooterTab,
          ]}
        >
          <MaterialIcons
            name="admin-panel-settings"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.activeFooterText}>
            Quản lý
          </Text>
        </TouchableOpacity>

        {/* Quản lý danh mục */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminCategories")}
        >
          <MaterialIcons
            name="dashboard"
            size={22}
            color="#94A3B8"
          />

          <Text style={styles.footerText}>
            Danh mục
          </Text>
        </TouchableOpacity>

        {/* Thống kê */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminStatistic")}
        >
          <MaterialIcons
            name="bar-chart"
            size={22}
            color="#94A3B8"
          />

          <Text style={styles.footerText}>
            Thống kê
          </Text>
        </TouchableOpacity>

        {/* Cá nhân */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminSetting")}
        >
          <MaterialIcons
            name="person"
            size={22}
            color="#94A3B8"
          />

          <Text style={styles.footerText}>
            Cài đặt
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0B1120",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 14,
  },

  loadingText: {
    marginTop: 12,
    color: "#CBD5E1",
    fontSize: 15,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
    gap: 16,
  },

  card: {
    backgroundColor: "#111827",

    borderRadius: 26,

    padding: 18,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 6,
  },

  topRow: {
    flexDirection: "row",
    gap: 14,
  },

  avatar: {
    width: 58,
    height: 58,

    borderRadius: 29,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#4F46E5",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  email: {
    color: "#CBD5E1",
    marginTop: 4,
    fontSize: 14,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  adminBadge: {
    backgroundColor: "rgba(245,158,11,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  userBadge: {
    backgroundColor: "rgba(59,130,246,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  activeBadge: {
    backgroundColor: "rgba(16,185,129,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  bannedBadge: {
    backgroundColor: "rgba(239,68,68,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  smallBtn: {
    flex: 1,

    backgroundColor: "#4F46E5",

    paddingVertical: 14,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  warnBtn: {
    backgroundColor: "#DC2626",
  },

  smallBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  logoutBtn: {
    backgroundColor: "#1E293B",

    paddingHorizontal: 16,
    paddingVertical: 12,

    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoutBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  footer: {
    position: "absolute",

    left: 18,
    right: 18,
    bottom: 18,

    backgroundColor: "#111827",

    borderRadius: 28,

    paddingVertical: 14,
    paddingHorizontal: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  footerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,

    paddingVertical: 10,
    borderRadius: 18,
  },

  activeFooterTab: {
    backgroundColor: "#4F46E5",
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },

  activeFooterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});