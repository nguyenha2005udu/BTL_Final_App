
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@services/firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { FONT_SIZE, RADIUS, SPACING } from "@/utils/responsive";

interface PlatformStats {
  totalUsers: number;
  totalAdmins: number;
  totalBanned: number;
  totalCategories: number;
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  recentUsers: { name: string; email: string; createdAt: any }[];
}

export default function AdminStatisticScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isSmall = width < 360;
  const tabIconSize = isSmall ? 18 : 22;
  const statIconSize = isSmall ? 36 : 42;
  const avatarSize = isSmall ? 36 : 42;

  const loadStats = useCallback(async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));

      let totalAdmins = 0;
      let totalBanned = 0;
      let totalCategories = 0;
      let totalTransactions = 0;
      let totalIncome = 0;
      let totalExpense = 0;
      const recentUsers: PlatformStats["recentUsers"] = [];

      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();

        if (userData?.role === "admin") totalAdmins++;
        if (userData?.isBanned) totalBanned++;

        recentUsers.push({
          name: String(userData?.fullName ?? userData?.name ?? "No name"),
          email: String(userData?.email ?? ""),
          createdAt: userData?.createdAt,
        });

        try {
          const catsSnap = await getDocs(
            collection(db, "users", userDoc.id, "categories")
          );
          totalCategories += catsSnap.size;
        } catch {}

        try {
          const txSnap = await getDocs(
            collection(db, "users", userDoc.id, "transactions")
          );
          totalTransactions += txSnap.size;

          txSnap.docs.forEach((txDoc) => {
            const txData = txDoc.data();
            const amount = typeof txData.amount === "number" ? txData.amount : 0;
            if (txData.type === "income") {
              totalIncome += amount;
            } else {
              totalExpense += amount;
            }
          });
        } catch {}
      }

      recentUsers.sort((a, b) => {
        const getTime = (v: any) => {
          if (!v) return 0;
          if (typeof v.toDate === "function") return v.toDate().getTime();
          const d = new Date(v);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      });

      setStats({
        totalUsers: usersSnap.size,
        totalAdmins,
        totalBanned,
        totalCategories,
        totalTransactions,
        totalIncome,
        totalExpense,
        recentUsers: recentUsers.slice(0, 5),
      });
    } catch (err) {
      console.log("Load stats error:", err);
      Alert.alert("Lỗi", "Không thể tải thống kê.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading || !stats) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải thống kê...</Text>
      </SafeAreaView>
    );
  }

  const balance = stats.totalIncome - stats.totalExpense;
  const bottomPad = insets.bottom + 60;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thống kê hệ thống</Text>
        <Text style={styles.headerSubtitle}>Tổng quan hoạt động nền tảng</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.statsGrid}>
          {[
            {
              icon: "people",
              iconColor: "#3B82F6",
              iconBg: "#EFF6FF",
              value: stats.totalUsers,
              label: "Người dùng",
              accent: "#3B82F6",
            },
            {
              icon: "admin-panel-settings",
              iconColor: "#F59E0B",
              iconBg: "#FEF3C7",
              value: stats.totalAdmins,
              label: "Quản trị viên",
              accent: "#F59E0B",
            },
            {
              icon: "block",
              iconColor: "#EF4444",
              iconBg: "#FEE2E2",
              value: stats.totalBanned,
              label: "Bị cấm",
              accent: "#EF4444",
            },
            {
              icon: "category",
              iconColor: "#10B981",
              iconBg: "#DCFCE7",
              value: stats.totalCategories,
              label: "Danh mục",
              accent: "#10B981",
            },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[styles.statCard, { borderLeftColor: item.accent }]}
            >
              <View
                style={[
                  styles.statIconBox,
                  { backgroundColor: item.iconBg, width: statIconSize, height: statIconSize },
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={isSmall ? 18 : 22}
                  color={item.iconColor}
                />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>{item.value}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan tài chính</Text>

          <View style={styles.financeCard}>
            <View style={styles.financeRow}>
              <View style={styles.financeItem}>
                <View style={styles.financeIconRow}>
                  <MaterialIcons name="trending-up" size={isSmall ? 16 : 20} color="#10B981" />
                  <Text style={styles.financeLabel}>Tổng thu nhập</Text>
                </View>
                <Text style={[styles.financeValue, { color: "#10B981" }]} numberOfLines={1}>
                  +{stats.totalIncome.toLocaleString("vi-VN")}₫
                </Text>
              </View>

              <View style={styles.financeDivider} />

              <View style={styles.financeItem}>
                <View style={styles.financeIconRow}>
                  <MaterialIcons name="trending-down" size={isSmall ? 16 : 20} color="#EF4444" />
                  <Text style={styles.financeLabel}>Tổng chi tiêu</Text>
                </View>
                <Text style={[styles.financeValue, { color: "#EF4444" }]} numberOfLines={1}>
                  -{stats.totalExpense.toLocaleString("vi-VN")}₫
                </Text>
              </View>
            </View>

            <View style={styles.balanceDivider} />

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Chênh lệch toàn hệ thống</Text>
              <Text
                style={[
                  styles.balanceValue,
                  { color: balance >= 0 ? "#10B981" : "#EF4444" },
                ]}
                numberOfLines={1}
              >
                {balance >= 0 ? "+" : ""}
                {balance.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giao dịch</Text>

          <View style={styles.txStatsCard}>
            <View style={styles.txStatRow}>
              <View
                style={[
                  styles.txStatIcon,
                  { backgroundColor: "#EFF6FF", width: statIconSize, height: statIconSize },
                ]}
              >
                <MaterialIcons name="receipt-long" size={isSmall ? 18 : 22} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txStatLabel}>Tổng giao dịch</Text>
                <Text style={styles.txStatSub}>Trên toàn hệ thống</Text>
              </View>
              <Text style={styles.txStatValue}>{stats.totalTransactions}</Text>
            </View>

            <View style={[styles.txDivider, { marginLeft: statIconSize + SPACING.md }]} />

            <View style={styles.txStatRow}>
              <View
                style={[
                  styles.txStatIcon,
                  { backgroundColor: "#EFF6FF", width: statIconSize, height: statIconSize },
                ]}
              >
                <MaterialIcons name="person" size={isSmall ? 18 : 22} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txStatLabel}>Trung bình / người dùng</Text>
                <Text style={styles.txStatSub}>Số giao dịch mỗi user</Text>
              </View>
              <Text style={styles.txStatValue}>
                {stats.totalUsers > 0
                  ? Math.round(stats.totalTransactions / stats.totalUsers)
                  : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người dùng mới nhất</Text>

          <View style={styles.recentUsersCard}>
            {stats.recentUsers.map((user, index) => (
              <View key={index}>
                <View style={styles.recentUserRow}>
                  <View
                    style={[
                      styles.recentUserAvatar,
                      { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                    ]}
                  >
                    <Text style={[styles.recentUserAvatarText, { fontSize: isSmall ? 14 : 16 }]}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentUserName} numberOfLines={1}>{user.name}</Text>
                    <Text style={styles.recentUserEmail} numberOfLines={1}>{user.email}</Text>
                  </View>
                </View>
                {index < stats.recentUsers.length - 1 && (
                  <View style={[styles.recentUserDivider, { marginLeft: avatarSize + SPACING.md }]} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminUserManagement")}
        >
          <MaterialIcons name="admin-panel-settings" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Quản lý</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminCategories")}
        >
          <MaterialIcons name="dashboard" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Danh mục</Text>
        </TouchableOpacity>

        <View style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="bar-chart" size={tabIconSize} color="#3B82F6" />
          <Text style={styles.activeFooterText}>Thống kê</Text>
        </View>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminSetting")}
        >
          <MaterialIcons name="person" size={tabIconSize} color="#94A3B8" />
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
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: FONT_SIZE.titleLg,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#64748B",
    fontSize: FONT_SIZE.small,
    fontWeight: "500",
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBox: {
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZE.headingLg,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZE.small,
    fontWeight: "600",
    color: "#64748B",
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: SPACING.md,
  },
  financeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  financeRow: {
    flexDirection: "row",
  },
  financeItem: {
    flex: 1,
    gap: SPACING.sm,
  },
  financeIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  financeLabel: {
    fontSize: FONT_SIZE.small,
    fontWeight: "600",
    color: "#64748B",
  },
  financeValue: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "800",
  },
  financeDivider: {
    width: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: SPACING.lg,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: SPACING.lg,
  },
  balanceRow: {
    gap: 4,
  },
  balanceLabel: {
    fontSize: FONT_SIZE.small,
    fontWeight: "600",
    color: "#64748B",
  },
  balanceValue: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "800",
  },
  txStatsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  txStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  txStatIcon: {
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  txStatLabel: {
    fontSize: FONT_SIZE.bodyLg,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  txStatSub: {
    fontSize: FONT_SIZE.small,
    fontWeight: "500",
    color: "#64748B",
  },
  txStatValue: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "800",
    color: "#0F172A",
  },
  txDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: SPACING.md,
  },
  recentUsersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  recentUserAvatar: {
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  recentUserAvatarText: {
    color: "#3B82F6",
    fontWeight: "800",
  },
  recentUserName: {
    fontSize: FONT_SIZE.bodyMd,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  recentUserEmail: {
    fontSize: FONT_SIZE.small,
    fontWeight: "500",
    color: "#64748B",
  },
  recentUserDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
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
