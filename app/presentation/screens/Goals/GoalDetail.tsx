import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { MOCK_GOALS } from '../../../../constants/constants';
import { useTheme } from '../../../context/ThemeContext';

const GoalDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { theme, isDarkMode } = useTheme();
  const { id } = route.params || {};
  const goal = MOCK_GOALS.find(g => g.id === id) || MOCK_GOALS[0];
  const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{goal.title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="more-vert" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.goalTitleLarge, { color: theme.textPrimary }]}>{goal.title}</Text>
          <View style={styles.amountRow}>
            <Text style={styles.savedAmountLarge}>{goal.savedAmount.toLocaleString()}₫</Text>
            <Text style={[styles.targetAmountLarge, { color: theme.textSecondary }]}> / {goal.targetAmount.toLocaleString()}₫</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Đã hoàn thành</Text>
              <Text style={[styles.progressValue, { color: theme.textPrimary }]}>{progress}%</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: theme.divider }]}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.statusChip, { backgroundColor: isDarkMode ? '#1e3d2e' : '#dcfce7' }]}>
              <Text style={[styles.statusChipText, { color: isDarkMode ? '#4ade80' : '#166534' }]}>Đang thực hiện</Text>
            </View>
            <View style={styles.deadlineInfo}>
              <MaterialIcons name="calendar-today" size={16} color={theme.textSecondary} />
              <Text style={[styles.deadlineText, { color: theme.textSecondary }]}>Hoàn thành trước: {goal.deadline || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* History Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Lịch sử nạp/rút</Text>
          <View style={styles.historyList}>
            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={[styles.historyIcon, { backgroundColor: isDarkMode ? '#1e3d2e' : '#DCFCE7' }]}>
                  <MaterialIcons name="arrow-upward" size={20} color="#16A34A" />
                </View>
                <View>
                  <Text style={[styles.historyType, { color: theme.textPrimary }]}>Nạp tiền</Text>
                  <Text style={[styles.historyDate, { color: theme.textSecondary }]}>Hôm nay</Text>
                </View>
              </View>
              <Text style={[styles.historyAmount, { color: '#16A34A' }]}>+1,000,000₫</Text>
            </View>
            
            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={[styles.historyIcon, { backgroundColor: isDarkMode ? '#1e3d2e' : '#DCFCE7' }]}>
                  <MaterialIcons name="arrow-upward" size={20} color="#16A34A" />
                </View>
                <View>
                  <Text style={[styles.historyType, { color: theme.textPrimary }]}>Nạp tiền</Text>
                  <Text style={[styles.historyDate, { color: theme.textSecondary }]}>15 Jun, 2024</Text>
                </View>
              </View>
              <Text style={[styles.historyAmount, { color: '#16A34A' }]}>+2,000,000₫</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={[styles.historyIcon, { backgroundColor: isDarkMode ? '#4a1d1d' : '#FEE2E2' }]}>
                  <MaterialIcons name="arrow-downward" size={20} color="#DC2626" />
                </View>
                <View>
                  <Text style={[styles.historyType, { color: theme.textPrimary }]}>Rút tiền</Text>
                  <Text style={[styles.historyDate, { color: theme.textSecondary }]}>01 Jun, 2024</Text>
                </View>
              </View>
              <Text style={[styles.historyAmount, { color: '#DC2626' }]}>-500,000₫</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: isDarkMode ? '#1e3a5f' : 'rgba(60, 131, 246, 0.1)' }]}>
          <Text style={styles.withdrawText}>Rút tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.depositButton]}>
          <Text style={styles.depositText}>Nạp tiền</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#f5f7f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalTitleLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111418',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  savedAmountLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3c83f6',
  },
  targetAmountLarge: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111418',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3c83f6',
    borderRadius: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusChip: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusChipText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
    marginBottom: 16,
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111418',
  },
  historyDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawButton: {
    backgroundColor: 'rgba(60, 131, 246, 0.1)',
  },
  withdrawText: {
    color: '#3c83f6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  depositButton: {
    backgroundColor: '#3c83f6',
  },
  depositText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GoalDetail;