import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ReportCategoryListItem = {
  id: string;
  name: string;
  color: string;
  icon: string;
  value: number;
  budget: number;
};

type Props = {
  items: ReportCategoryListItem[];
  mode: 'expense' | 'income';
  theme: any;
  onPressItem: (id: string) => void;
  onAddCategory: () => void;
};

const formatMoney = (n: number) =>
  `${Math.max(0, Math.round(n)).toLocaleString('vi-VN')}₫`;

const getIconBg = (color: string, fallback: string) => {
  if (typeof color !== 'string' || color.length === 0) return fallback;
  if (!color.startsWith('#')) return fallback;

  // #RRGGBBAA
  if (color.length === 9) return color;

  // #RGB -> #RRGGBB22
  if (color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}22`;
  }

  // #RRGGBB -> #RRGGBB22
  if (color.length === 7) return `${color}22`;

  return fallback;
};

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

        // ✅ Cảnh báo vượt ngân sách chỉ áp dụng cho CHI TIÊU
        const isOverBudget = mode === 'expense' && hasBudget && usedPercent > 100;

        return (
          <View
            key={item.id}
            style={[
              styles.card,
              { backgroundColor: theme.cardBackground },
              isOverBudget && styles.cardOverBudget,
            ]}
          >
            {/* Header: icon + title + over badge + chevron */}
            <TouchableOpacity
              style={styles.headerRow}
              onPress={() => onPressItem(item.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconBox, { backgroundColor: getIconBg(item.color, theme.divider) }]}>
                <MaterialIcons
                  name={(item.icon as any) || 'category'}
                  size={20}
                  color={item.color}
                />
              </View>

              <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>

              {isOverBudget && (
                <View style={styles.overBadge}>
                  <MaterialIcons name="warning" size={14} color="#EF4444" />
                  <Text style={styles.overBadgeText}>Vượt 100%</Text>
                </View>
              )}

              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Row 1 */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {mode === 'expense' ? 'Đã chi' : 'Đã thu'}
                </Text>
                <Text style={[styles.bigNumber, { color: mainColor }]}>{formatMoney(spent)}</Text>
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
                    backgroundColor: isOverBudget ? '#EF4444' : mainColor,
                    opacity: isOverBudget ? 0.6 : 0.35,
                  },
                ]}
              />
            </View>

            {/* Row 2 */}
            <View style={[styles.row, styles.rowBottom]}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Đã dùng</Text>
                <Text style={[styles.midNumber, { color: isOverBudget ? '#EF4444' : theme.textPrimary }]}>
                  {hasBudget ? `${Math.max(0, usedPercent)}%` : '0%'}
                </Text>
              </View>

              <View style={[styles.col, styles.colRight]}>
                <Text style={[styles.label, { color: isOverBudget ? '#EF4444' : theme.textSecondary }]}>
                  {overspent > 0 ? 'Vượt' : 'Còn lại'}
                </Text>

                {overspent > 0 ? (
                  <>
                    <Text style={[styles.midNumber, { color: '#EF4444' }]}>
                      {formatMoney(overspent)}
                    </Text>
                    {isOverBudget && (
                      <Text style={[styles.overHint, { color: theme.textSecondary }]}>
                        Bạn đã vượt ngân sách danh mục này
                      </Text>
                    )}
                  </>
                ) : (
                  <Text style={[styles.midNumber, { color: '#22C55E' }]}>
                    {hasBudget ? formatMoney(remainingAmount) : '0₫'}
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
  cardOverBudget: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: 6,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },

  overBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    marginRight: 8,
  },
  overBadgeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },

  row: { flexDirection: 'row', marginTop: 12 },
  rowBottom: { marginTop: 10 },
  col: { flex: 1 },
  colRight: { alignItems: 'flex-end' },

  label: { fontSize: 13, fontWeight: '500' },

  bigNumber: { marginTop: 6, fontSize: 20, fontWeight: '800' },
  midNumber: { marginTop: 6, fontSize: 16, fontWeight: '700' },

  overHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },

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
