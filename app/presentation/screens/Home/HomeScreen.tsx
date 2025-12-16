import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MOCK_GOALS } from "../../../../constants/constants";
import { useTheme } from "../../../context/ThemeContext";
import { getCurrentUserProfile } from "../../../services/auth.service";
import { auth } from "../../../services/firebase/firebaseConfig";
import { listenCategories } from "../../../services/category.service";
import { listenTransactions } from "../../../services/transaction.service";
import type { Category, Transaction as UITransaction } from "../../../type/types";
import MonthlyExpenseChart from "../Home/MonthlyExpenseChart";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_vMSFQARLvGWesaN0bPwdT0TwBkCjQuK-p1dyFrGdqF-NhAqX3D22UFhPgycZkrUA24cKIcSZEPLOfhmUcNZTvYIXtJBvgXlaRUnPVCaQ5zWzrC0n45kOlTptHz4fEKjcJrTwoasD3u6BnAo6DO1bJ2oe7sNZMz4X8J4ZExMW6HBrFk1JAZloRwzDfjdw4WOSE8HcBg82M53Zk1lZ9igZ6sqHdz0lO3Cvw1h6_YE38kL45oHN1DtJsD26XLF9ECZDyI3c-2ms-qO0";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();

  const [displayName, setDisplayName] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<UITransaction[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile?.fullName) {
          setDisplayName(profile.fullName);
        } else if (auth.currentUser?.email) {
          setDisplayName(auth.currentUser.email.split("@")[0]);
        } else {
          setDisplayName("Người dùng");
        }
        if (profile?.photoUrl && profile.photoUrl.trim() !== "") {
          setAvatarUrl(profile.photoUrl);
        } else if (auth.currentUser?.photoURL) {
          setAvatarUrl(auth.currentUser.photoURL);
        } else {
          setAvatarUrl(null);
        }
      } catch (error) {
        console.log("LOAD PROFILE ERROR >>>", error);
        setDisplayName("Người dùng");
        setAvatarUrl(null);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const unsubCats = listenCategories(setCategories);
    return () => unsubCats?.();
  }, []);

  useEffect(() => {
    const unsubTx = listenTransactions(
      (list: any[]) => setTransactions(list),
      (err) => console.log("listenTransactions error", err)
    );
    return () => unsubTx?.();
  }, []);

  useEffect(() => {
    if (!transactions) return;
    let income = 0;
    let expense = 0;
    transactions.forEach((tx: any) => {
      const rawAmount = typeof tx.mount === "number" ? tx.mount : typeof tx.amount === "number" ? tx.amount : 0;
      if (tx.type === "income") income += rawAmount;
      else expense += rawAmount;
    });
    setTotalIncome(income);
    setTotalExpense(expense);
    setAmount(income - expense);

    const sorted = [...transactions].sort((a: any, b: any) => {
      const getTime = (t: any) => {
        const v = t.date || t.createdAt;
        if (!v) return 0;
        if (typeof v.toDate === "function") return v.toDate().getTime();
        const d = new Date(v);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      };
      return getTime(b) - getTime(a);
    });

    const latest = sorted.slice(0, 3);
    const mapped: UITransaction[] = latest.map((tx: any) => {
      const rawAmount = typeof tx.mount === "number" ? tx.mount : typeof tx.amount === "number" ? tx.amount : 0;
      const signedAmount = tx.type === "income" ? rawAmount : -rawAmount;
      const category = categories.find((c) => c.id === tx.categoryId);
      const icon = category?.icon || "category";
      const title = category?.name || "Khác";
      const subtitleParts: string[] = [];
      const v = tx.date || tx.createdAt;
      if (v) {
        let d: Date | null = null;
        if (typeof v.toDate === "function") d = v.toDate();
        else {
          const tmp = new Date(v);
          if (!isNaN(tmp.getTime())) d = tmp;
        }
        if (d) {
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          subtitleParts.push(`${day}/${month}/${year}`);
        }
      }
      if (tx.note) subtitleParts.push(tx.note);
      return {
        id: tx.id,
        type: tx.type,
        amount: signedAmount,
        icon,
        title,
        subtitle: subtitleParts.join(" • "),
      } as UITransaction;
    });
    setRecentTransactions(mapped);
  }, [transactions, categories]);

  // Card background: sáng dùng #f8f9fa, tối giữ nguyên
  const cardBg = isDarkMode ? theme.cardBackground : '#f8f9fa';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image source={{ uri: avatarUrl || DEFAULT_AVATAR }} style={styles.avatar} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>Xin chào,</Text>
              <Text style={[styles.username, { color: theme.textPrimary }]}>{displayName || "Người dùng"}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: cardBg, borderColor: isDarkMode ? theme.border : '#e5e7eb' }]}
            onPress={() => navigation.navigate("Notifications")}
          >
            <MaterialIcons name="notifications" size={24} color={theme.textPrimary} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Tổng số dư</Text>
          <Text style={[styles.balanceAmount, { color: "#3c83f6" }]}>
            {amount !== null ? `${amount.toLocaleString("vi-VN")}₫` : "—"}
          </Text>
        </View>

        {/* Income/Expense Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tổng thu</Text>
            <Text style={[styles.statValue, { color: "#22C55E" }]}>+{totalIncome.toLocaleString("vi-VN")}₫</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tổng chi</Text>
            <Text style={[styles.statValue, { color: "#EF4444" }]}>-{totalExpense.toLocaleString("vi-VN")}₫</Text>
          </View>
        </View>

        {/* Monthly Report Card */}
        <MonthlyExpenseChart />

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Giao dịch gần đây</Text>
          <View style={[styles.cardList, { backgroundColor: cardBg }]}>
            {(recentTransactions.length ? recentTransactions : []).map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.transactionItem}
                onPress={() => navigation.navigate("UpdateTransaction", { id: tx.id })}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: tx.type === "income"
                        ? isDarkMode ? "rgba(34, 197, 94, 0.2)" : "rgba(34, 197, 94, 0.1)"
                        : isDarkMode ? "rgba(60, 131, 246, 0.2)" : "rgba(60, 131, 246, 0.1)",
                    },
                  ]}
                >
                  <MaterialIcons name={tx.icon as any} size={24} color={tx.type === "income" ? "#22C55E" : "#3c83f6"} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: theme.textPrimary }]}>{tx.title}</Text>
                  <Text style={[styles.txSubtitle, { color: theme.textSecondary }]}>{tx.subtitle}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === "income" ? "#22C55E" : "#EF4444" }]}>
                  {tx.amount >= 0 ? "+" : "-"}
                  {Math.abs(tx.amount).toLocaleString("vi-VN")}₫
                </Text>
              </TouchableOpacity>
            ))}
            {!recentTransactions.length && (
              <View style={{ padding: 16 }}>
                <Text style={{ color: theme.textSecondary }}>Chưa có giao dịch nào.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Mục tiêu tiết kiệm</Text>
            <TouchableOpacity onPress={() => navigation.navigate("GoalList")}>
              <Text style={styles.linkText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 16 }}>
            {MOCK_GOALS.map((goal) => {
              const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100);
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, { backgroundColor: cardBg }]}
                  onPress={() => navigation.navigate("GoalDetail", { id: goal.id })}
                >
                  <View style={styles.goalHeader}>
                    <Text style={[styles.goalTitle, { color: theme.textPrimary }]}>{goal.title}</Text>
                    <View style={[styles.statusBadge, {
                      backgroundColor: goal.status === "ongoing" ? (isDarkMode ? '#1e3a5f' : '#EFF6FF')
                        : goal.status === "completed" ? (isDarkMode ? '#1e3d2e' : '#F0FDF4')
                        : (isDarkMode ? '#374151' : '#E2E8F0')
                    }]}>
                      <Text style={[styles.statusText, {
                        color: goal.status === "ongoing" ? (isDarkMode ? '#60a5fa' : '#2563EB')
                          : goal.status === "completed" ? '#16A34A' : '#475569'
                      }]}>
                        {goal.status === "ongoing" ? "Đang tiến hành" : goal.status === "completed" ? "Hoàn thành" : "Đã hủy"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.goalProgress}>
                    <View style={styles.progressLabels}>
                      <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                        {goal.status === "completed" ? "Đã đạt mục tiêu" : goal.status === "cancelled" ? "Mục tiêu đã hủy" : "Đúng tiến độ"}
                      </Text>
                      <Text style={[styles.progressTextBold, { color: theme.textPrimary }]}>{progress}% đã tiết kiệm</Text>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? theme.divider : '#e5e7eb' }]}>
                      <View style={[styles.progressBarFill, {
                        width: `${progress}%`,
                        backgroundColor: goal.status === "ongoing" ? "#3c83f6" : goal.status === "completed" ? "#22C55E" : "#9CA3AF"
                      }]} />
                    </View>
                    <View style={styles.progressAmounts}>
                      <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
                        Đã tiết kiệm: <Text style={[styles.amountValue, { color: theme.textPrimary }]}>{goal.savedAmount.toLocaleString()}₫</Text>
                      </Text>
                      <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
                        Mục tiêu: <Text style={[styles.amountValue, { color: theme.textPrimary }]}>{goal.targetAmount.toLocaleString()}₫</Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddTransaction")}>
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "white",
  },
  greeting: {
    fontSize: 12,
    color: "#60708a",
    fontWeight: "500",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111418",
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: "#EF4444",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "white",
  },
  balanceCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#60708a",
    fontWeight: "500",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3c83f6",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#60708a",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reportCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111418",
  },
  reportAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111418",
    marginVertical: 4,
  },
  reportTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trendText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
  },
  chartContainer: {
    flexDirection: "row",
    height: 120,
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3c83f6",
  },
  cardList: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111418",
  },
  txSubtitle: {
    fontSize: 14,
    color: "#60708a",
  },
  txAmount: {
    fontWeight: "bold",
    fontSize: 16,
  },
  goalCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111418",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  goalProgress: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 12,
    color: "#60708a",
    fontWeight: "500",
  },
  monthLabel: {
  marginTop: 8,
  fontSize: 12,
  textAlign: "center",
  },

  progressTextBold: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111418",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: {
    fontSize: 12,
    color: "#60708a",
  },
  amountValue: {
    color: "#111418",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3c83f6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#3c83f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeScreen;
