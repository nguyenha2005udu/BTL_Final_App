import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type CategoryType = "expense" | "income";

interface Category {
  id: string;
  name: string;
  type: CategoryType;
  budget?: number;
  icon: string;
  color: string;
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Ăn uống",
    type: "expense",
    budget: 5000000,
    icon: "food-outline",
    color: "#ec5b13",
  },
  {
    id: "2",
    name: "Lương",
    type: "income",
    icon: "wallet-outline",
    color: "#3B82F6",
  },
  {
    id: "3",
    name: "Di chuyển",
    type: "expense",
    budget: 2000000,
    icon: "car-outline",
    color: "#8B5CF6",
  },
  {
    id: "4",
    name: "Mua sắm",
    type: "expense",
    budget: 3500000,
    icon: "bag-handle-outline",
    color: "#10B981",
  },
  {
    id: "5",
    name: "Nhà cửa",
    type: "expense",
    icon: "home-outline",
    color: "#F59E0B",
  },
];

function getIconName(icon: string): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case "food-outline":
      return "fast-food-outline";
    case "wallet-outline":
      return "wallet-outline";
    case "car-outline":
      return "car-outline";
    case "bag-handle-outline":
      return "bag-handle-outline";
    case "home-outline":
      return "home-outline";
    default:
      return "grid-outline";
  }
}

export default function CategoryListScreen() {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    return mockCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [search]);

  const handleAdd = () => {
    Alert.alert("Thông báo", "Đi tới màn hình thêm danh mục");
  };

  const handleEdit = (category: Category) => {
    Alert.alert("Chỉnh sửa", `Chỉnh sửa danh mục: ${category.name}`);
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      "Xóa danh mục",
      `Bạn có chắc muốn xóa "${category.name}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => Alert.alert("Đã xóa", category.name),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Category }) => {
    return (
      <View style={styles.card}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: `${item.color}20` },
          ]}
        >
          <Ionicons
            name={getIconName(item.icon)}
            size={24}
            color={item.color}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.meta}>
            {item.type === "expense" ? "Chi tiêu" : "Thu nhập"}
            {item.budget ? ` • Ngân sách: ${item.budget.toLocaleString("vi-VN")}đ` : ""}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={18} color="#0f766e" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={18} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản lý danh mục</Text>
          <Text style={styles.headerSubtitle}>
            Danh sách danh mục thu nhập và chi tiêu
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm danh mục..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.fab} onPress={handleAdd}>
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.fabText}>Thêm danh mục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#0f172a",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 110,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    backgroundColor: "#ea580c",
    borderRadius: 999,
    paddingHorizontal: 18,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#ea580c",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 8,
  },
});