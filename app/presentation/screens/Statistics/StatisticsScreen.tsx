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
import { useTheme } from "../../../context/ThemeContext";
import {
  listenTransactions,
  Transaction as DbTransaction,
} from "../../../services/transaction.service";

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
  const { theme } = useTheme();

  const [transactions, setTransactions] = useState<UITransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("7days");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const unsub = listenTransactions(
      (list: DbTransaction[]) => {
        const mapped: UITransaction[] = list.map((tx) => ({
          id: tx.id,
          title: tx.title || "Giao dịch",
          subtitle: tx.note || "",
          amount: tx.type === "income" ? tx.amount : -tx.amount,
          date: tx.date,
          type: tx.type,
        }));

        setTransactions(mapped);
      },
      (err) => console.log("listenTransactions error", err)
    );

    return () => unsub?.();
  }, []);

  /* ================= FILTER ================= */

  const filteredTransactions = useMemo(() => {
    const today = new Date();

    return transactions.filter((tx) => {
      // SEARCH
      if (
        searchTerm &&
        !tx.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // ALL → không lọc theo ngày
      if (filter === "all") return true;

      const txDate = tx.date;
      if (!txDate) return true;

      const diffDays =
        (today.getTime() - txDate.getTime()) / 86400000;

      if (filter === "7days") return diffDays <= 7;
      if (filter === "3days") return diffDays <= 3;

      return true;
    });
  }, [transactions, searchTerm, filter]);

  /* ================= UI ================= */

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Giao dịch
        </Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <MaterialIcons
            name="search"
            size={22}
            color={theme.textSecondary}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Tìm theo mô tả..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {[
          { key: "all", label: "Tất cả" },
          { key: "7days", label: "7 ngày gần nhất" },
          { key: "3days", label: "3 ngày gần nhất" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key as FilterType)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === f.key ? "#3c83f6" : theme.cardBackground,
              },
            ]}
          >
            <Text
              style={{
                color: filter === f.key ? "#fff" : theme.textPrimary,
                fontWeight: "600",
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}
      <ScrollView contentContainerStyle={styles.listContent}>
        <Text style={[styles.listTitle, { color: theme.textPrimary }]}>
          Danh sách giao dịch
        </Text>

        {filteredTransactions.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons
              name="receipt-long"
              size={48}
              color={theme.textSecondary}
            />
            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>
              Không có giao dịch
            </Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === "income";

            return (
              <View
                key={tx.id}
                style={[
                  styles.card,
                  { backgroundColor: theme.cardBackground },
                ]}
              >
                {/* ICON */}
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isIncome
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(239,68,68,0.15)",
                    },
                  ]}
                >
                  <MaterialIcons
                    name={isIncome ? "arrow-downward" : "arrow-upward"}
                    size={22}
                    color={isIncome ? "#22C55E" : "#EF4444"}
                  />
                </View>

                {/* INFO */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontWeight: "600", color: theme.textPrimary }}
                  >
                    {tx.title}
                  </Text>

                  <Text
                    style={{
                      fontSize: 13,
                      color: theme.textSecondary,
                    }}
                  >
                    {formatDateDDMMYYYY(tx.date)}
                  </Text>

                  {tx.subtitle ? (
                    <Text style={{ color: theme.textSecondary }}>
                      {tx.subtitle}
                    </Text>
                  ) : null}
                </View>

                {/* AMOUNT */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: isIncome ? "#22C55E" : "#EF4444",
                    }}
                  >
                    {isIncome ? "+" : "-"}
                    {Math.abs(tx.amount).toLocaleString()}₫
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                    {isIncome ? "Thu" : "Chi"}
                  </Text>
                </View>
              </View>
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
  },
  header: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },
});
