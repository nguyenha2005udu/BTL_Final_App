import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "@context/ThemeContext";
import { SavingGoal } from "@type/types";
import {
  getGoalDetail,
  updateSavingGoal,
} from "@services/savingGoals.service";
import { auth } from "@services/firebase/firebaseConfig";

/* ---------------- TYPES ---------------- */

type RootStackParamList = {
  EditGoal: { id: string };
};

type EditGoalRouteProp = RouteProp<RootStackParamList, "EditGoal">;
type EditGoalNavProp = StackNavigationProp<
  RootStackParamList,
  "EditGoal"
>;

/* ---------------- COMPONENT ---------------- */

export default function EditGoal({
  route,
  navigation,
}: {
  route: EditGoalRouteProp;
  navigation: EditGoalNavProp;
}) {
  const { id } = route.params;
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<SavingGoal | null>(null);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    const loadGoal = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getGoalDetail(user.uid, id);
      if (!data) return;

      setGoal(data);
      setTitle(data.title);
      setTargetAmount(String(data.targetAmount));
      setLoading(false);
    };

    loadGoal();
  }, []);

  if (loading || !goal) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const target = Number(targetAmount);

    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên mục tiêu");
      return;
    }

    if (!target || target <= 0) {
      Alert.alert("Lỗi", "Số tiền mục tiêu không hợp lệ");
      return;
    }

    if (target < goal.currentAmount) {
      Alert.alert(
        "Không hợp lệ",
        `Mục tiêu mới phải ≥ ${goal.currentAmount.toLocaleString()} đ`
      );
      return;
    }

    await updateSavingGoal(user.uid, goal.id, {
      title: title.trim(),
      targetAmount: target,
    });

    Alert.alert("Thành công", "Đã cập nhật mục tiêu", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sửa mục tiêu</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          {/* Title */}
          <Text style={styles.label}>Tên mục tiêu</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ví dụ: Mua laptop"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          {/* Target Amount */}
          <Text style={[styles.label, { marginTop: 16 }]}>
            Số tiền mục tiêu
          </Text>
          <TextInput
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
            placeholder="Nhập số tiền"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          {/* Current Amount Info */}
          <View style={styles.infoBox}>
            <MaterialIcons name="info-outline" size={18} color="#6B7280" />
            <Text style={styles.infoText}>
              Đã tiết kiệm: {goal.currentAmount.toLocaleString()} đ
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  formCard: {
    margin: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2937",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#4C6EF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
