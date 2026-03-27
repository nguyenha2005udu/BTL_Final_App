import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type UserRole = "admin" | "user";
type UserStatus = "active" | "locked";
type FilterType = "all" | "active" | "locked";

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl: string;
}

const mockUsers: UserItem[] = [
  {
    id: "1",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "admin",
    status: "active",
    createdAt: "20/05/2023",
    avatarUrl: "https://picsum.photos/seed/user1/200",
  },
  {
    id: "2",
    fullName: "Trần Thị B",
    email: "tranthib@example.com",
    role: "user",
    status: "locked",
    createdAt: "18/06/2023",
    avatarUrl: "https://picsum.photos/seed/user2/200",
  },
  {
    id: "3",
    fullName: "Lê Hoàng C",
    email: "lehoangc@example.com",
    role: "user",
    status: "active",
    createdAt: "12/07/2023",
    avatarUrl: "https://picsum.photos/seed/user3/200",
  },
];

export default function UsersScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesFilter = filter === "all" || user.status === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

const handleAddUser = () => {
  navigation.navigate("UserForm");
};

  const handleEditUser = (user: UserItem) => {
    Alert.alert("Chỉnh sửa", `Chỉnh sửa người dùng: ${user.fullName}`);
  };

  const handleToggleLock = (user: UserItem) => {
    const nextAction = user.status === "active" ? "khóa" : "mở khóa";
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn ${nextAction} tài khoản "${user.fullName}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: () =>
            Alert.alert("Thành công", `${nextAction} tài khoản: ${user.fullName}`),
        },
      ]
    );
  };

  const renderFilterButton = (value: FilterType, label: string) => {
    const active = filter === value;
    return (
      <TouchableOpacity
        key={value}
        onPress={() => setFilter(value)}
        style={[styles.filterButton, active && styles.filterButtonActive]}
      >
        <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: UserItem }) => {
    const isActive = item.status === "active";

    return (
      <View style={styles.userCard}>
        <View style={styles.userTop}>
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {item.fullName}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  isActive ? styles.activeBadge : styles.lockedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isActive ? styles.activeBadgeText : styles.lockedBadgeText,
                  ]}
                >
                  {isActive ? "Hoạt động" : "Bị khóa"}
                </Text>
              </View>
            </View>

            <Text style={styles.userEmail} numberOfLines={1}>
              {item.email}
            </Text>

            <Text style={styles.userRole}>
              Vai trò: {item.role === "admin" ? "Admin" : "User"}
            </Text>
          </View>
        </View>

        <View style={styles.userBottom}>
          <Text style={styles.createdText}>
            Ngày tạo: <Text style={styles.createdDate}>{item.createdAt}</Text>
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleEditUser(item)}
            >
              <Ionicons name="create-outline" size={18} color="#0f766e" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleToggleLock(item)}
            >
              <Ionicons
                name={isActive ? "lock-closed-outline" : "lock-open-outline"}
                size={18}
                color={isActive ? "#dc2626" : "#2563eb"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản lý người dùng</Text>
          <Text style={styles.headerSubtitle}>Tìm kiếm, chỉnh sửa và khóa tài khoản</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color="#94a3b8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAddUser}>
            <Ionicons name="person-add-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterWrap}>
          {renderFilterButton("all", "Tất cả")}
          {renderFilterButton("active", "Hoạt động")}
          {renderFilterButton("locked", "Bị khóa")}
        </View>

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <View style={styles.footerBlock}>
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={() => Alert.alert("Thông báo", "Tải thêm người dùng")}
              >
                <Text style={styles.loadMoreText}>Tải thêm người dùng</Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                Hiển thị {filteredUsers.length} trong số 128 người dùng
              </Text>
            </View>
          }
        />
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
    marginBottom: 14,
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
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#0f172a",
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#065f46",
    alignItems: "center",
    justifyContent: "center",
  },
  filterWrap: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  filterButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#065f46",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingBottom: 32,
  },
  userCard: {
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
  userTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e2e8f0",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  activeBadge: {
    backgroundColor: "#dcfce7",
  },
  lockedBadge: {
    backgroundColor: "#fee2e2",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  activeBadgeText: {
    color: "#15803d",
  },
  lockedBadgeText: {
    color: "#b91c1c",
  },
  userEmail: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
  },
  userRole: {
    marginTop: 4,
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  userBottom: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  createdText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  createdDate: {
    color: "#475569",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  footerBlock: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
  },
  loadMoreBtn: {
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreText: {
    color: "#065f46",
    fontWeight: "800",
    fontSize: 14,
  },
  footerText: {
    marginTop: 10,
    fontSize: 12,
    color: "#94a3b8",
  },
});