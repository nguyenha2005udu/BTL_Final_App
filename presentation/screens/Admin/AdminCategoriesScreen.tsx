import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@services/firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

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

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const loadCategories = useCallback(async () => {
    try {
      // Get all users first
      const usersSnap = await getDocs(collection(db, "users"));
      const allCategories: AdminCategory[] = [];

      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();
        const userName = String(userData?.fullName ?? userData?.name ?? "No name");
        const userEmail = String(userData?.email ?? "No email");

        // Get categories for this user
        const catsSnap = await getDocs(
          collection(db, "users", userDoc.id, "categories")
        );

        catsSnap.docs.forEach((catDoc) => {
          const data = catDoc.data();
          allCategories.push({
            id: `${userDoc.id}_${catDoc.id}`,
            name: String(data.name ?? "Unknown"),
            icon: String(data.icon ?? "category"),
            color: String(data.color ?? "#60A5FA"),
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

  // Filter & Search
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          <MaterialIcons name="search" size={22} color="#94A3B8" style={{ marginRight: 10 }} />
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
                  backgroundColor: filterType === f.key ? "#4F46E5" : "#1E293B",
                  borderColor: filterType === f.key ? "#4F46E5" : "rgba(255,255,255,0.08)",
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filterType === f.key ? "#FFFFFF" : "#94A3B8" },
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              {/* Icon */}
              <View style={[styles.iconBox, { backgroundColor: item.color + "20" }]}>
                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {item.ownerName} • {item.ownerEmail}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          item.type === "income"
                            ? "rgba(16,185,129,0.18)"
                            : "rgba(239,68,68,0.18)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: item.type === "income" ? "#10B981" : "#EF4444" },
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

            {/* Spent info */}
            {item.budget !== null && item.budget > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>
                    Đã chi: {item.spent.toLocaleString("vi-VN")}₫
                  </Text>
                  <Text style={styles.progressText}>
                    {item.budget > 0
                      ? Math.round((item.spent / item.budget) * 100)
                      : 0}
                    %
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(
                          item.budget > 0
                            ? (item.spent / item.budget) * 100
                            : 0,
                          100
                        )}%`,
                        backgroundColor:
                          item.spent > (item.budget ?? 0) ? "#EF4444" : "#4F46E5",
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
            <MaterialIcons name="category" size={48} color="#94A3B8" />
            <Text style={styles.emptyText}>Không tìm thấy danh mục nào</Text>
          </View>
        }
      />

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

        {/* Danh mục - Active */}
        <TouchableOpacity style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="dashboard" size={22} color="#FFFFFF" />
          <Text style={styles.activeFooterText}>Danh mục</Text>
        </TouchableOpacity>

        {/* Thống kê */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminStatistic")}
        >
          <MaterialIcons name="bar-chart" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Thống kê</Text>
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

  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#111827",
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  filterContainer: {
    paddingBottom: 12,
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
    borderWidth: 1,
  },

  filterChipText: {
    fontSize: 14,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 120,
    gap: 12,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  cardRow: {
    flexDirection: "row",
    gap: 14,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 8,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  budgetBadge: {
    backgroundColor: "rgba(99,102,241,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  budgetBadgeText: {
    color: "#818CF8",
    fontSize: 11,
    fontWeight: "700",
  },

  progressSection: {
    marginTop: 14,
    gap: 6,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },

  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
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
    fontSize: 15,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 12,
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
