import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

import { useTheme } from "@context/ThemeContext";
import { getCurrentUserProfile } from "@services/auth.service";
import { auth } from "@services/firebase/firebaseConfig";

import { listenCategories } from "@services/category.service";
import { getSavingGoalsByUser } from "@services/savingGoals.service";
import { listenTransactions } from "@services/transaction.service";
import type {
  Category,
  UITransaction,
} from "@type/types";
import { SavingGoal } from "@type/types";
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
  const [recentTransactions, setRecentTransactions] = useState<UITransaction[]>(
    []
  );
  const [goals, setGoals] = useState<SavingGoal[]>([]);

  const [transactions, setTransactions] = useState<any[]>([]);

  // 1) Load profile (tên + avatar)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();

        // TÊN
        if (profile?.fullName) {
          setDisplayName(profile.fullName);
        } else if (auth.currentUser?.email) {
          setDisplayName(auth.currentUser.email.split("@")[0]);
        } else {
          setDisplayName("Người dùng");
        }

        // AVATAR
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

  // 2a) Listen danh mục
  useEffect(() => {
    const unsubCats = listenCategories(setCategories);
    return () => unsubCats?.();
  }, []);

  // 2b) Listen giao dịch
  useEffect(() => {
    const unsubTx = listenTransactions(
      (list: any[]) => {
        setTransactions(list);
      },
      (err) => {
        console.log("listenTransactions error", err);
      }
    );

    return () => unsubTx?.();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const loadGoals = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const data = await getSavingGoalsByUser(user.uid);
        setGoals(data.slice(0, 3)); // chỉ lấy 3 mục tiêu
      };

      loadGoals();
    }, [])
  );

  // 2c) Tính tổng thu/chi/số dư + map giao dịch gần đây
  useEffect(() => {
    if (!transactions) return;

    // Tính tổng thu / chi
    let income = 0;
    let expense = 0;

    transactions.forEach((tx: any) => {
      const rawAmount =
        typeof tx.amount === "number"
          ? tx.amount
          : typeof tx.amount === "number"
          ? tx.amount
          : 0;

      if (tx.type === "income") {
        income += rawAmount;
      } else {
        expense += rawAmount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setAmount(income - expense); // số dư

    // Sắp xếp giao dịch mới nhất
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

    const latest = sorted.slice(0, 3); // 3 giao dịch gần nhất

    // Map sang UITransaction
    const mapped: UITransaction[] = latest.map((tx: any) => {
  const category = categories.find(c => c.id === tx.categoryId);

  // 👉 TITLE = DANH MỤC
  const title = category?.name || "Khác";

  // 👉 SUBTITLE = TÊN GIAO DỊCH + NGÀY
  const subtitleParts: string[] = [];

  if (tx.title) {
    subtitleParts.push(tx.title);
  }

  // 👉 PARSE DATE (BẮT BUỘC cho UITransaction)
  const v = tx.date || tx.createdAt;
  let date: Date = new Date();

  if (v) {
    if (typeof v.toDate === "function") {
      date = v.toDate();
    } else {
      const tmp = new Date(v);
      if (!isNaN(tmp.getTime())) date = tmp;
    }
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  subtitleParts.push(`${day}/${month}/${year}`);

  return {
    id: tx.id,
    type: tx.type,
    amount: tx.type === "income" ? tx.amount : -tx.amount,
    icon:
      (category?.icon as keyof typeof MaterialIcons.glyphMap) ??
      (tx.type === "income" ? "trending-up" : "trending-down"),

    colorClass: category?.color || "#60A5FA",
    title,                               // 👈 DANH MỤC
    subtitle: subtitleParts.join(" • "), // 👈 TÊN GIAO DỊCH
    date,                                // ✅ BẮT BUỘC – FIX LỖI TYPESCRIPT
  };
});


setRecentTransactions(mapped);


    setRecentTransactions(mapped);
  }, [transactions, categories]);

  return (
<SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{ uri: avatarUrl || DEFAULT_AVATAR }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                Xin chào,
              </Text>
              <Text style={[styles.username, { color: theme.textPrimary }]}>
                {displayName || "Người dùng"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: isDarkMode ? theme.cardBackground : '#F8FAFC', borderColor: isDarkMode ? theme.border : '#E2E8F0' },
            ]}
            onPress={() => navigation.navigate("Notifications")}
          >
            <MaterialIcons
              name="notifications"
              size={24}
              color={theme.textPrimary}
            />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF' }]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
            Tổng số dư
          </Text>
          <Text style={[styles.balanceAmount, { color: "#3B82F6" }]}>
            {amount !== null ? `${amount.toLocaleString("vi-VN")}₫` : "—"}
          </Text>
        </View>

        {/* Income/Expense Grid */}
        <View style={styles.statsGrid}>
          <View
            style={[styles.statCard, { backgroundColor: theme.cardBackground }]}
          >
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Tổng thu
            </Text>
            <Text style={[styles.statValue, { color: "#22C55E" }]}>
              +{totalIncome.toLocaleString("vi-VN")}₫
            </Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: theme.cardBackground }]}
          >
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Tổng chi
            </Text>
            <Text style={[styles.statValue, { color: "#EF4444" }]}>
              -{totalExpense.toLocaleString("vi-VN")}₫
            </Text>
          </View>
        </View>

        {/* Monthly Report Card – 3 tháng gần nhất */}
        <View style={styles.section}>
          <MonthlyExpenseChart />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Giao dịch gần đây
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
              <Text style={styles.linkText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.cardList, { backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF' }]}>
            {(recentTransactions.length ? recentTransactions : []).map((tx, index) => (
              <TouchableOpacity
                key={tx.id}
                style={[
                  styles.transactionItem,
                  index < recentTransactions.length - 1 && styles.transactionItemBorder
                ]}
                onPress={() => navigation.navigate("UpdateTransaction", { id: tx.id })}
              >
                <View
                  style={[styles.iconBox, { backgroundColor: tx.colorClass + '20' }]}>
                  <MaterialIcons
                    name={tx.icon as any}
                    size={24}
                    color={tx.colorClass}
                  />
                </View>

                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: theme.textPrimary }]}>
                    {tx.title}
                  </Text>
                  <Text style={[styles.txSubtitle, { color: theme.textSecondary }]}>
                    {tx.subtitle}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === "income" ? "#22C55E" : "#EF4444" },
                  ]}
                >
                  {tx.amount >= 0 ? "+" : "-"}
                  {Math.abs(tx.amount).toLocaleString("vi-VN")}₫
                </Text>
              </TouchableOpacity>
            ))}

            {!recentTransactions.length ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="receipt-long" size={48} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Chưa có giao dịch nào
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Mục tiêu tiết kiệm
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => navigation.navigate("GoalList")}>
                <Text style={styles.linkText}>Xem tất cả</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("AddGoals")}>
                <MaterialIcons name="add" size={22} color="#3c83f6" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ gap: 16 }}>
            {goals.length === 0 ? (
              <Text style={{ color: "#999", marginTop: 8 }}>
                Chưa có mục tiêu tiết kiệm
              </Text>
            ) : (
              goals.map((goal) => {
                const progress =
                  goal.targetAmount > 0
                    ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
                    : 0;

                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalCard,
                      { backgroundColor: theme.cardBackground },
                    ]}
                    onPress={() =>
                      navigation.navigate("GoalDetail", { id: goal.id })
                    }
                  >
                    {/* Title */}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: theme.textPrimary,
                      }}
                    >
                      {goal.title}
                    </Text>

                    {/* Amount */}
                    <Text style={{ marginTop: 4, color: theme.textSecondary }}>
                      {goal.currentAmount.toLocaleString()} /{" "}
                      {goal.targetAmount.toLocaleString()} đ
                    </Text>

                    {/* Progress bar */}
                    <View
                      style={{
                        height: 8,
                        backgroundColor: "#E5E7EB",
                        borderRadius: 10,
                        marginTop: 10,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          height: "100%",
                          backgroundColor: "#4C6EF5",
                        }}
                      />
                    </View>

                    {/* Percentage */}
                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: "#4C6EF5",
                        fontWeight: "500",
                      }}
                    >
                      {progress}% hoàn thành
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddTransaction")}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#EFF6FF",
  },
  greeting: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: "#EF4444",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "white",
  },
  balanceCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#3c83f6",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  balanceContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  balanceIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 8,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3c83f6",
  },
  cardList: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  txSubtitle: {
    fontSize: 13,
  },
  txAmount: {
    fontWeight: "700",
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: "500",
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  goalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  goalProgress: {
    gap: 12,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 13,
    fontWeight: "500",
  },
  progressTextBold: {
    fontSize: 13,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  amountValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3c83f6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3c83f6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default HomeScreen;
