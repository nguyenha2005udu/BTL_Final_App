import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const data = [
    { name: 'Ăn uống', value: 2500000, color: '#60A5FA', percentage: 45 }, 
    { name: 'Di chuyển', value: 1665000, color: '#F87171', percentage: 30 }, 
    { name: 'Mua sắm', value: 832500, color: '#FBBF24', percentage: 15 }, 
    { name: 'Giải trí', value: 552500, color: '#34D399', percentage: 10 }, 
  ];

  const totalExpense = 5550000;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo cáo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Tuần này</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.periodButton, styles.periodButtonActive]}>
            <Text style={styles.periodTextActive}>Tháng này</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Tùy chọn</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng thu</Text>
              <Text style={[styles.summaryValue, { color: '#22C55E' }]}>15.000.000₫</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng chi</Text>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>5.550.000₫</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.balanceItem}>
            <Text style={styles.summaryLabel}>Chênh lệch</Text>
            <Text style={[styles.summaryValue, { color: '#3c83f6', fontSize: 24 }]}>9.450.000₫</Text>
          </View>
        </View>

        {/* Detail Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiêu theo danh mục</Text>
          
          {/* Mock Pie Chart Visualization (Simple Bars) */}
          <View style={styles.chartArea}>
            <View style={styles.piePlaceholder}>
               <View style={styles.pieInnerCircle}>
                  <Text style={styles.pieLabel}>Tổng chi</Text>
                  <Text style={styles.pieValue}>5.5tr</Text>
               </View>
               {/* Visual representation only - slices would be complex */}
               <View style={[styles.slice, { backgroundColor: '#60A5FA', transform: [{ rotate: '0deg' }] }]} />
               <View style={[styles.slice, { backgroundColor: '#F87171', transform: [{ rotate: '90deg' }] }]} />
               <View style={[styles.slice, { backgroundColor: '#FBBF24', transform: [{ rotate: '180deg' }] }]} />
            </View>
          </View>

          <View style={styles.legendList}>
            {data.map((item) => (
              <View key={item.name} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <View style={styles.legendInfo}>
                  <Text style={styles.legendName}>{item.name}</Text>
                </View>
                <View style={styles.legendValues}>
                  <Text style={styles.legendAmount}>{item.value.toLocaleString()}₫</Text>
                  <Text style={styles.legendPercent}>{item.percentage}%</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addCategoryButton}
              onPress={() => navigation.navigate('AddCategory')}
            >
              <View style={styles.addIcon}>
                <MaterialIcons name="add" size={20} color="#6b7280" />
              </View>
              <Text style={styles.addText}>Thêm danh mục</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.outlineButton}>
            <MaterialIcons name="download" size={20} color="#111418" />
            <Text style={styles.outlineButtonText}>Xuất CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}>
            <MaterialIcons name="description" size={20} color="#111418" />
            <Text style={styles.outlineButtonText}>Xuất PDF</Text>
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