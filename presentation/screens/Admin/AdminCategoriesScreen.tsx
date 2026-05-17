
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

interface AdminCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  budget: number | null;
  spent: number;
  ownerName: string;
  ownerEmail: string;
}

export default function AdminCategoriesScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const isSmall = width < 360;
  const iconBoxSize = isSmall ? 40 : 50;
  const tabIconSize = isSmall ? 18 : 22;

  const loadCategories = useCallback(async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const allCategories: AdminCategory[] = [];

      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();
        const userName = String(userData?.fullName ?? userData?.name ?? "No name");
        const userEmail = String(userData?.email ?? "No email");

        const catsSnap = await getDocs(
          collection(db, "users", userDoc.id, "categories")
        );

        catsSnap.docs.forEach((catDoc) => {
          const data = catDoc.data();
          allCategories.push({
            id: `${userDoc.id}_${catDoc.id}`,
            name: String(data.name ?? "Unknown"),
            icon: String(data.icon ?? "category"),
            color: String(data.color ?? "#3B82F6"),
            type: data.type === "income" ? "income" : "expense",
            budget: data.budget ?? null,
            spent: data.spent ?? 0,
            ownerName: userName,
            ownerEmail: userEmail,
          });
        });
      }

      setCategories(allCategories);
    } catch (err) {
      console.log("Load categories error:", err);
      Alert.alert("Lỗi", "Không thể tải danh mục.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const filteredCategories = categories.filter((cat) => {
    if (filterType !== "all" && cat.type !== filterType) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        cat.name.toLowerCase().includes(s) ||
        cat.ownerName.toLowerCase().includes(s) ||
        cat.ownerEmail.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalExpenseCats = categories.filter((c) => c.type === "expense").length;
  const totalIncomeCats = categories.filter((c) => c.type === "income").length;

  const bottomPad = insets.bottom + 60;

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý danh mục</Text>
        <Text style={styles.headerSubtitle}>
          {categories.length} danh mục • {totalExpenseCats} chi tiêu • {totalIncomeCats} thu nhập
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#94A3B8" style={{ marginRight: SPACING.sm }} />
          <TextInput
            placeholder="Tìm danh mục, tên người dùng..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm("")} activeOpacity={0.7}>
              <MaterialIcons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { key: "all", label: "Tất cả" },
            { key: "expense", label: "Chi tiêu" },
            { key: "income", label: "Thu nhập" },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilterType(f.key as any)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filterType === f.key ? "#3B82F6" : "#F1F5F9",
                  borderColor: filterType === f.key ? "#3B82F6" : "#E2E8F0",
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filterType === f.key ? "#FFFFFF" : "#64748B" },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPad + SPACING.lg },
        ]}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              {/* Icon */}
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: item.color + "20",
                    width: iconBoxSize,
                    height: iconBoxSize,
                    borderRadius: isSmall ? RADIUS.md : RADIUS.lg,
                  },
                ]}
              >
                <MaterialIcons name={item.icon as any} size={isSmall ? 20 : 24} color={item.color} />
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {item.ownerName} • {item.ownerEmail}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor: item.type === "income" ? "#DCFCE7" : "#FEE2E2",
                        borderColor: item.type === "income" ? "#BBF7D0" : "#FECACA",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: item.type === "income" ? "#059669" : "#DC2626" },
                      ]}
                    >
                      {item.type === "income" ? "THU NHẬP" : "CHI TIÊU"}
                    </Text>
                  </View>

                  {item.budget !== null && item.budget > 0 && (
                    <View style={styles.budgetBadge}>
                      <Text style={styles.budgetBadgeText}>
                        Ngân sách: {item.budget.toLocaleString("vi-VN")}₫
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Spent progress */}
            {item.budget !== null && item.budget > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>
                    Đã chi: {item.spent.toLocaleString("vi-VN")}₫
                  </Text>
                  <Text style={styles.progressText}>
                    {item.budget > 0 ? Math.round((item.spent / item.budget) * 100) : 0}%
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(
                          item.budget > 0 ? (item.spent / item.budget) * 100 : 0,
                          100
                        )}%`,
                        backgroundColor: item.spent > (item.budget ?? 0) ? "#EF4444" : "#3B82F6",
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="category" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>Không tìm thấy danh mục nào</Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <View style={[styles.footer, { paddingBottom: SPACING.sm }]}>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminUserManagement")}
        >
          <MaterialIcons name="admin-panel-settings" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Quản lý</Text>
        </TouchableOpacity>

        <View style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="dashboard" size={tabIconSize} color="#3B82F6" />
          <Text style={styles.activeFooterText}>Danh mục</Text>
        </View>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminStatistic")}
        >
          <MaterialIcons name="bar-chart" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Thống kê</Text>
        </TouchableOpacity>

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
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.bodyLg,
    fontWeight: "500",
    color: "#0F172A",
  },
  filterContainer: {
    paddingVertical: SPACING.sm,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  filterRow: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
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
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "flex-start",
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.small,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    flexWrap: "wrap",
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
  },
  budgetBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  budgetBadgeText: {
    color: "#3B82F6",
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
  },
  progressSection: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: FONT_SIZE.small,
    color: "#64748B",
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FONT_SIZE.bodyLg,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: SPACING.md,
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
