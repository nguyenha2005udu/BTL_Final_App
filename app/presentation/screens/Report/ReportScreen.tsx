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
import { ReportCategoryList } from '../../../../components/report/ReportCategoryList';
import { ReportPeriodSelector } from '../../../../components/report/ReportPeriodSelector';
import { useCategories } from '../../../../hooks/useCategories';
import { useReportTotals } from '../../../../hooks/useReportTotals';
import { useTransactions } from '../../../../hooks/useTransactions';
import { useTheme } from '../../../context/ThemeContext';

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

    for (const tx of txInRange) {
      const catId = (tx as any).categoryId; 
      if (!catId) continue;

      const catType = typeById.get(catId);
      if (catType && catType !== tx.type) continue;

      map.set(catId, (map.get(catId) ?? 0) + (tx.amount ?? 0));
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
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  const filteredData = data.filter(item => item.type === filterType);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.headerBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Báo cáo
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Period Selector */}
        <ReportPeriodSelector
          period={period}
          onChange={setPeriod}
          theme={theme}
          isDarkMode={isDarkMode}
        />

        {/* Summary Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
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
                {totalIncome.toLocaleString()}₫
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
                {totalExpense.toLocaleString()}₫
              </Text>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.divider }]}
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
              {balance.toLocaleString()}₫
            </Text>
          </View>
        </View>

        {/* Type Filter */}
        <View style={styles.typeFilterRow}>
            <TouchableOpacity
              style={[
                styles.typeFilterChip,
                filterType === 'expense' && styles.typeFilterChipActive,
              ]}
              onPress={() => setFilterType('expense')}
            >
              <Text
                style={[
                  styles.typeFilterText,
                  filterType === 'expense' && styles.typeFilterTextActive,
                ]}
              >
                Chi tiêu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeFilterChip,
                filterType === 'income' && styles.typeFilterChipActive,
              ]}
              onPress={() => setFilterType('income')}
            >
              <Text
                style={[
                  styles.typeFilterText,
                  filterType === 'income' && styles.typeFilterTextActive,
                ]}
              >
                Thu nhập
              </Text>
            </TouchableOpacity>
          </View>
    
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
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
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
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  typeFilterChipActive: {
    backgroundColor: '#3c83f6',
    borderColor: '#3c83f6',
  },
  typeFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  typeFilterTextActive: {
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
    marginBottom: 16,
  },
  chartArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 24,
  },
  piePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 10,
    borderColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  pieInnerCircle: {
    alignItems: 'center',
  },
  pieLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  pieValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  slice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 80,
    opacity: 0.2, // Just for effect
  },
  legendList: {
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIconBox: {
  width: 28,
  height: 28,
  borderRadius: 14,
  marginRight: 12,
  alignItems: 'center',
  justifyContent: 'center',
  },
  legendInfo: {
    flex: 1,
  },
  legendName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111418',
  },
  legendValues: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111418',
  },
  legendPercent: {
    fontSize: 13,
    color: '#6b7280',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    borderStyle: 'dashed',
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3c83f6',
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