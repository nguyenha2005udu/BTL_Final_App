
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
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { FONT_SIZE, RADIUS, SPACING } from "@/utils/responsive";

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
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isSmall = width < 360;
  const avatarSize = isSmall ? 44 : 52;
  const iconSize = isSmall ? 18 : 22;

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
      setUpdatingId(`${user.id}-role`);
      await updateDoc(doc(db, "users", user.id), { role: nextRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      );
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật quyền.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleBan = async (user: AppUser) => {
    try {
      setUpdatingId(`${user.id}-ban`);
      await updateDoc(doc(db, "users", user.id), { isBanned: !user.isBanned });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBanned: !u.isBanned } : u
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
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const bottomPad = insets.bottom + 60;

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (accessDenied) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialIcons name="lock" size={64} color="#EF4444" />
        <Text style={styles.deniedTitle}>Truy cập bị từ chối</Text>
        <Text style={styles.deniedSubtitle}>
          Chỉ tài khoản admin mới có thể truy cập màn hình này.
        </Text>
        <TouchableOpacity style={styles.logoutBtnSmall} onPress={handleLogout}>
          <Text style={styles.logoutBtnSmallText}>Đăng xuất</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: SPACING.md }}>
          <Text style={styles.title} numberOfLines={1}>Quản lý người dùng</Text>
          <Text style={styles.subtitle}>
            {users.length} users • {totalAdmins} admins
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={16} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
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
            tintColor="#3B82F6"
          />
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPad + SPACING.lg },
        ]}
        renderItem={({ item }) => {
          const roleUpdating = updatingId === `${item.id}-role`;
          const banUpdating = updatingId === `${item.id}-ban`;

          return (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <View
                  style={[
                    styles.avatar,
                    { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                  ]}
                >
                  <Text style={[styles.avatarText, { fontSize: isSmall ? 17 : 20 }]}>
                    {item.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>{item.fullName}</Text>
                  <Text style={styles.email} numberOfLines={1}>{item.email}</Text>

                  <View style={styles.badgeRow}>
                    <View style={item.role === "admin" ? styles.adminBadge : styles.userBadge}>
                      <Text
                        style={[
                          styles.badgeText,
                          { color: item.role === "admin" ? "#D97706" : "#2563EB" },
                        ]}
                      >
                        {item.role === "admin" ? "ADMIN" : "USER"}
                      </Text>
                    </View>
                    <View style={item.isBanned ? styles.bannedBadge : styles.activeBadge}>
                      <Text
                        style={[
                          styles.badgeText,
                          { color: item.isBanned ? "#DC2626" : "#059669" },
                        ]}
                      >
                        {item.isBanned ? "BANNED" : "ACTIVE"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  disabled={roleUpdating || banUpdating}
                  onPress={() => toggleRole(item)}
                >
                  <MaterialIcons
                    name={item.role === "admin" ? "person" : "admin-panel-settings"}
                    size={15}
                    color="#3B82F6"
                  />
                  <Text style={styles.actionBtnText}>
                    {roleUpdating ? "..." : item.role === "admin" ? "Set User" : "Set Admin"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    item.isBanned ? styles.unbanBtn : styles.banBtn,
                  ]}
                  disabled={roleUpdating || banUpdating}
                  onPress={() => toggleBan(item)}
                >
                  <MaterialIcons
                    name={item.isBanned ? "check-circle" : "block"}
                    size={15}
                    color={item.isBanned ? "#059669" : "#DC2626"}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: item.isBanned ? "#059669" : "#DC2626" },
                    ]}
                  >
                    {banUpdating ? "..." : item.isBanned ? "Unban" : "Ban"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Navigation */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <View style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="admin-panel-settings" size={iconSize} color="#3B82F6" />
          <Text style={styles.activeFooterText}>Quản lý</Text>
        </View>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminCategories")}
        >
          <MaterialIcons name="dashboard" size={iconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Danh mục</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminStatistic")}
        >
          <MaterialIcons name="bar-chart" size={iconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Thống kê</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminSetting")}
        >
          <MaterialIcons name="person" size={iconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: SPACING.xxl,
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: SPACING.md,
    color: "#64748B",
    fontSize: FONT_SIZE.body,
    fontWeight: "500",
  },
  deniedTitle: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  deniedSubtitle: {
    marginTop: SPACING.sm,
    color: "#64748B",
    fontSize: FONT_SIZE.body,
    textAlign: "center",
    lineHeight: FONT_SIZE.body * 1.6,
  },
  logoutBtnSmall: {
    marginTop: SPACING.xxl,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  logoutBtnSmallText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: FONT_SIZE.bodyLg,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.titleLg,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 3,
    color: "#64748B",
    fontSize: FONT_SIZE.small,
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    flexShrink: 0,
  },
  logoutBtnText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: FONT_SIZE.small,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "flex-start",
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  avatarText: {
    color: "#3B82F6",
    fontWeight: "800",
  },
  name: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#0F172A",
  },
  email: {
    color: "#64748B",
    marginTop: 3,
    fontSize: FONT_SIZE.small,
    fontWeight: "500",
  },
  badgeRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    flexWrap: "wrap",
  },
  adminBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  userBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  activeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  bannedBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  badgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: SPACING.md,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    paddingVertical: SPACING.md - 1,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  banBtn: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
  },
  unbanBtn: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  actionBtnText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: FONT_SIZE.small,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  activeFooterTab: {
    backgroundColor: "#EFF6FF",
  },
  footerText: {
    color: "#94A3B8",
    fontSize: FONT_SIZE.caption,
    fontWeight: "600",
  },
  activeFooterText: {
    color: "#3B82F6",
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
  },
});