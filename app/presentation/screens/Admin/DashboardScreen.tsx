import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Trend = {
  value: string;
  isPositive: boolean;
};

type StatCardProps = {
  label: string;
  value: string;
  trend?: Trend;
  subtext?: string;
  warning?: string;
  progress?: number;
};

const lineData = [
  { name: "T1", value: 120 },
  { name: "T2", value: 110 },
  { name: "T3", value: 80 },
  { name: "T4", value: 60 },
  { name: "T5", value: 90 },
  { name: "T6", value: 40 },
];

const pieData = [
  { name: "Hoạt động", value: 95, color: "#064E3B" },
  { name: "Bị khóa", value: 5, color: "#EF4444" },
];

const categories = [
  { name: "Ăn uống", value: 42, color: "#064E3B" },
  { name: "Di chuyển", value: 28, color: "#3B82F6" },
  { name: "Mua sắm", value: 15, color: "#F59E0B" },
];

export default function DashboardScreen() {
  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarTitle}>Thống kê Hệ thống</Text>
            <Text style={styles.topBarSubtitle}>Admin Dashboard - Expense Tracker</Text>
          </View>
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={() => Alert.alert("Thông báo", "Mở khu vực thông báo")}
          >
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <StatCard
            label="Tổng người dùng"
            value="1,284"
            trend={{ value: "+5% tháng này", isPositive: true }}
          />
          <StatCard label="Người dùng mới" value="156" subtext="Tháng này" />
          <StatCard label="Tỷ lệ hoạt động" value="85%" progress={85} />
          <StatCard label="Tài khoản bị khóa" value="12" warning="Cần kiểm tra" />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tăng trưởng người dùng</Text>
            <Text style={styles.cardMeta}>6 tháng qua</Text>
          </View>

          <View style={styles.chartWrapper}>
            <View style={styles.lineChartArea}>
              {lineData.map((item) => (
                <View key={item.name} style={styles.lineBarItem}>
                  <View style={styles.lineBarTrack}>
                    <View
                      style={[
                        styles.lineBarFill,
                        { height: Math.max(18, item.value * 0.55) },
                      ]}
                    />
                  </View>
                  <Text style={styles.lineBarLabel}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trạng thái tài khoản</Text>

          <View style={styles.pieLegendList}>
            {pieData.map((item) => (
              <View key={item.name} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>
                  {item.name}: {item.value}%
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.progressRingCard}>
            <Text style={styles.progressMainText}>{total}%</Text>
            <Text style={styles.progressSubText}>Tổng trạng thái</Text>

            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${pieData[0].value}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Danh mục hoạt động nhất</Text>

          <View style={styles.categoryList}>
            {categories.map((cat) => (
              <View key={cat.name} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryPercent}>{cat.value}%</Text>
                </View>
                <View style={styles.categoryTrack}>
                  <View
                    style={[
                      styles.categoryFill,
                      {
                        backgroundColor: cat.color,
                        width: `${cat.value}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, trend, subtext, warning, progress }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>

      {trend && (
        <View style={styles.trendRow}>
          <Ionicons
            name={trend.isPositive ? "trending-up-outline" : "trending-down-outline"}
            size={14}
            color={trend.isPositive ? "#059669" : "#DC2626"}
          />
          <Text
            style={[
              styles.trendText,
              { color: trend.isPositive ? "#059669" : "#DC2626" },
            ]}
          >
            {trend.value}
          </Text>
        </View>
      )}

      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}

      {typeof progress === "number" ? (
        <View style={styles.miniProgressTrack}>
          <View style={[styles.miniProgressFill, { width: `${progress}%` }]} />
        </View>
      ) : null}

      {warning ? (
        <View style={styles.warningRow}>
          <Ionicons name="warning-outline" size={14} color="#EF4444" />
          <Text style={styles.warningText}>{warning}</Text>
        </View>
      ) : null}
    </View>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <Ionicons
        name={icon}
        size={20}
        color={active ? "#064E3B" : "#64748B"}
      />
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  topBar: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topBarTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  topBarSubtitle: {
    color: "#CBD5E1",
    fontSize: 12,
    marginTop: 4,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  trendText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  subtext: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },
  miniProgressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    marginTop: 12,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#065F46",
    borderRadius: 999,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  warningText: {
    marginLeft: 4,
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardMeta: {
    fontSize: 12,
    color: "#94A3B8",
  },
  chartWrapper: {
    marginTop: 8,
  },
  lineChartArea: {
    height: 180,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  lineBarItem: {
    alignItems: "center",
    flex: 1,
  },
  lineBarTrack: {
    width: 22,
    height: 120,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  lineBarFill: {
    width: "100%",
    backgroundColor: "#064E3B",
    borderRadius: 999,
  },
  lineBarLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  pieLegendList: {
    marginTop: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  progressRingCard: {
    marginTop: 8,
  },
  progressMainText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  progressSubText: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 12,
  },
  progressBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#064E3B",
    borderRadius: 999,
  },
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    marginBottom: 14,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
  },
  categoryPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  categoryTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  categoryFill: {
    height: "100%",
    borderRadius: 999,
  },
  bottomNav: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -1 },
    elevation: 2,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    marginTop: 4,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  navTextActive: {
    color: "#064E3B",
  },
});