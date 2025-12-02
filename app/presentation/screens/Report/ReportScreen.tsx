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
import { useCategories } from '../../../../hooks/useCategories';
import { useTheme } from '../../../context/ThemeContext';

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();
  const { categories, loading } = useCategories();

  // Map Category -> data cho phần "Chi tiêu theo danh mục"
  const rawData = categories.map(cat => ({
    name: cat.name,
    value: cat.spent ?? 0, // tạm thời 0, sau này cộng từ transactions
    color: cat.color || '#60A5FA',
  }));

  const totalExpense = rawData.reduce((sum, item) => sum + item.value, 0);

  const data = rawData.map(item => ({
    ...item,
    percentage:
      totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0,
  }));

  if (loading) {
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
        <View
          style={[
            styles.periodSelector,
            { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' },
          ]}
        >
          <TouchableOpacity style={styles.periodButton}>
            <Text
              style={[styles.periodText, { color: theme.textSecondary }]}
            >
              Tuần này
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              styles.periodButtonActive,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.periodTextActive}>Tháng này</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text
              style={[styles.periodText, { color: theme.textSecondary }]}
            >
              Tùy chọn
            </Text>
          </TouchableOpacity>
        </View>

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
                0₫ {/* TODO: sau dùng totalIncome */}
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
                { color: '#3c83f6', fontSize: 24 },
              ]}
            >
              {(-totalExpense).toLocaleString()}₫
            </Text>
          </View>
        </View>

        {/* Detail Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Chi tiêu theo danh mục
          </Text>

          {/* Vòng tròn tổng chi (demo) */}
          <View style={styles.chartArea}>
            <View
              style={[
                styles.piePlaceholder,
                {
                  backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                },
              ]}
            >
              <View style={styles.pieInnerCircle}>
                <Text
                  style={[
                    styles.pieLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Tổng chi
                </Text>
                <Text
                  style={[
                    styles.pieValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {totalExpense.toLocaleString()}₫
                </Text>
              </View>
              <View
                style={[
                  styles.slice,
                  {
                    backgroundColor: '#60A5FA',
                    transform: [{ rotate: '0deg' }],
                  },
                ]}
              />
              <View
                style={[
                  styles.slice,
                  {
                    backgroundColor: '#F87171',
                    transform: [{ rotate: '90deg' }],
                  },
                ]}
              />
              <View
                style={[
                  styles.slice,
                  {
                    backgroundColor: '#FBBF24',
                    transform: [{ rotate: '180deg' }],
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.legendList}>
            {data.map(item => (
              <TouchableOpacity 
                key={item.name}
                onPress={() => {
                  const fullCategory = categories.find(cat => cat.name === item.name);
                  if (fullCategory) {
                    navigation.navigate('CategoryDetail', { category: fullCategory });
                  }
                }}
                style={styles.legendItem}
                >

                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: item.color },
                  ]}
                />
                <View style={styles.legendInfo}>
                  <Text
                    style={[
                      styles.legendName,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                <View style={styles.legendValues}>
                  <Text
                    style={[
                      styles.legendAmount,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {item.value.toLocaleString()}₫
                  </Text>
                  <Text
                    style={[
                      styles.legendPercent,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {item.percentage}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.addCategoryButton,
                { borderTopColor: theme.divider },
              ]}
              onPress={() => navigation.navigate('AddCategory' as never)}
            >
              <View
                style={[
                  styles.addIcon,
                  { backgroundColor: theme.iconBoxBg },
                ]}
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
              <Text style={styles.addText}>Thêm danh mục</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    height: 40,
  },
  periodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  periodTextActive: {
    fontSize: 13,
    color: '#3c83f6',
    fontWeight: '600',
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
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
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
