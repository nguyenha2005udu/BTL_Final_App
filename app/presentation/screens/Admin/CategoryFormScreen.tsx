import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CategoryType = "expense" | "income";

const colors = [
  "#06402B",
  "#2563EB",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

const iconOptions: Array<{
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}> = [
  { key: "food", icon: "fast-food-outline", label: "Ăn uống" },
  { key: "wallet", icon: "wallet-outline", label: "Ví tiền" },
  { key: "car", icon: "car-outline", label: "Di chuyển" },
  { key: "bag", icon: "bag-handle-outline", label: "Mua sắm" },
  { key: "home", icon: "home-outline", label: "Nhà cửa" },
  { key: "card", icon: "card-outline", label: "Thanh toán" },
];

export default function CategoryFormScreen() {
  const [type, setType] = useState<CategoryType>("expense");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].icon);

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
      return;
    }

    Alert.alert(
      "Lưu danh mục",
      `Tên: ${categoryName}\nLoại: ${
        type === "expense" ? "Chi tiêu" : "Thu nhập"
      }\nMàu: ${selectedColor}`
    );
  };

  const handleCancel = () => {
    Alert.alert("Hủy", "Quay lại màn hình trước");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Thêm danh mục mới</Text>
            <Text style={styles.headerSubtitle}>
              Tạo danh mục thu nhập hoặc chi tiêu cho hệ thống
            </Text>
          </View>

          <View style={styles.iconSection}>
            <View
              style={[
                styles.previewCircle,
                { backgroundColor: `${selectedColor}20`, borderColor: selectedColor },
              ]}
            >
              <Ionicons name={selectedIcon} size={42} color={selectedColor} />
            </View>
            <Text style={styles.previewText}>Chọn biểu tượng</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Tên danh mục</Text>
            <TextInput
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Nhập tên danh mục"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Loại danh mục</Text>
            <View style={styles.typeWrap}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === "expense" && styles.typeBtnActive,
                ]}
                onPress={() => setType("expense")}
              >
                <Ionicons
                  name="card-outline"
                  size={16}
                  color={type === "expense" ? "#ffffff" : "#64748b"}
                />
                <Text
                  style={[
                    styles.typeText,
                    type === "expense" && styles.typeTextActive,
                  ]}
                >
                  Chi tiêu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === "income" && styles.typeBtnActive,
                ]}
                onPress={() => setType("income")}
              >
                <Ionicons
                  name="wallet-outline"
                  size={16}
                  color={type === "income" ? "#ffffff" : "#64748b"}
                />
                <Text
                  style={[
                    styles.typeText,
                    type === "income" && styles.typeTextActive,
                  ]}
                >
                  Thu nhập
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, styles.labelSpacing]}>Biểu tượng</Text>
            <View style={styles.iconGrid}>
              {iconOptions.map((item) => {
                const active = selectedIcon === item.icon;

                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.iconOption,
                      active && styles.iconOptionActive,
                    ]}
                    onPress={() => setSelectedIcon(item.icon)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={active ? "#ffffff" : "#0f172a"}
                    />
                    <Text
                      style={[
                        styles.iconLabel,
                        active && styles.iconLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, styles.labelSpacing]}>Màu sắc đại diện</Text>
            <View style={styles.colorRow}>
              {colors.map((color) => {
                const active = selectedColor === color;

                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: color },
                      active && styles.colorBtnActive,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Lưu danh mục</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </TouchableOpacity>
        </View>
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 18,
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
    lineHeight: 18,
  },
  iconSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  previewCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  previewText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelSpacing: {
    marginTop: 22,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    marginTop: 8,
    fontSize: 14,
    color: "#0f172a",
  },
  typeWrap: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    padding: 4,
    marginTop: 8,
  },
  typeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  typeBtnActive: {
    backgroundColor: "#065f46",
  },
  typeText: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 13,
  },
  typeTextActive: {
    color: "#ffffff",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconOption: {
    width: "31%",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  iconOptionActive: {
    backgroundColor: "#065f46",
    borderColor: "#065f46",
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#0f172a",
    fontWeight: "700",
    textAlign: "center",
  },
  iconLabelActive: {
    color: "#ffffff",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 12,
  },
  colorBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  colorBtnActive: {
    borderWidth: 3,
    borderColor: "#d1fae5",
    transform: [{ scale: 1.08 }],
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
  },
  saveBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#065f46",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 8,
  },
  cancelBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  cancelBtnText: {
    color: "#334155",
    fontWeight: "800",
    fontSize: 14,
  },
});