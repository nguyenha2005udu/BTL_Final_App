import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { MOCK_GOALS } from '../../../../constants/constants';
import { useTheme } from '../../../context/ThemeContext';

const SavingGoalsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity onPress={() => navigation.navigate('App')} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Mục tiêu tiết kiệm</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="bar-chart" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        {['Tất cả', 'Đang tiến hành', 'Hoàn thành', 'Đã hủy'].map((tab, idx) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, idx === 0 && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, { color: theme.textSecondary }, idx === 0 && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {MOCK_GOALS.map(goal => {
          const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100);
          return (
            <TouchableOpacity 
              key={goal.id} 
              onPress={() => navigation.navigate('GoalDetail', { id: goal.id })} 
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{goal.title}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, {
                    backgroundColor: goal.status === 'ongoing' 
                      ? (isDarkMode ? '#1e3a5f' : '#EFF6FF') 
                      : goal.status === 'completed' 
                        ? (isDarkMode ? '#1e3d2e' : '#F0FDF4') 
                        : (isDarkMode ? '#374151' : '#F1F5F9')
                  }]}>
                    <Text style={[styles.statusText, {
                      color: goal.status === 'ongoing' 
                        ? (isDarkMode ? '#60a5fa' : '#3c83f6') 
                        : goal.status === 'completed' 
                          ? '#16A34A' 
                          : theme.textSecondary
                    }]}>
                      {goal.status === 'ongoing' ? 'Đang tiến hành' : goal.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <MaterialIcons name="more-vert" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <Text style={[styles.progressStatus, { color: theme.textSecondary }]}>
                    {goal.status === 'completed' ? 'Đã đạt mục tiêu' : (goal.status === 'cancelled' ? 'Mục tiêu đã hủy' : 'Đúng tiến độ')}
                  </Text>
                  <Text style={[styles.progressPercent, { color: theme.textPrimary }]}>{progress}% đã tiết kiệm</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.divider }]}>
                  <View 
                    style={[styles.progressBarFill, {
                      width: `${progress}%`,
                      backgroundColor: goal.status === 'ongoing' ? '#3c83f6' : goal.status === 'completed' ? '#22C55E' : '#94A3B8'
                    }]} 
                  />
                </View>
                <View style={styles.amountRow}>
                  <Text style={[styles.amountText, { color: theme.textSecondary }]}>Đã tiết kiệm: {goal.savedAmount.toLocaleString()}₫</Text>
                  <Text style={[styles.amountText, { color: theme.textSecondary }]}>Mục tiêu: {goal.targetAmount.toLocaleString()}₫</Text>
                </View>
              </View>
              
              <View style={styles.footer}>
                <MaterialIcons name="calendar-today" size={16} color={theme.textSecondary} />
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>{goal.deadline ? `Hạn chót: ${goal.deadline}` : 'Không có thời hạn'}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddGoal')}>
        <MaterialIcons name="add" size={24} color="white" />
        <Text style={styles.fabText}>Mục tiêu mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f5f7f8',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#3c83f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#3c83f6',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    gap: 8,
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111418',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountText: {
    fontSize: 12,
    color: '#64748B',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3c83f6',
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#3c83f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SavingGoalsScreen;