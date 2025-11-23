import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { MOCK_TRANSACTIONS } from '../../../../constants/constants';
import { useTheme } from '../../../context/ThemeContext';

const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();
  const [filter, setFilter] = useState<'7days' | '3days' | 'custom'>('custom');
  const [searchTerm, setSearchTerm] = useState('');

  const MOCK_TODAY = new Date('2024-05-30');

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'custom') return true;
    const txDate = new Date(tx.date);
    const diffTime = Math.abs(MOCK_TODAY.getTime() - txDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (filter === '7days') return diffDays <= 7;
    if (filter === '3days') return diffDays <= 3;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Giao dịch</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <MaterialIcons name="search" size={24} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput 
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Tìm theo mô tả..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setFilter('7days')}
          style={[styles.filterChip, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }, filter === '7days' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, { color: theme.textPrimary }, filter === '7days' && styles.filterTextActive]}>7 ngày gần nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('3days')}
          style={[styles.filterChip, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }, filter === '3days' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, { color: theme.textPrimary }, filter === '3days' && styles.filterTextActive]}>3 ngày gần nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('custom')}
          style={[styles.filterChip, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }, filter === 'custom' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, { color: theme.textPrimary }, filter === 'custom' && styles.filterTextActive]}>Tùy chọn</Text>
        </TouchableOpacity>
      </ScrollView>

      {filter === 'custom' && (
        <View style={styles.dateRange}>
          <View style={styles.dateInputGroup}>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>Từ ngày</Text>
            <View style={[styles.dateInput, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Text style={{ color: theme.textPrimary }}>dd/mm/yyyy</Text>
            </View>
          </View>
          <View style={styles.dateInputGroup}>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>Đến ngày</Text>
            <View style={[styles.dateInput, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Text style={{ color: theme.textPrimary }}>dd/mm/yyyy</Text>
            </View>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredTransactions.length > 0 ? (
          <>
            <Text style={[styles.listTitle, { color: theme.textPrimary }]}>Danh sách giao dịch</Text>
            {filteredTransactions.map((tx) => (
              <View key={tx.id} style={[styles.transactionCard, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.iconBox, { 
                  backgroundColor: tx.type === 'income' 
                    ? (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)') 
                    : (tx.icon === 'coffee' 
                      ? theme.iconBoxBg 
                      : (isDarkMode ? 'rgba(60, 131, 246, 0.2)' : 'rgba(60, 131, 246, 0.1)'))
                }]}>
                  <MaterialIcons 
                    name={tx.icon as any} 
                    size={24} 
                    color={tx.type === 'income' ? '#22C55E' : (tx.icon === 'coffee' ? theme.textSecondary : '#3c83f6')} 
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: theme.textPrimary }]}>{tx.title}</Text>
                  <Text style={[styles.txSubtitle, { color: theme.textSecondary }]}>{tx.subtitle}</Text>
                </View>
                <View style={styles.txAmountContainer}>
                  <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#22C55E' : '#EF4444' }]}>
                    {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()}₫
                  </Text>
                  <Text style={[styles.txType, { color: theme.textSecondary }]}>{tx.type === 'income' ? 'Thu' : 'Chi'}</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Không tìm thấy giao dịch nào</Text>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111418',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    height: 50,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#3c83f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111418',
  },
  filterTextActive: {
    color: 'white',
  },
  dateRange: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  dateInput: {
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    color: '#6b7280',
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txType: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});

export default StatisticsScreen;