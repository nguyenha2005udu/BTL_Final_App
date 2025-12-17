import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ReportPeriod } from '../../hooks/useReportTotals';

type Props = {
  period: ReportPeriod;
  onChange: (p: ReportPeriod) => void;
  theme: any;
  isDarkMode: boolean;
};

export const ReportPeriodSelector: React.FC<Props> = ({ period, onChange, theme, isDarkMode }) => {
  return (
    <View style={[styles.periodSelector, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
      <TouchableOpacity
        style={[
          styles.periodButton,
          period === 'week' && styles.periodButtonActive,
          period === 'week' && { backgroundColor: theme.cardBackground },
        ]}
        onPress={() => onChange('week')}
      >
        <Text
          style={
            period === 'week'
              ? styles.periodTextActive
              : [styles.periodText, { color: theme.textSecondary }]
          }
        >
          Tuần này
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.periodButton,
          period === 'month' && styles.periodButtonActive,
          period === 'month' && { backgroundColor: theme.cardBackground },
        ]}
        onPress={() => onChange('month')}
      >
        <Text
          style={
            period === 'month'
              ? styles.periodTextActive
              : [styles.periodText, { color: theme.textSecondary }]
          }
        >
          Tháng này
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});