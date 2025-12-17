import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ReportCategoryListItem = {
  id: string;
  name: string;
  color: string;
  icon: string;
  value: number; // đã chi / đã thu
  budget: number; // ngân sách / mục tiêu
};

type Props = {
  items: ReportCategoryListItem[];
  mode: 'expense' | 'income';
  theme: any;
  onPressItem: (id: string) => void;
  onAddCategory: () => void;
};

const formatMoney = (n: number) => `${Math.max(0, Math.round(n)).toLocaleString('vi-VN')}đ`;

export const ReportCategoryList: React.FC<Props> = ({
  items,
  mode,
  theme,
  onPressItem,
  onAddCategory,
}) => {
  const isEmpty = items.length === 0;
  const mainColor = mode === 'expense' ? '#EF4444' : '#22C55E';

  if (isEmpty) {
    return (
      <View style={styles.section}>
        <View style={[styles.emptyBox, { backgroundColor: theme.cardBackground }]}>
          <MaterialIcons name="inbox" size={46} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {mode === 'income'
              ? 'Chưa có danh mục thu nhập nào'
              : 'Chưa có danh mục chi tiêu nào'}
          </Text>
        </View>

        <AddCategoryTile theme={theme} onPress={onAddCategory} />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {items.map(item => {
        const budget = Number(item.budget ?? 0);
        const spent = Number(item.value ?? 0);

        const hasBudget = budget > 0;
        const usedRatio = hasBudget ? spent / budget : 0;

        const usedPercent = hasBudget ? Math.round(usedRatio * 100) : 0;
        const barPercent = hasBudget ? Math.min(100, Math.max(0, usedRatio * 100)) : 0;

        const overspent = hasBudget ? Math.max(0, spent - budget) : 0;
        const remainingAmount = hasBudget ? Math.max(0, budget - spent) : 0;
        const remainingPercent = hasBudget ? Math.max(0, 100 - Math.max(0, usedPercent)) : 0;

        return (
          <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            {/* Header: dot + title + chevron */}
            <TouchableOpacity
              style={styles.headerRow}
              onPress={() => onPressItem(item.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconBox, { backgroundColor: `${item.color}22` }]}>
                <MaterialIcons
                    name={(item.icon as any) || 'category'}
                    size={20}
                    color={item.color}
                />
                </View>
              <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Row 1: spent/earned vs budget/goal */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {mode === 'expense' ? 'Đã chi' : 'Đã thu'}
                </Text>
                <Text style={[styles.bigNumber, { color: mainColor }]}>
                  {formatMoney(spent)}
                </Text>
              </View>

              <View style={[styles.col, styles.colRight]}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {mode === 'expense' ? 'Ngân sách' : 'Mục tiêu'}
                </Text>
                <Text style={[styles.bigNumber, { color: theme.textPrimary }]}>
                  {formatMoney(budget)}
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View style={[styles.progressTrack, { backgroundColor: theme.divider }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${barPercent}%`,
                    backgroundColor: mainColor,
                    opacity: 0.35,
                  },
                ]}
              />
            </View>

            {/* Row 2: used vs remaining */}
            <View style={[styles.row, styles.rowBottom]}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Đã dùng</Text>
                <Text style={[styles.midNumber, { color: theme.textPrimary }]}>
                  {hasBudget ? `${Math.max(0, usedPercent)}%` : '0%'}
                </Text>
              </View>

              <View style={[styles.col, styles.colRight]}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {overspent > 0 ? 'Vượt' : 'Còn lại'}
                </Text>

                {overspent > 0 ? (
                  <Text style={[styles.midNumber, { color: '#EF4444' }]}>
                    {formatMoney(overspent)}
                  </Text>
                ) : (
                  <Text style={[styles.midNumber, { color: '#22C55E' }]}>
                    {hasBudget ? `${formatMoney(remainingAmount)}` : '0đ'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        );
      })}

      <AddCategoryTile theme={theme} onPress={onAddCategory} />
    </View>
  );
};

const AddCategoryTile = ({ theme, onPress }: { theme: any; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[styles.addTile, { borderColor: theme.border }]}
  >
    <View style={[styles.addIconCircle, { backgroundColor: theme.iconBoxBg }]}>
      <MaterialIcons name="add" size={26} color="#3c83f6" />
    </View>
    <Text style={[styles.addText, { color: theme.textPrimary }]}>Thêm danh mục mới</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  section: { gap: 12 },

  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },
  iconBox: {
  width: 32,
  height: 32,
  borderRadius: 16,
  marginRight: 10,
  alignItems: 'center',
  justifyContent: 'center',
  },

  title: { flex: 1, fontSize: 18, fontWeight: '700' },

  row: { flexDirection: 'row', marginTop: 12 },
  rowBottom: { marginTop: 10 },
  col: { flex: 1 },
  colRight: { alignItems: 'flex-end' },

  label: { fontSize: 13, fontWeight: '500' },

  bigNumber: { marginTop: 6, fontSize: 20, fontWeight: '800' },
  midNumber: { marginTop: 6, fontSize: 16, fontWeight: '700' },

  progressTrack: {
    height: 8,
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 8 },

  emptyBox: {
    borderRadius: 16,
    paddingVertical: 34,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: { fontSize: 15, fontWeight: '600' },

  addTile: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  addIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontSize: 16, fontWeight: '800' },
});