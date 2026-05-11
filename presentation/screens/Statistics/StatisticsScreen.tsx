import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@context/ThemeContext";
import {
  listenTransactions,
  Transaction as DbTransaction,
} from "@services/transaction.service";
import { listenCategories } from "@services/category.service";
import type { Category } from "@type/types";
import { useNavigation } from "@react-navigation/native";

/* ================= TYPES ================= */

type FilterType = "all" | "7days" | "3days";

interface UITransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: Date;
  type: "income" | "expense";
}

/* ================= UTILS ================= */

const formatDateDDMMYYYY = (date: Date | any) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/* ================= SCREEN ================= */

const StatisticsScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  const [transactions, setTransactions] = useState<UITransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("7days");
  const [rawTransactions, setRawTransactions] = useState<DbTransaction[]>([]);
  const navigation = useNavigation<any>();
  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const unsub = listenCategories(setCategories);
    return () => unsub?.();
  }, []);

  useEffect(() => {
    const unsub = listenTransactions(
      (list: DbTransaction[]) => {
        setRawTransactions(list);
      },
      (err) => console.log("listenTransactions error", err)
    );

    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!rawTransactions.length) {
      setTransactions([]);
      return;
    }

    const mapped: UITransaction[] = rawTransactions.map((tx) => {
      const category = categories.find(c => c.id === tx.categoryId);

      // TITLE = TÊN GIAO DỊCH (hiển thị rõ ràng)
      const title = tx.title || "Không có tiêu đề";

      // SUBTITLE = DANH MỤC
      const subtitle = category?.name || "Khác";

      return {
        id: tx.id,
        title, // 👈 TÊN GIAO DỊCH
        subtitle, // 👈 DANH MỤC
        amount: tx.type === "income" ? tx.amount : -tx.amount,
        date: tx.date,
        type: tx.type,
        icon:
          category?.icon ||
          (tx.type === "income" ? "trending-up" : "trending-down"),
        color: category?.color,
      };
    });

    setTransactions(mapped);
  }, [rawTransactions, categories]);

  /* ================= FILTER ================= */

  const filteredTransactions = useMemo(() => {
    const today = new Date();

    return transactions.filter((tx) => {
      // SEARCH - tìm cả title và subtitle
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(searchLower);
        const matchSubtitle = tx.subtitle.toLowerCase().includes(searchLower);
        if (!matchTitle && !matchSubtitle) {
          return false;
        }
      }

      // ALL → không lọc theo ngày
      if (filter === "all") return true;

      const txDate = tx.date;
      if (!txDate) return true;

      const diffDays = (today.getTime() - txDate.getTime()) / 86400000;

      if (filter === "7days") return diffDays <= 7;
      if (filter === "3days") return diffDays <= 3;

      return true;
    });
  }, [transactions, searchTerm, filter]);

  /* ================= UI ================= */

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF' }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Giao dịch
        </Text>
      </View>

      {/* SEARCH - CỐ ĐỊNH */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
              borderColor: isDarkMode ? theme.border : '#E5E7EB',
            },
          ]}
        >
          <MaterialIcons
            name="search"
            size={22}
            color={theme.textSecondary}
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Tìm giao dịch hoặc danh mục..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm("")} activeOpacity={0.7}>
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* FILTER - CỐ ĐỊNH */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { key: "all", label: "Tất cả" },
            { key: "3days", label: "3 ngày gần nhất" }, // 👈 ĐỔI THỨ TỰ
            { key: "7days", label: "7 ngày gần nhất" },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key as FilterType)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.key 
                    ? "#3c83f6" 
                    : isDarkMode ? theme.cardBackground : '#F9FAFB',
                  borderColor: filter === f.key
                    ? "#3c83f6"
                    : isDarkMode ? theme.border : '#E5E7EB',
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: filter === f.key ? "#fff" : theme.textPrimary,
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LIST - CHỈ PHẦN NÀY SCROLL */}
      <ScrollView 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.listTitle, { color: theme.textPrimary }]}>
          Danh sách giao dịch
        </Text>

        {filteredTransactions.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB' }]}>
            <MaterialIcons
              name="receipt-long"
              size={48}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Không có giao dịch
            </Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === "income";

            return (
              <TouchableOpacity
  key={tx.id}
  style={[
    styles.card,
    { backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF' },
  ]}
  activeOpacity={0.7}
  onPress={() =>
    navigation.navigate("UpdateTransaction", { id: tx.id })
  }
>

                {/* ICON */}
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isIncome
                        ? "#DCFCE7"
                        : "#FEE2E2",
                    },
                  ]}
                >
                  <MaterialIcons
                    name={isIncome ? "trending-up" : "trending-down"}
                    size={24}
                    color={isIncome ? "#22C55E" : "#EF4444"}
                  />
                </View>

                {/* INFO */}
                <View style={{ flex: 1 }}>
                  {/* TÊN GIAO DỊCH */}
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                    {tx.title}
                  </Text>

                  {/* DANH MỤC */}
                  <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                    {tx.subtitle}
                  </Text>

                  {/* NGÀY */}
                  <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
                    {formatDateDDMMYYYY(tx.date)}
                  </Text>
                </View>

                {/* AMOUNT */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.cardAmount,
                      { color: isIncome ? "#22C55E" : "#EF4444" },
                    ]}
                  >
                    {isIncome ? "+" : "-"}
                    {Math.abs(tx.amount).toLocaleString()}₫
                  </Text>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor: isIncome
                          ? "#DCFCE7"
                          : "#FEE2E2",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: isIncome ? "#22C55E" : "#EF4444" },
                      ]}
                    >
                      {isIncome ? "Thu" : "Chi"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default StatisticsScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'transparent', // Đảm bảo không bị che
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  filterContainer: {
    paddingBottom: 12,
    backgroundColor: 'transparent', // Đảm bảo không bị che
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    gap: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: "500",
  },
  cardAmount: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 12,
  },
});