import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieItem, ReportPieChart } from './ReportPieChart';

type Props = {
  mode: 'expense' | 'income';
  items: PieItem[];      // items đã lọc theo mode
  total: number;         // totalExpense hoặc totalIncome (theo period)
  theme: any;
  isDarkMode: boolean;
};

export const ReportCategoryPieCard: React.FC<Props> = ({
  mode,
  items,
  total,
  theme,
}) => {
  const title = mode === 'expense' ? 'Chi tiêu theo danh mục' : 'Thu nhập theo danh mục';
  const centerLabel = mode === 'expense' ? 'Tổng chi' : 'Tổng thu';
  const centerValue = `${Math.round(total).toLocaleString()}₫`;

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

      <ReportPieChart
        items={items}
        theme={theme}
        centerLabel={centerLabel}
        centerValue={centerValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  title: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '800', marginBottom: 10 },
});
