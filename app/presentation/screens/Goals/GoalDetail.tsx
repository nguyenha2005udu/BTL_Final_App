import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
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
    return <Text style={{ padding: 20 }}>Đang tải...</Text>;
  }

  const progress = goal.currentAmount / goal.targetAmount;
  const percentage = Math.min(progress * 100, 100).toFixed(1);
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const remaining = Math.max(
    goal.targetAmount - goal.currentAmount,
    0
  );

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
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialIcons name="arrow-back" size={28} color="#111" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{goal.title}</Text>

      {/* Info */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Mục tiêu:</Text>
        <Text style={styles.value}>
          {goal.targetAmount.toLocaleString()} đ
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Đã tiết kiệm:</Text>
        <Text style={styles.value}>
          {goal.currentAmount.toLocaleString()} đ
        </Text>
      </View>

      {!isCompleted && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Còn thiếu:</Text>
          <Text style={[styles.value, { color: "#EF4444" }]}>
            {remaining.toLocaleString()} đ
          </Text>
        </View>
      )}

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%` as `${number}%` },
          ]}
        />
      </View>
      <Text style={styles.percentText}>{percentage}% hoàn thành</Text>

      {isCompleted && (
        <Text style={styles.completedText}>
          🎉 Mục tiêu đã hoàn thành
        </Text>
      )}

      {goal.deadline && (
        <Text style={styles.deadline}>
          Hoàn thành trước:{" "}
          {goal.deadline.toDate().toLocaleDateString()}
        </Text>
      )}

      {/* Update */}
      <Text style={styles.subTitle}>Cập nhật số tiền tiết kiệm</Text>

      <TextInput
        placeholder={
          isCompleted
            ? "Mục tiêu đã hoàn thành"
            : `Tối đa ${remaining.toLocaleString()} đ`
        }
        keyboardType="numeric"
        value={newAmount}
        onChangeText={setNewAmount}
        editable={!isCompleted}
        style={[
          styles.input,
          isCompleted && { backgroundColor: "#F3F4F6" },
        ]}
      />

      <TouchableOpacity
        style={[
          styles.button,
          isCompleted && { backgroundColor: "#A5B4FC" },
        ]}
        onPress={handleUpdate}
        disabled={isCompleted}
      >
        <Text style={styles.buttonText}>
          {isCompleted ? "Đã hoàn thành" : "Cập nhật"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  label: { fontSize: 16, color: "#444" },
  value: { fontSize: 16, fontWeight: "600" },
  progressContainer: {
    height: 14,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4C6EF5",
    borderRadius: 10,
  },
  percentText: { marginTop: 6, fontSize: 15, fontWeight: "500" },
  completedText: {
    marginTop: 6,
    color: "#16A34A",
    fontWeight: "600",
  },
  deadline: { marginTop: 10, fontSize: 14, color: "#777" },
  subTitle: { marginTop: 20, fontSize: 18, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#4C6EF5",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
