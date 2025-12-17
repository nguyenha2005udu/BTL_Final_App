import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { listenTransactions } from "../../../services/transaction.service";

// Nếu chỗ khác không dùng auth nữa thì có thể xoá import auth

const MonthlyExpenseChart: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  // [2 tháng trước, tháng trước, tháng hiện tại]
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>([0, 0, 0]);
  const [monthLabels, setMonthLabels] = useState<string[]>(["", "", ""]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // 🔹 Lắng nghe danh sách giao dịch (thu/chi) của user
  useEffect(() => {
    const unsub = listenTransactions(
      (list: any[]) => {
        setTransactions(list ?? []);
      },
      (err) => {
        console.log("listenTransactions error in chart", err);
      }
    );

    return () => {
      unsub?.();
    };
  }, []);

  // 🔹 Tính chi tiêu 3 tháng gần nhất từ danh sách transactions đã load
  useEffect(() => {
    const now = new Date();

    // Tính ra 3 tháng: 2 tháng trước, tháng trước, tháng hiện tại (cũ -> mới)
    const monthInfos: { year: number; month: number; label: string }[] = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthInfos.push({
        year: d.getFullYear(),
        month: d.getMonth(), // 0–11
        label: `Th${d.getMonth() + 1}`,
      });
    }

    // label dưới cột
    setMonthLabels(monthInfos.map((m) => m.label));

    // Nếu chưa có giao dịch thì reset 0
    if (!transactions || !transactions.length) {
      setMonthlyExpenses([0, 0, 0]);
      return;
    }

    const totals = [0, 0, 0];

    transactions.forEach((tx: any) => {
      // chỉ lấy chi tiêu
      if (tx.type !== "expense") return;

      // lấy ngày từ date hoặc createdAt
      const v = tx.date || tx.createdAt;
      if (!v) return;

      let d: Date | null = null;
      if (typeof v.toDate === "function") {
        d = v.toDate(); // Timestamp
      } else {
        const tmp = new Date(v); // string / number / Date
        if (!isNaN(tmp.getTime())) d = tmp;
      }
      if (!d) return;

      const m = d.getMonth();
      const y = d.getFullYear();

      // tìm xem thuộc tháng nào trong 3 tháng gần nhất
      const idx = monthInfos.findIndex(
        (info) => info.month === m && info.year === y
      );
      if (idx === -1) return;

      // lấy số tiền
      const mount =
        typeof tx.mount === "number"
          ? tx.mount
          : typeof tx.amount === "number"
          ? tx.amount
          : Number(tx.mount ?? tx.amount ?? 0);

      if (!Number.isNaN(mount)) {
        totals[idx] += mount;
      }
    });

    setMonthlyExpenses(totals);
  }, [transactions]);

  const currentMonthExpense = monthlyExpenses[2] || 0;
  const prevMonthExpense = monthlyExpenses[1] || 0;

  const changePercent =
    prevMonthExpense > 0
      ? ((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 100
      : 0;

  // Tính % chiều cao cột
  const monthlyBars = useMemo(() => {
    const max = Math.max(...monthlyExpenses);
    if (!max) return [0, 0, 0];
    return monthlyExpenses.map((v) => Math.round((v / max) * 100));
  }, [monthlyExpenses]);

  return (
    <View style={[styles.reportCard, { backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
      <Text style={[styles.reportTitle, { color: theme.textPrimary }]}>
        Chi tiêu 3 tháng gần nhất
      </Text>

      <Text style={[styles.reportAmount, { color: theme.textPrimary }]}>
        {currentMonthExpense.toLocaleString("vi-VN")}₫
      </Text>

      <View style={styles.reportTrend}>
        <MaterialIcons
          name={
            prevMonthExpense > 0
              ? changePercent > 0
                ? "arrow-upward"
                : changePercent < 0
                ? "arrow-downward"
                : "horizontal-rule"
              : "horizontal-rule"
          }
          size={16}
          color={
            prevMonthExpense > 0
              ? changePercent > 0
                ? "#EF4444"
                : changePercent < 0
                ? "#22C55E"
                : theme.textSecondary
              : theme.textSecondary
          }
        />
        <Text style={[styles.trendText, { color: theme.textSecondary }]}>
          {prevMonthExpense > 0
            ? `${Math.abs(changePercent).toFixed(1)}% so với tháng trước`
            : "Chưa có dữ liệu tháng trước"}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        {monthlyBars.map((height, index) => (
          <View key={index} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: `${height || 5}%`,
                  backgroundColor:
                    index === monthlyBars.length - 1
                      ? "#3c83f6" // tháng hiện tại
                      : isDarkMode
                      ? "rgba(60, 131, 246, 0.3)"
                      : "rgba(60, 131, 246, 0.2)",
                },
              ]}
            />
            <Text
              style={[styles.monthLabel, { color: theme.textSecondary }]}
            >
              {monthLabels[index] || ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reportCard: {
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
    alignItems: "center",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  monthLabel: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
});

export default MonthlyExpenseChart;
