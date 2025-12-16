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

  // 2c) Tính tổng thu/chi/số dư + map giao dịch gần đây
  useEffect(() => {
    if (!transactions) return;

    // Tính tổng thu / chi
    let income = 0;
    let expense = 0;

    transactions.forEach((tx: any) => {
      const rawAmount =
        typeof tx.mount === "number"
          ? tx.mount
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

    const mapped: UITransaction[] = latest.map((tx: any) => {
      const rawAmount =
        typeof tx.mount === "number"
          ? tx.mount
          : typeof tx.amount === "number"
          ? tx.amount
          : 0;

      const signedAmount =
        tx.type === "income" ? rawAmount : -rawAmount;

      const category = categories.find((c) => c.id === tx.categoryId);
      const icon = category?.icon || "category";
      const title = category?.name || "Khác";

      // subtitle = "dd/mm/yyyy • ghi chú"
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
        colorClass: category?.color || "#60A5FA",
        title,
        subtitle: subtitleParts.join(" • "),
      } as UITransaction;
    });

    setRecentTransactions(mapped);
  }, [transactions, categories]);


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
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
        <View style={[styles.balanceCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
            Tổng số dư
          </Text>
          <Text style={[styles.balanceAmount, { color: "#3c83f6" }]}>
            {amount !== null ? `${amount.toLocaleString("vi-VN")}₫` : "—"}
          </Text>
        </View>

        {/* Income/Expense Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Tổng thu
            </Text>
            <Text style={[styles.statValue, { color: "#22C55E" }]}>
              +{totalIncome.toLocaleString("vi-VN")}₫
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Tổng chi
            </Text>
            <Text style={[styles.statValue, { color: "#EF4444" }]}>
              -{totalExpense.toLocaleString("vi-VN")}₫
            </Text>
          </View>
        </View>

        {/* Monthly Report Card – 3 tháng gần nhất */}
        <MonthlyExpenseChart />


        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Giao dịch gần đây
          </Text>

          <View style={[styles.cardList, { backgroundColor: theme.cardBackground }]}>
            {(recentTransactions.length ? recentTransactions : []).map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.transactionItem}
                onPress={() => navigation.navigate("UpdateTransaction", { id: tx.id })}

              >
                <View
                  style={[styles.iconBox,{ backgroundColor: tx.colorClass + '33' }]}>
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
              <View style={{ padding: 16 }}>
                <Text style={{ color: theme.textSecondary }}>
                  Chưa có giao dịch nào.
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
            <TouchableOpacity onPress={() => navigation.navigate("GoalList")}>
              <Text style={styles.linkText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16 }}>
            {MOCK_GOALS.map((goal) => {
              const progress = Math.round(
                (goal.savedAmount / goal.targetAmount) * 100
              );
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, { backgroundColor: theme.cardBackground }]}
                  onPress={() => navigation.navigate("GoalDetail", { id: goal.id })}
                >
                  {/* ... phần Goals giữ nguyên như bạn ... */}
                </TouchableOpacity>
              );
            })}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f8",
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
