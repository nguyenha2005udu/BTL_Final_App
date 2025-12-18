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
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import { SavingGoal } from "../../../type/types";
import {
  getGoalDetail,
  updateSavingGoal,
} from "../../../services/savingGoals.service";
import { auth } from "../../../services/firebase/firebaseConfig";

type RootStackParamList = {
  GoalDetail: { id: string };
};

type GoalDetailRouteProp = RouteProp<RootStackParamList, "GoalDetail">;
type GoalDetailNavProp = StackNavigationProp<
  RootStackParamList,
  "GoalDetail"
>;

export default function GoalDetail({
  route,
  navigation,
}: {
  route: GoalDetailRouteProp;
  navigation: GoalDetailNavProp;
}) {
  const { id } = route.params;

  const [goal, setGoal] = useState<SavingGoal | null>(null);
  const [newAmount, setNewAmount] = useState("");

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getGoalDetail(user.uid, id);
    setGoal(data);
  };

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  const progress = goal.currentAmount / goal.targetAmount;
  const percentage = Math.min(progress * 100, 100).toFixed(1);
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  const handleUpdate = async () => {
    if (isCompleted) return;

    const num = Number(newAmount);
    if (!num || num <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (num > remaining) {
      Alert.alert(
        "Vượt mục tiêu",
        `Bạn chỉ cần thêm ${remaining.toLocaleString()} đ để hoàn thành mục tiêu`
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    await updateSavingGoal(user.uid, goal.id, {
      currentAmount: goal.currentAmount + num,
    });

    setNewAmount("");
    loadGoal();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView 
        style={styles.scrollView}
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
          <Text style={styles.headerTitle}>Chi tiết mục tiêu</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Goal Card */}
          <View style={styles.goalCard}>
            <Text style={styles.title}>{goal.title}</Text>

            {isCompleted && (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={20} color="#16A34A" />
                <Text style={styles.completedBadgeText}>Hoàn thành</Text>
              </View>
            )}
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Tiến độ</Text>
              <Text style={styles.progressPercentage}>{percentage}%</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { 
                    width: `${percentage}%` as `${number}%`,
                    backgroundColor: isCompleted ? "#16A34A" : "#4C6EF5"
                  },
                ]}
              />
            </View>

            <View style={styles.amountContainer}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Đã tiết kiệm</Text>
                <Text style={styles.amountValue}>
                  {goal.currentAmount.toLocaleString()} đ
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Mục tiêu</Text>
                <Text style={styles.amountValue}>
                  {goal.targetAmount.toLocaleString()} đ
                </Text>
              </View>
            </View>

            {!isCompleted && (
              <View style={styles.remainingCard}>
                <MaterialIcons name="info-outline" size={20} color="#EF4444" />
                <Text style={styles.remainingText}>
                  Còn thiếu {remaining.toLocaleString()} đ
                </Text>
              </View>
            )}

            {goal.deadline && (
              <View style={styles.deadlineCard}>
                <MaterialIcons name="event" size={18} color="#6B7280" />
                <Text style={styles.deadlineText}>
                  Hoàn thành trước: {goal.deadline.toDate().toLocaleDateString("vi-VN")}
                </Text>
              </View>
            )}
          </View>

          {/* Update Section */}
          <View style={styles.updateSection}>
            <Text style={styles.sectionTitle}>
              Cập nhật số tiền tiết kiệm
            </Text>
            
            <TextInput
              placeholder={
                isCompleted
                  ? "Mục tiêu đã hoàn thành"
                  : `Nhập số tiền (tối đa ${remaining.toLocaleString()} đ)`
              }
              keyboardType="numeric"
              value={newAmount}
              onChangeText={setNewAmount}
              editable={!isCompleted}
              style={[
                styles.inputContainer,
                isCompleted && styles.inputDisabled,
              ]}
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
              style={[
                styles.button,
                isCompleted && styles.buttonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={isCompleted}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name={isCompleted ? "check-circle" : "add-circle"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.buttonText}>
                {isCompleted ? "Đã hoàn thành" : "Cập nhật tiến độ"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  loadingText: {
    padding: 20,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  content: {
    padding: 20,
  },
  goalCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  completedBadgeText: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "600",
  },
  progressSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4C6EF5",
  },
  progressContainer: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
  amountContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  amountItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  amountLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  remainingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginBottom: 12,
  },
  remainingText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600",
  },
  deadlineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  deadlineText: {
    fontSize: 14,
    color: "#6B7280",
  },
  updateSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2937",
  },
  inputDisabled: {
    color: "#9CA3AF",
  },
  button: {
    backgroundColor: "#4C6EF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#4C6EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});