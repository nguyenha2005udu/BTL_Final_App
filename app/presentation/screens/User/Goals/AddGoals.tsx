import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

import { createSavingGoal } from "../../../../services/savingGoals.service";
import { auth } from "../../../../services/firebase/firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../../context/ThemeContext";

export default function AddGoals({ navigation }: { navigation: any }) {
  const { theme, isDarkMode } = useTheme();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để tạo mục tiêu.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên mục tiêu.");
      return;
    }

    if (!targetAmount || Number(targetAmount) <= 0) {
      Alert.alert("Số tiền không hợp lệ", "Vui lòng nhập số tiền > 0.");
      return;
    }

    try {
      await createSavingGoal(user.uid, {
        title: title.trim(),
        targetAmount: Number(targetAmount),
        currentAmount: 0,
      });

      Alert.alert("Thành công", "Đã tạo mục tiêu tiết kiệm mới!");
      navigation.goBack();
    } catch (error: any) {
      console.log("Create saving goal error:", error);
      Alert.alert("Lỗi", error?.message || "Không thể tạo mục tiêu.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.background : "#FFFFFF" },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? theme.headerBackground : "#FFFFFF",
            borderBottomColor: isDarkMode ? theme.border : "#F1F5F9",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Tạo mục tiêu
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* FORM */}
        <View style={styles.form}>
          {/* TÊN MỤC TIÊU */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Tên mục tiêu <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDarkMode
                    ? theme.cardBackground
                    : "#F9FAFB",
                  borderColor: isDarkMode ? theme.border : "#E5E7EB",
                },
              ]}
            >
              <MaterialIcons
                name="flag"
                size={20}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="VD: Mua xe máy, Du lịch Đà Nẵng..."
                value={title}
                onChangeText={setTitle}
                style={[styles.input, { color: theme.textPrimary }]}
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          {/* SỐ TIỀN MỤC TIÊU */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Số tiền mục tiêu <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDarkMode
                    ? theme.cardBackground
                    : "#F9FAFB",
                  borderColor: isDarkMode ? theme.border : "#E5E7EB",
                },
              ]}
            >
              <MaterialIcons
                name="attach-money"
                size={20}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
                style={[styles.input, { color: theme.textPrimary }]}
                placeholderTextColor={theme.textSecondary}
              />
              <Text style={[styles.currency, { color: theme.textSecondary }]}>
                ₫
              </Text>
            </View>
            {targetAmount && Number(targetAmount) > 0 && (
              <Text style={[styles.hint, { color: theme.textSecondary }]}>
                💰 Mục tiêu: {Number(targetAmount).toLocaleString()}₫
              </Text>
            )}
          </View>

          {/* INFO CARD */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: isDarkMode ? "#1E3A5F" : "#EFF6FF",
                borderColor: isDarkMode ? "#2563EB" : "#BFDBFE",
              },
            ]}
          >
            <MaterialIcons name="info" size={20} color="#3B82F6" />
            <Text
              style={[
                styles.infoText,
                { color: isDarkMode ? "#93C5FD" : "#1E40AF" },
              ]}
            >
              Bạn có thể cập nhật tiến độ tiết kiệm bất kỳ lúc nào sau khi tạo
              mục tiêu.
            </Text>
          </View>

          {/* EXAMPLES */}
          <View style={styles.examplesContainer}>
            <Text
              style={[styles.examplesTitle, { color: theme.textSecondary }]}
            >
              Gợi ý mục tiêu phổ biến:
            </Text>
            <View style={styles.examplesList}>
              {[
                {
                  icon: "two-wheeler",
                  title: "Mua xe máy",
                  amount: "30,000,000",
                },
                { icon: "flight", title: "Du lịch", amount: "20,000,000" },
                { icon: "home", title: "Mua nhà", amount: "500,000,000" },
                { icon: "school", title: "Học phí", amount: "15,000,000" },
              ].map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.exampleChip,
                    {
                      backgroundColor: isDarkMode
                        ? theme.cardBackground
                        : "#F9FAFB",
                      borderColor: isDarkMode ? theme.border : "#E5E7EB",
                    },
                  ]}
                  onPress={() => {
                    setTitle(example.title);
                    setTargetAmount(example.amount.replace(/,/g, ""));
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={example.icon as any}
                    size={16}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[styles.exampleText, { color: theme.textPrimary }]}
                  >
                    {example.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: isDarkMode ? theme.cardBackground : "#FFFFFF",
            borderTopColor: isDarkMode ? theme.border : "#F1F5F9",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="check"
            size={22}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.saveButtonText}>Tạo mục tiêu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.cancelButton,
            { backgroundColor: isDarkMode ? "#374151" : "#F3F4F6" },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>
            Hủy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  content: {
    padding: 20,
    paddingBottom: 180,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  currency: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  hint: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  examplesContainer: {
    gap: 12,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  examplesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exampleChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    gap: 6,
  },
  exampleText: {
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
