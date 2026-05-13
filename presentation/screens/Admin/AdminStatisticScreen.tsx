import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@services/firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

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
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

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

        // Categories
        try {
          const catsSnap = await getDocs(
            collection(db, "users", userDoc.id, "categories")
          );
          totalCategories += catsSnap.size;
        } catch {}

        // Transactions
        try {
          const txSnap = await getDocs(
            collection(db, "users", userDoc.id, "transactions")
          );
          totalTransactions += txSnap.size;

          txSnap.docs.forEach((txDoc) => {
            const txData = txDoc.data();
            const amount =
              typeof txData.amount === "number" ? txData.amount : 0;
            if (txData.type === "income") {
              totalIncome += amount;
            } else {
              totalExpense += amount;
            }
          });
        } catch {}
      }

      // Sort recent users by createdAt desc
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải thống kê...</Text>
      </View>
    );
  }

  const balance = stats.totalIncome - stats.totalExpense;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thống kê hệ thống</Text>
        <Text style={styles.headerSubtitle}>Tổng quan hoạt động nền tảng</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: "#6366F1" }]}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(99,102,241,0.15)" }]}>
              <MaterialIcons name="people" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Người dùng</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: "#F59E0B" }]}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(245,158,11,0.15)" }]}>
              <MaterialIcons name="admin-panel-settings" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{stats.totalAdmins}</Text>
            <Text style={styles.statLabel}>Quản trị viên</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: "#EF4444" }]}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(239,68,68,0.15)" }]}>
              <MaterialIcons name="block" size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>{stats.totalBanned}</Text>
            <Text style={styles.statLabel}>Bị cấm</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: "#10B981" }]}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
              <MaterialIcons name="category" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{stats.totalCategories}</Text>
            <Text style={styles.statLabel}>Danh mục</Text>
          </View>
        </View>

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan tài chính</Text>

          <View style={styles.financeCard}>
            <View style={styles.financeRow}>
              <View style={styles.financeItem}>
                <View style={styles.financeIconRow}>
                  <MaterialIcons name="trending-up" size={20} color="#10B981" />
                  <Text style={styles.financeLabel}>Tổng thu nhập</Text>
                </View>
                <Text style={[styles.financeValue, { color: "#10B981" }]}>
                  +{stats.totalIncome.toLocaleString("vi-VN")}₫
                </Text>
              </View>

              <View style={styles.financeDivider} />

              <View style={styles.financeItem}>
                <View style={styles.financeIconRow}>
                  <MaterialIcons name="trending-down" size={20} color="#EF4444" />
                  <Text style={styles.financeLabel}>Tổng chi tiêu</Text>
                </View>
                <Text style={[styles.financeValue, { color: "#EF4444" }]}>
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
              <View style={[styles.txStatIcon, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
                <MaterialIcons name="receipt-long" size={22} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txStatLabel}>Tổng giao dịch</Text>
                <Text style={styles.txStatSub}>Trên toàn hệ thống</Text>
              </View>
              <Text style={styles.txStatValue}>{stats.totalTransactions}</Text>
            </View>

            <View style={styles.txDivider} />

            <View style={styles.txStatRow}>
              <View style={[styles.txStatIcon, { backgroundColor: "rgba(99,102,241,0.15)" }]}>
                <MaterialIcons name="person" size={22} color="#6366F1" />
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
                  <View style={styles.recentUserAvatar}>
                    <Text style={styles.recentUserAvatarText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentUserName}>{user.name}</Text>
                    <Text style={styles.recentUserEmail}>{user.email}</Text>
                  </View>
                </View>
                {index < stats.recentUsers.length - 1 && (
                  <View style={styles.recentUserDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        {/* Quản lý */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminUserManagement")}
        >
          <MaterialIcons name="admin-panel-settings" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Quản lý</Text>
        </TouchableOpacity>

        {/* Danh mục */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminCategories")}
        >
          <MaterialIcons name="dashboard" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Danh mục</Text>
        </TouchableOpacity>

        {/* Thống kê - Active */}
        <TouchableOpacity style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="bar-chart" size={22} color="#FFFFFF" />
          <Text style={styles.activeFooterText}>Thống kê</Text>
        </TouchableOpacity>

        {/* Cá nhân */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminSetting")}
        >
          <MaterialIcons name="person" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
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

  loadingText: {
    marginTop: 12,
    color: "#CBD5E1",
    fontSize: 15,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  headerSubtitle: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 14,
  },

  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    width: "47%",
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderLeftWidth: 4,
  },

  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
  },

  financeCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  financeRow: {
    flexDirection: "row",
  },

  financeItem: {
    flex: 1,
    gap: 8,
  },

  financeIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  financeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },

  financeValue: {
    fontSize: 18,
    fontWeight: "800",
  },

  financeDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 16,
  },

  balanceDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 16,
  },

  balanceRow: {
    gap: 6,
  },

  balanceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },

  balanceValue: {
    fontSize: 24,
    fontWeight: "800",
  },

  txStatsCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  txStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 6,
  },

  txStatIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  txStatLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  txStatSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },

  txStatValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  txDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 12,
    marginLeft: 60,
  },

  recentUsersCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  recentUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },

  recentUserAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  recentUserAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  recentUserName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  recentUserEmail: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
  },

  recentUserDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 58,
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
