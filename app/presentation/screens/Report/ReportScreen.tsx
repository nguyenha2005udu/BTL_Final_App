import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useCategories } from '../../../../hooks/useCategories';
import { useTheme } from '../../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = Math.min(SCREEN_WIDTH - 80, 280);
const RADIUS = CHART_SIZE / 2 - 10;

interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const PieChart: React.FC<{ data: PieChartData[]; centerText: string; isDarkMode: boolean }> = ({ 
  data, 
  centerText,
  isDarkMode 
}) => {
  if (data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <View style={[styles.chartContainer, { height: CHART_SIZE }]}>
        <View style={styles.emptyChart}>
          <MaterialIcons name="pie-chart" size={48} color={isDarkMode ? '#6B7280' : '#9CA3AF'} />
          <Text style={[styles.emptyChartText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            Chưa có dữ liệu
          </Text>
        </View>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculate path for pie slice
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = CHART_SIZE / 2 + RADIUS * Math.cos(startRad);
    const y1 = CHART_SIZE / 2 + RADIUS * Math.sin(startRad);
    const x2 = CHART_SIZE / 2 + RADIUS * Math.cos(endRad);
    const y2 = CHART_SIZE / 2 + RADIUS * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${CHART_SIZE / 2} ${CHART_SIZE / 2}`,
      `L ${x1} ${y1}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return (
      <G key={index}>
        <Circle
          cx={CHART_SIZE / 2}
          cy={CHART_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={item.color}
          strokeWidth={RADIUS}
          strokeDasharray={`${(percentage / 100) * (2 * Math.PI * RADIUS)} ${2 * Math.PI * RADIUS}`}
          strokeDashoffset={-((startAngle + 90) / 360) * (2 * Math.PI * RADIUS)}
          rotation={0}
          origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}
        />
      </G>
    );
  });

  return (
    <View style={styles.chartContainer}>
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        {slices}
        {/* Center circle for donut effect */}
        <Circle
          cx={CHART_SIZE / 2}
          cy={CHART_SIZE / 2}
          r={RADIUS * 0.6}
          fill={isDarkMode ? '#1F2937' : '#FFFFFF'}
        />
        <SvgText
          x={CHART_SIZE / 2}
          y={CHART_SIZE / 2}
          fontSize="20"
          fontWeight="bold"
          fill={isDarkMode ? '#F9FAFB' : '#111827'}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {centerText}
        </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: isDarkMode ? '#E5E7EB' : '#374151' }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.legendValue, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();
  const { categories, loading } = useCategories();
  const [selectedPeriod, setSelectedPeriod] = React.useState<'week' | 'month'>('month');
  const [filterType, setFilterType] = React.useState<'expense' | 'income'>('expense');

  const rawData = categories.map(cat => ({
    name: cat.name,
    type: cat.type,
    spent: cat.spent ?? 0,
    budget: cat.budget ?? 0,
    color: cat.color || '#60A5FA',
  }));

  const totalExpense = rawData.filter(x => x.type === 'expense').reduce((sum, item) => sum + item.spent, 0);
  const totalIncome = rawData.filter(x => x.type === 'income').reduce((sum, item) => sum + item.spent, 0);

  // Prepare chart data
  const expenseChartData: PieChartData[] = rawData
    .filter(x => x.type === 'expense' && x.spent > 0)
    .map(item => ({
      name: item.name,
      value: item.spent,
      color: item.color,
      percentage: totalExpense > 0 ? (item.spent / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const incomeChartData: PieChartData[] = rawData
    .filter(x => x.type === 'income' && x.spent > 0)
    .map(item => ({
      name: item.name,
      value: item.spent,
      color: item.color,
      percentage: totalIncome > 0 ? (item.spent / totalIncome) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const filteredData = rawData.filter(item => item.type === filterType);
  const cardBg = isDarkMode ? theme.cardBackground : '#f8f9fa';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Báo cáo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Period Selector */}
        <View style={[styles.periodSelector, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'week' && [styles.periodButtonActive, { backgroundColor: cardBg }]]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodText, { color: theme.textSecondary }, selectedPeriod === 'week' && styles.periodTextActive]}>
              Tuần này
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'month' && [styles.periodButtonActive, { backgroundColor: cardBg }]]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, { color: theme.textSecondary }, selectedPeriod === 'month' && styles.periodTextActive]}>
              Tháng này
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Tổng thu</Text>
              <Text style={[styles.summaryValue, { color: '#22C55E' }]}>+{totalIncome.toLocaleString()}₫</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Tổng chi</Text>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>-{totalExpense.toLocaleString()}₫</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: isDarkMode ? theme.divider : '#e5e7eb' }]} />
          <View style={styles.balanceItem}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Chênh lệch</Text>
            <Text style={[styles.summaryValue, { color: '#3c83f6', fontSize: 24 }]}>
              {(totalIncome - totalExpense).toLocaleString()}₫
            </Text>
          </View>
        </View>

        {/* Type Filter & Pie Chart */}
        <View style={styles.typeFilterRow}>
          <TouchableOpacity
            style={[styles.typeFilterChip, { borderColor: isDarkMode ? theme.border : '#d1d5db' }, filterType === 'expense' && styles.typeFilterChipActive]}
            onPress={() => setFilterType('expense')}
          >
            <Text style={[styles.typeFilterText, { color: theme.textSecondary }, filterType === 'expense' && styles.typeFilterTextActive]}>
              Chi tiêu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeFilterChip, { borderColor: isDarkMode ? theme.border : '#d1d5db' }, filterType === 'income' && styles.typeFilterChipActive]}
            onPress={() => setFilterType('income')}
          >
            <Text style={[styles.typeFilterText, { color: theme.textSecondary }, filterType === 'income' && styles.typeFilterTextActive]}>
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pie Chart - Dynamic based on filter */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Biểu đồ {filterType === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
          </Text>
          <PieChart 
            data={filterType === 'expense' ? expenseChartData : incomeChartData} 
            centerText={filterType === 'expense' ? `${totalExpense.toLocaleString()}₫` : `${totalIncome.toLocaleString()}₫`}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Category List with Budget Progress */}
        <View style={styles.categoriesList}>
          {filteredData.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: cardBg }]}>
              <MaterialIcons name="inbox" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Chưa có danh mục {filterType === 'expense' ? 'chi tiêu' : 'thu nhập'} nào
              </Text>
            </View>
          ) : (
            filteredData.map(item => {
              const spentPercent = item.budget > 0 ? Math.round((item.spent / item.budget) * 100) : 0;
              const remaining = item.budget - item.spent;
              const remainingPercent = item.budget > 0 ? Math.max(0, 100 - spentPercent) : 0;
              
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.categoryCard, { backgroundColor: cardBg }]}
                  onPress={() => {
                    const fullCategory = categories.find(cat => cat.name === item.name);
                    if (fullCategory) {
                      navigation.navigate('CategoryDetail', { category: fullCategory });
                    }
                  }}
                >
                  {/* Header */}
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryTitleRow}>
                      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                      <Text style={[styles.categoryName, { color: theme.textPrimary }]}>{item.name}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={theme.textSecondary} />
                  </View>

                  {/* Amount Info */}
                  <View style={styles.amountRow}>
                    <View>
                      <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>Đã {filterType === 'expense' ? 'chi' : 'thu'}</Text>
                      <Text style={[styles.amountValue, { color: filterType === 'expense' ? '#EF4444' : '#22C55E' }]}>
                        {item.spent.toLocaleString()}₫
                      </Text>
                    </View>
                    {item.budget > 0 && (
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>Ngân sách</Text>
                        <Text style={[styles.amountValue, { color: theme.textPrimary }]}>
                          {item.budget.toLocaleString()}₫
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Progress Bar */}
                  {item.budget > 0 && (
                    <>
                      <View style={[styles.progressBar, { backgroundColor: isDarkMode ? theme.divider : '#e5e7eb' }]}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(spentPercent, 100)}%`,
                              backgroundColor: spentPercent >= 100 
                                ? '#EF4444' 
                                : spentPercent >= 80 
                                  ? '#F59E0B' 
                                  : filterType === 'expense' ? '#3c83f6' : '#22C55E'
                            }
                          ]}
                        />
                      </View>

                      {/* Stats Row */}
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Đã dùng</Text>
                          <Text style={[styles.statValue, { 
                            color: spentPercent >= 100 ? '#EF4444' : spentPercent >= 80 ? '#F59E0B' : theme.textPrimary 
                          }]}>
                            {spentPercent}%
                          </Text>
                        </View>
                        <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
                          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Còn lại</Text>
                          <Text style={[styles.statValue, { color: remaining >= 0 ? '#22C55E' : '#EF4444' }]}>
                            {remaining >= 0 ? remainingPercent : 0}% ({remaining.toLocaleString()}₫)
                          </Text>
                        </View>
                      </View>
                    </>
                  )}

                  {/* No Budget Warning */}
                  {item.budget === 0 && (
                    <View style={[styles.noBudgetBox, { backgroundColor: isDarkMode ? '#4a3d1d' : '#FEF7E0' }]}>
                      <MaterialIcons name="info-outline" size={16} color="#F59E0B" />
                      <Text style={[styles.noBudgetText, { color: theme.textSecondary }]}>
                        Chưa đặt ngân sách
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}

          {/* Add Category Button */}
          <TouchableOpacity
            style={[styles.addCategoryCard, { backgroundColor: cardBg, borderColor: isDarkMode ? theme.border : '#d1d5db' }]}
            onPress={() => navigation.navigate('AddCategory')}
          >
            <View style={[styles.addIconCircle, { backgroundColor: isDarkMode ? theme.iconBoxBg : '#e5e7eb' }]}>
              <MaterialIcons name="add" size={24} color="#3c83f6" />
            </View>
            <Text style={[styles.addCategoryText, { color: theme.textPrimary }]}>Thêm danh mục mới</Text>
          </TouchableOpacity>
        </View>

        {/* Export Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.outlineButton, { backgroundColor: cardBg, borderColor: isDarkMode ? theme.border : '#d1d5db' }]}>
            <MaterialIcons name="download" size={20} color={theme.textPrimary} />
            <Text style={[styles.outlineButtonText, { color: theme.textPrimary }]}>Xuất CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.outlineButton, { backgroundColor: cardBg, borderColor: isDarkMode ? theme.border : '#d1d5db' }]}>
            <MaterialIcons name="description" size={20} color={theme.textPrimary} />
            <Text style={[styles.outlineButtonText, { color: theme.textPrimary }]}>Xuất PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 60, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 100 },
  periodSelector: { flexDirection: 'row', borderRadius: 10, padding: 4, marginBottom: 16, height: 40 },
  periodButton: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  periodButtonActive: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  periodText: { fontSize: 13, fontWeight: '500' },
  periodTextActive: { color: '#3c83f6', fontWeight: '600' },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  summaryRow: { flexDirection: 'row', marginBottom: 16 },
  summaryItem: { flex: 1 },
  summaryLabel: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, marginBottom: 16 },
  balanceItem: { gap: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  chartContainer: { alignItems: 'center' },
  emptyChart: { alignItems: 'center', justifyContent: 'center', height: CHART_SIZE },
  emptyChartText: { fontSize: 14, marginTop: 8 },
  legend: { width: '100%', marginTop: 16, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { flex: 1, fontSize: 14, fontWeight: '500' },
  legendValue: { fontSize: 13, fontWeight: '600' },
  typeFilterRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  typeFilterChip: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  typeFilterChipActive: { backgroundColor: '#3c83f6', borderColor: '#3c83f6' },
  typeFilterText: { fontSize: 14, fontWeight: '600' },
  typeFilterTextActive: { color: '#ffffff' },
  categoriesList: { gap: 12 },
  categoryCard: { borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  categoryName: { fontSize: 16, fontWeight: '600' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  amountLabel: { fontSize: 12, marginBottom: 4 },
  amountValue: { fontSize: 16, fontWeight: 'bold' },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1 },
  statLabel: { fontSize: 11, marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: '600' },
  noBudgetBox: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8, marginTop: 8 },
  noBudgetText: { fontSize: 12 },
  emptyCard: { borderRadius: 16, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  emptyText: { fontSize: 14, marginTop: 12 },
  addCategoryCard: { borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderStyle: 'dashed' },
  addIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  addCategoryText: { fontSize: 16, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  outlineButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderWidth: 1, borderRadius: 10, gap: 8 },
  outlineButtonText: { fontSize: 14, fontWeight: '600' },
});

export default ReportScreen;