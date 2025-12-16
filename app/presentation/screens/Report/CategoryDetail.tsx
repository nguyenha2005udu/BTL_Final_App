// CategoryDetail.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, ICONS } from '../../../../constants/constants';
import { useCategories } from '../../../../hooks/useCategories';
import { useTheme } from '../../../context/ThemeContext';

const CategoryDetail: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { category } = route.params as { category: any };
  const categoryType: 'income' | 'expense' =
  category?.type ?? 'expense';

  
  const { theme, isDarkMode } = useTheme();
  const { updateCategory, deleteCategory } = useCategories();

  const [step, setStep] = useState<'form' | 'icon' | 'color'>('form');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
      setBudget(category.budget ? category.budget.toString() : '');
    }
  }, [category]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      setNameError('Vui lòng nhập tên danh mục');
      return;
    }
    setNameError(null);

    const icon = selectedIcon ?? 'category';
    const color = selectedColor ?? theme.iconBoxBg;

    const budgetNumber = budget.trim().length > 0 
      ? Number(budget.replace(/[^0-9]/g, '')) 
      : undefined;

    try {
      await updateCategory(category.id, {
        name: name.trim(),
        icon,
        color,
        budget: budgetNumber,
      });
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert('Lỗi', 'Không thể cập nhật danh mục. Vui lòng thử lại.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Xóa danh mục',
      `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
              navigation.goBack();
            } catch (e) {
              console.log(e);
              Alert.alert('Lỗi', 'Không thể xóa danh mục. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const renderIconSelection = () => (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity onPress={() => setStep('form')} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Chọn biểu tượng
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
          <MaterialIcons name="search" size={24} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Tìm kiếm biểu tượng"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.gridContent}>
        {ICONS.map(group => (
          <View key={group.key} style={{ marginBottom: 16 }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {group.label}
            </Text>
            <View style={styles.grid}>
              {group.icons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={[
                    styles.gridItem,
                    { backgroundColor: theme.cardBackground },
                    selectedIcon === icon && styles.gridItemActive,
                  ]}
                >
                  <MaterialIcons
                    name={icon as any}
                    size={32}
                    color={
                      selectedIcon === icon ? '#3c83f6' : theme.textSecondary
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>


      <View style={[styles.bottomAction, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity onPress={() => setStep('form')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderColorSelection = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity onPress={() => setStep('form')} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Chọn màu sắc
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.colorGrid}>
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorItem,
                { backgroundColor: color },
                selectedColor === color && styles.colorItemActive,
              ]}
            />
          ))}
        </View>
        <View style={{ height: 160 }} />
      </ScrollView>

      <View style={[styles.bottomAction, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity onPress={() => setStep('form')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (step === 'icon') return renderIconSelection();
  if (step === 'color') return renderColorSelection();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Sửa danh mục
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Icon danh mục</Text>
            <TouchableOpacity
              onPress={() => setStep('icon')}
              style={[
                styles.selectInput,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={[styles.selectIconBox, { backgroundColor: theme.iconBoxBg }]}>
                <MaterialIcons
                  name={(selectedIcon as any) || 'category'}
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
              <Text style={[styles.selectText, { color: theme.textSecondary }]}>
                Chọn biểu tượng
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Tên danh mục</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder="Ví dụ: Cà phê, Quần áo"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>
          
          <View style={styles.typeRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Loại danh mục
            </Text>
            <View
              style={[
                styles.typeBadge,
                categoryType === 'expense'
                  ? styles.expenseBadge
                  : styles.incomeBadge,
              ]}
            >
              <Text style={styles.typeBadgeText}>
                {categoryType === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
              </Text>
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Màu sắc danh mục</Text>
            <TouchableOpacity
              onPress={() => setStep('color')}
              style={[
                styles.selectInput,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.colorPreview,
                  {
                    backgroundColor: selectedColor || theme.iconBoxBg,
                    borderColor: theme.border,
                  },
                ]}
              />
              <Text style={[styles.selectText, { color: theme.textSecondary }]}>
                Chọn màu sắc
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {categoryType === 'expense' && (
            <View>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Ngân sách danh mục</Text>
              <View style={styles.moneyInputWrapper}>
                <TextInput
                  style={[
                    styles.moneyInput,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    },
                  ]}
                  placeholder="Nhập ngân sách (tùy chọn)"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
                <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>₫</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate}>
            <Text style={styles.primaryButtonText}>Cập nhật danh mục</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Xóa danh mục</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.textButton}>
            <Text style={styles.textButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111418' },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16 },
  searchContainer: { padding: 16, paddingBottom: 0 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  gridContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111418',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  gridItemActive: {
    backgroundColor: 'rgba(60, 131, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3c83f6',
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  colorItem: { width: 56, height: 56, borderRadius: 28 },
  colorItemActive: {
    borderWidth: 4,
    borderColor: 'rgba(60, 131, 246, 0.3)',
  },
  addColorItem: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(245, 247, 248, 0.95)',
  },
  form: { gap: 24 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  selectIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectText: { flex: 1, color: '#6b7280' },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111418',
  },
  
  typeRow: {
  marginTop: 12,
  marginBottom: 4,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  expenseBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  incomeBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },


  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
  },
  moneyInputWrapper: { justifyContent: 'center' },
  moneyInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 16,
    color: '#111418',
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    color: '#6b7280',
    fontSize: 16,
  },
  formActions: { marginTop: 32, gap: 12 },
  primaryButton: {
    backgroundColor: '#3c83f6',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    color: '#3c83f6',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: { marginTop: 4, fontSize: 12, color: '#ef4444' },
});

export default CategoryDetail;