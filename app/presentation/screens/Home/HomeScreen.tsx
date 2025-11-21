import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { MOCK_TRANSACTIONS, MOCK_GOALS } from '../../../../constants/constants';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_vMSFQARLvGWesaN0bPwdT0TwBkCjQuK-p1dyFrGdqF-NhAqX3D22UFhPgycZkrUA24cKIcSZEPLOfhmUcNZTvYIXtJBvgXlaRUnPVCaQ5zWzrC0n45kOlTptHz4fEKjcJrTwoasD3u6BnAo6DO1bJ2oe7sNZMz4X8J4ZExMW6HBrFk1JAZloRwzDfjdw4WOSE8HcBg82M53Zk1lZ9igZ6sqHdz0lO3Cvw1h6_YE38kL45oHN1DtJsD26XLF9ECZDyI3c-2ms-qO0" }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.username}>Nguyễn Văn A</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialIcons name="notifications" size={24} color="#111418" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Tổng số dư</Text>
          <Text style={styles.balanceAmount}>25.680.000₫</Text>
        </View>

        {/* Income/Expense Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tổng thu</Text>
            <Text style={[styles.statValue, { color: '#22C55E' }]}>+15.000.000₫</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tổng chi</Text>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>-8.530.000₫</Text>
          </View>
        </View>

        {/* Monthly Report Card */}
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Chi tiêu trong tháng</Text>
          <Text style={styles.reportAmount}>8.530.000₫</Text>
          <View style={styles.reportTrend}>
            <MaterialIcons name="arrow-downward" size={16} color="#EF4444" />
            <Text style={styles.trendText}>5% so với tháng trước</Text>
          </View>
          
          {/* Mock Bar Chart */}
          <View style={styles.chartContainer}>
            {[70, 30, 50, 85, 60, 40, 75].map((height, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: `${height}%`, backgroundColor: index === 4 ? '#3c83f6' : 'rgba(60, 131, 246, 0.2)' }]} />
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
          <View style={styles.cardList}>
            {MOCK_TRANSACTIONS.slice(0, 3).map((tx) => (
              <TouchableOpacity key={tx.id} style={styles.transactionItem} onPress={() => navigation.navigate('CategoryDetail')}>
                <View style={[styles.iconBox, { backgroundColor: tx.type === 'income' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(60, 131, 246, 0.1)' }]}>
                  <MaterialIcons name={tx.icon} size={24} color={tx.type === 'income' ? '#22C55E' : '#3c83f6'} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSubtitle}>{tx.subtitle}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#22C55E' : '#EF4444' }]}>
                  {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()}₫
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mục tiêu tiết kiệm</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GoalList')}>
              <Text style={styles.linkText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ gap: 16 }}>
            {MOCK_GOALS.map((goal) => {
               const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100);
               return (
                <TouchableOpacity key={goal.id} style={styles.goalCard} onPress={() => navigation.navigate('GoalDetail', { id: goal.id })}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <View style={[styles.statusBadge, { 
                      backgroundColor: goal.status === 'ongoing' ? '#EFF6FF' : goal.status === 'completed' ? '#F0FDF4' : '#E2E8F0'
                    }]}>
                      <Text style={[styles.statusText, {
                        color: goal.status === 'ongoing' ? '#2563EB' : goal.status === 'completed' ? '#16A34A' : '#475569'
                      }]}>
                        {goal.status === 'ongoing' ? 'Đang tiến hành' : goal.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.goalProgress}>
                    <View style={styles.progressLabels}>
                       <Text style={styles.progressText}>
                        {goal.status === 'completed' ? 'Đã đạt mục tiêu' : (goal.status === 'cancelled' ? 'Mục tiêu đã hủy' : 'Đúng tiến độ')}
                       </Text>
                       <Text style={styles.progressTextBold}>{progress}% đã tiết kiệm</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { 
                        width: `${progress}%`,
                        backgroundColor: goal.status === 'ongoing' ? '#3c83f6' : goal.status === 'completed' ? '#22C55E' : '#9CA3AF'
                      }]} />
                    </View>
                    <View style={styles.progressAmounts}>
                      <Text style={styles.amountLabel}>Đã tiết kiệm: <Text style={styles.amountValue}>{goal.savedAmount.toLocaleString()}₫</Text></Text>
                      <Text style={styles.amountLabel}>Mục tiêu: <Text style={styles.amountValue}>{goal.targetAmount.toLocaleString()}₫</Text></Text>
                    </View>
                  </View>
                </TouchableOpacity>
               );
            })}
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
  },
  greeting: {
    fontSize: 12,
    color: '#60708a',
    fontWeight: '500',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111418',
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  balanceCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#60708a',
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3c83f6',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#60708a',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111418',
  },
  reportAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111418',
    marginVertical: 4,
  },
  reportTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3c83f6',
  },
  cardList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111418',
  },
  txSubtitle: {
    fontSize: 14,
    color: '#60708a',
  },
  txAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111418',
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
  goalProgress: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#60708a',
    fontWeight: '500',
  },
  progressTextBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111418',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontSize: 12,
    color: '#60708a',
  },
  amountValue: {
    color: '#111418',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3c83f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#3c83f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeScreen;