import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../context/ThemeContext";
import { RootStackParamList } from "../../../../navigation/RootNavigator";
import { auth } from "../../../../services/firebase/firebaseConfig";
import { getSavingGoalsByUser } from "../../../../services/savingGoals.service";
import { SavingGoal } from "../../../../type/types";

type SavingGoalsNavProp = StackNavigationProp<RootStackParamList, "GoalList">;

export default function SavingGoalsScreen({
  navigation,
}: {
  navigation: SavingGoalsNavProp;
}) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const { theme, isDarkMode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const loadGoals = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const result = await getSavingGoalsByUser(user.uid);
        setGoals(result);
      };

      loadGoals();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mục tiêu tiết kiệm</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="savings" size={64} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có mục tiêu</Text>
            <Text style={styles.emptyText}>
              Bắt đầu tạo mục tiêu tiết kiệm đầu tiên của bạn
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("AddGoals")}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>Tạo mục tiêu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Stats Summary */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{goals.length}</Text>
                <Text style={styles.statLabel}>Tổng mục tiêu</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {
                    goals.filter((g) => g.currentAmount >= g.targetAmount)
                      .length
                  }
                </Text>
                <Text style={styles.statLabel}>Hoàn thành</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {goals.filter((g) => g.currentAmount < g.targetAmount).length}
                </Text>
                <Text style={styles.statLabel}>Đang thực hiện</Text>
              </View>
            </View>

            {/* Goals List */}
            <Text style={styles.sectionTitle}>Danh sách mục tiêu</Text>

            {goals.map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? Math.min(
                      Math.round(
                        (goal.currentAmount / goal.targetAmount) * 100,
                      ),
                      100,
                    )
                  : 0;

              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() =>
                    navigation.navigate("GoalDetail", { id: goal.id })
                  }
                  style={styles.card}
                  activeOpacity={0.7}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                      <View
                        style={[
                          styles.goalIcon,
                          {
                            backgroundColor: isCompleted
                              ? "#DCFCE7"
                              : "#EEF2FF",
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={isCompleted ? "check-circle" : "savings"}
                          size={24}
                          color={isCompleted ? "#16A34A" : "#4C6EF5"}
                        />
                      </View>
                      <View style={styles.cardTitleContent}>
                        <Text style={styles.cardTitle}>{goal.title}</Text>
                        {goal.deadline && (
                          <View style={styles.deadlineContainer}>
                            <MaterialIcons
                              name="event"
                              size={14}
                              color="#9CA3AF"
                            />
                            <Text style={styles.deadlineText}>
                              {goal.deadline
                                .toDate()
                                .toLocaleDateString("vi-VN")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>Hoàn thành</Text>
                      </View>
                    )}
                  </View>

                  {/* Amount Info */}
                  <View style={styles.amountContainer}>
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Đã tiết kiệm</Text>
                      <Text style={styles.currentAmount}>
                        {goal.currentAmount.toLocaleString()} đ
                      </Text>
                    </View>
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Mục tiêu</Text>
                      <Text style={styles.targetAmount}>
                        {goal.targetAmount.toLocaleString()} đ
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBg}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progress}%`,
                            backgroundColor: isCompleted
                              ? "#16A34A"
                              : "#4C6EF5",
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.percentText,
                        { color: isCompleted ? "#16A34A" : "#4C6EF5" },
                      ]}
                    >
                      {progress}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {goals.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddGoals")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4C6EF5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4C6EF5",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deadlineText: {
    fontSize: 13,
    color: "#6B7280",
  },
  completedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  amountContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  currentAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  targetAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4C6EF5",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBg: {
    flex: 1,
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
    fontSize: 14,
    fontWeight: "700",
    minWidth: 40,
    textAlign: "right",
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
    shadowColor: "#4C6EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
