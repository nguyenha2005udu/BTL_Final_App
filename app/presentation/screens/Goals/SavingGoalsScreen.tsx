import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { getSavingGoalsByUser } from "../../../services/savingGoals.service";
import { auth } from "../../../services/firebase/firebaseConfig";
import { StackNavigationProp } from "@react-navigation/stack";
import { SavingGoal } from "../../../type/types";
import { RootStackParamList } from "../../../RootNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

type SavingGoalsNavProp = StackNavigationProp<
  RootStackParamList,
  "GoalList"
>;

export default function SavingGoalsScreen({
  navigation,
}: {
  navigation: SavingGoalsNavProp;
}) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);

  // 🔥 Reload mỗi khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      const loadGoals = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const result = await getSavingGoalsByUser(user.uid);
        setGoals(result);
      };

      loadGoals();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialIcons name="arrow-back" size={28} color="#111" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Mục tiêu tiết kiệm</Text>

      {/* List */}
      <ScrollView style={{ marginTop: 12 }}>
        {goals.length === 0 ? (
          <Text style={styles.emptyText}>
            Bạn chưa có mục tiêu tiết kiệm nào.
          </Text>
        ) : (
          goals.map((goal) => {
            const progress =
              goal.targetAmount > 0
                ? Math.min(
                    Math.round(
                      (goal.currentAmount / goal.targetAmount) * 100
                    ),
                    100
                  )
                : 0;

            const isCompleted =
              goal.currentAmount >= goal.targetAmount;

            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() =>
                  navigation.navigate("GoalDetail", { id: goal.id })
                }
                style={styles.card}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{goal.title}</Text>

                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>
                        Hoàn thành
                      </Text>
                    </View>
                  )}
                </View>

                {/* Amount */}
                <Text style={styles.amountText}>
                  {goal.currentAmount.toLocaleString()} /{" "}
                  {goal.targetAmount.toLocaleString()} đ
                </Text>

                {/* Progress bar */}
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: isCompleted
                          ? "#22C55E"
                          : "#4C6EF5",
                      },
                    ]}
                  />
                </View>

                {/* Percentage */}
                <Text style={styles.percentText}>
                  {progress}% hoàn thành
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Add Goal FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddGoals")}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 12,
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  completedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  amountText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  progressBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  percentText: {
    marginTop: 6,
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4C6EF5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
