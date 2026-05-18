import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportCategoryList } from '@components/report/ReportCategoryList';
import { ReportCategoryPieCard } from '@components/report/ReportCategoryPieCard';
import { ReportPeriodSelector } from '@components/report/ReportPeriodSelector';
import { useCategories } from '@hooks/useCategories';
import { useReportTotals } from '@hooks/useReportTotals';
import { useTransactions } from '@hooks/useTransactions';
import { useTheme } from '@context/ThemeContext';

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();
  const { categories, loading } = useCategories();
  const { transactions, loading: txLoading } = useTransactions();
  const { period, setPeriod, totalIncome, totalExpense, balance, txInRange } = useReportTotals(transactions);
  const [filterType, setFilterType] = React.useState<'expense' | 'income'>('expense');

  const amountByCategory = React.useMemo(() => {
    const typeById = new Map(categories.map(c => [c.id, c.type]));
    const map = new Map<string, number>();

    for (const tx of (txInRange ?? [])) {
      const catId = tx.categoryId;
      if (!catId) continue;

      const catType = typeById.get(catId);
      if (catType && catType !== tx.type) continue;

      const raw =
        typeof (tx as any).mount === 'number'
          ? (tx as any).mount
          : typeof (tx as any).amount === 'number'
          ? (tx as any).amount
          : Number((tx as any).mount ?? (tx as any).amount ?? 0);

      if (!Number.isFinite(raw)) continue;

      const money = Math.abs(raw);
      map.set(catId, (map.get(catId) ?? 0) + money);
    }
    return map;
  }, [categories, txInRange]);
  
  // Map Category -> data cho phần "Chi tiêu theo danh mục"
  const rawData = categories.map(cat => ({
    id : cat.id,
    name: cat.name,
    type : cat.type,
    value: amountByCategory.get(cat.id) ?? 0, 
    budget: cat.budget ?? 0,                 
    color: cat.color || '#60A5FA',
    icon: cat.icon || 'category',
  }));

  const data = rawData.map(item => {
    const denom = item.type === 'income' ? totalIncome : totalExpense;
    return { ...item, percentage: denom > 0 ? Math.round((item.value / denom) * 100) : 0 };
  });

  if (loading || txLoading) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[
          styles.container,
          { 
            backgroundColor: isDarkMode ? theme.background : '#FFFFFF',
            justifyContent: 'center', 
            alignItems: 'center' 
          },
        ]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const filteredData = data.filter(item => item.type === filterType);

  const pieItems = filteredData
    .filter(i => i.value > 0)
    .map(i => ({ id: i.id, name: i.name, value: i.value, color: i.color }));

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
            borderBottomColor: isDarkMode ? theme.border : '#F1F5F9',
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Báo cáo
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <ReportPeriodSelector
          period={period}
          onChange={setPeriod}
          theme={theme}
          isDarkMode={isDarkMode}
        />

        {/* Summary Card */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF' }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Tổng thu
              </Text>
              <Text style={[styles.summaryValue, { color: '#22C55E' }]}>
                {totalIncome.toLocaleString('vi-VN')}₫
              </Text> 
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Tổng chi
              </Text>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                {totalExpense.toLocaleString('vi-VN')}₫
              </Text>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: isDarkMode ? theme.divider : '#F1F5F9' }]}
          />
          <View style={styles.balanceItem}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.textSecondary },
              ]}
            >
              Chênh lệch
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: balance >= 0 ? '#22C55E' : '#EF4444', fontSize: 24 },
              ]}
            >
              {balance.toLocaleString('vi-VN')}₫
            </Text>
          </View>
        </View>

        {/* Type Filter */}
        <View style={styles.typeFilterRow}>
          <TouchableOpacity
            style={[
              styles.typeFilterChip,
              { 
                backgroundColor: filterType === 'expense' 
                  ? '#3c83f6' 
                  : isDarkMode ? theme.cardBackground : '#FFFFFF',
                borderColor: filterType === 'expense'
                  ? '#3c83f6'
                  : isDarkMode ? theme.border : '#E2E8F0',
              },
            ]}
            onPress={() => setFilterType('expense')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeFilterText,
                { color: filterType === 'expense' ? '#ffffff' : theme.textPrimary },
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeFilterChip,
              {
                backgroundColor: filterType === 'income'
                  ? '#3c83f6'
                  : isDarkMode ? theme.cardBackground : '#FFFFFF',
                borderColor: filterType === 'income'
                  ? '#3c83f6'
                  : isDarkMode ? theme.border : '#E2E8F0',
              },
            ]}
            onPress={() => setFilterType('income')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeFilterText,
                { color: filterType === 'income' ? '#ffffff' : theme.textPrimary },
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>
                
        <ReportCategoryPieCard
          mode={filterType}
          items={pieItems}
          total={filterType === 'expense' ? totalExpense : totalIncome}
          theme={theme}
          isDarkMode={isDarkMode}
        />
        
        {/* Legend */}
        <ReportCategoryList
          items={filteredData.map(i => ({
            id: i.id,
            name: i.name,
            color: i.color,
            icon: i.icon,
            value: i.value,
            budget: i.budget,
          }))}
          mode={filterType}
          theme={theme}
          onPressItem={(id) => {
            const fullCategory = categories.find(cat => cat.id === id);
            if (fullCategory) navigation.navigate('CategoryDetail', { category: fullCategory });
          }}
          onAddCategory={() => navigation.navigate('AddCategory' as never)}
        />
      
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.outlineButton,
              {
                backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
                borderColor: isDarkMode ? theme.border : '#E2E8F0',
              },
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="download"
              size={20}
              color={theme.textPrimary}
            />
            <Text
              style={[
                styles.outlineButtonText,
                { color: theme.textPrimary },
              ]}
            >
              Xuất CSV
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.outlineButton,
              {
                backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
                borderColor: isDarkMode ? theme.border : '#E2E8F0',
              },
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="description"
              size={20}
              color={theme.textPrimary}
            />
            <Text
              style={[
                styles.outlineButtonText,
                { color: theme.textPrimary },
              ]}
            >
              Xuất PDF
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#dddddfff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#3c83f6",
    shadowOpacity: 0.15,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  balanceItem: {
    gap: 4,
  },
  typeFilterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeFilterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    gap: 8,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111418',
  },
});

export default ReportScreen;