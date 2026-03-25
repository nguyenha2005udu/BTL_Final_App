import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { RootStackParamList } from "../../../../navigation/RootNavigator";
import { auth } from "../../../../services/firebase/firebaseConfig";
import {
  addGoalContribution,
  getGoalContributions,
  getGoalDetail,
  GoalContribution,
  updateSavingGoal,
} from "../../../../services/savingGoals.service";
import { SavingGoal } from "../../../../type/types";

type GoalDetailRouteProp = RouteProp<RootStackParamList, "GoalDetail">;
type GoalDetailNavProp = StackNavigationProp<RootStackParamList, "GoalDetail">;

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
  const [contributions, setContributions] = useState<GoalContribution[]>([]);

  const loadGoal = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getGoalDetail(user.uid, id);
    setGoal(data);
  };

  const loadContributions = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getGoalContributions(user.uid, id);
    setContributions(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadGoal();
      loadContributions();
    }, []),
  );

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
        `Bạn chỉ cần thêm ${remaining.toLocaleString()} đ để hoàn thành`,
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    await updateSavingGoal(user.uid, goal.id, {
      currentAmount: goal.currentAmount + num,
    });

    await addGoalContribution(user.uid, goal.id, num);

    setNewAmount("");
    loadGoal();
    loadContributions();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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

          <Text style={styles.headerTitle}>Chi tiết mục tiêu</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditGoal", { id: goal.id })}
            style={styles.backButton}
          >
            <MaterialIcons name="edit" size={22} color="#4C6EF5" />
          </TouchableOpacity>
        </View>

        {/* Content */}
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

          {/* Progress */}
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
                    backgroundColor: isCompleted ? "#16A34A" : "#4C6EF5",
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
          </View>

          {/* Update */}
          <View style={styles.updateSection}>
            <Text style={styles.sectionTitle}>Cập nhật số tiền</Text>

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
            />

            <TouchableOpacity
              style={[styles.button, isCompleted && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={isCompleted}
            >
              <MaterialIcons name="add-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>

          {/* HISTORY */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Lịch sử đóng góp</Text>

            {contributions.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có lần đóng góp nào</Text>
            ) : (
              contributions.map((item) => {
                const date =
                  item.createdAt?.toDate?.() ?? new Date(item.createdAt);

                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View>
                      <Text style={styles.historyAmount}>
                        +{item.amount.toLocaleString()} đ
                      </Text>
                      <Text style={styles.historyDate}>
                        {date.toLocaleDateString("vi-VN")}
                      </Text>
                    </View>
                    <MaterialIcons name="savings" size={20} color="#4C6EF5" />
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 40 },
  loadingText: { padding: 20, textAlign: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  goalCard: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "700" },
  completedBadge: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  completedBadgeText: { color: "#16A34A" },
  progressSection: {
    marginTop: 20,
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: { fontSize: 16, fontWeight: "600" },
  progressPercentage: { fontSize: 18, fontWeight: "700" },
  progressContainer: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginVertical: 12,
  },
  progressBar: { height: "100%" },
  amountContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  amountItem: { flex: 1, alignItems: "center" },
  divider: { width: 1, backgroundColor: "#E5E7EB" },
  amountLabel: { fontSize: 13, color: "#6B7280" },
  amountValue: { fontSize: 16, fontWeight: "700" },
  updateSection: {
    marginTop: 20,
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  inputContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  inputDisabled: { color: "#9CA3AF" },
  button: {
    backgroundColor: "#4C6EF5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#D1D5DB" },
  buttonText: { color: "#fff", fontWeight: "600" },
  historySection: {
    marginTop: 24,
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  historyAmount: { fontSize: 16, fontWeight: "600", color: "#16A34A" },
  historyDate: { fontSize: 13, color: "#6B7280" },
  emptyText: { color: "#9CA3AF" },
});
