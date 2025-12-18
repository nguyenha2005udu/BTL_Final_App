import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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

const AddCategory: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();
  const { addCategory } = useCategories();

  const [step, setStep] = useState<'form' | 'icon' | 'color'>('form');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense');
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Vui lòng nhập tên danh mục');
      return;
    }
    setNameError(null);

    const icon = selectedIcon ?? 'category';
    const color = selectedColor ?? theme.iconBoxBg;

    const budgetNumber =
      budget.trim().length > 0
        ? Number(budget.replace(/[^0-9]/g, ''))
        : undefined;

    try {
      await addCategory({
        name: name.trim(),
        icon,
        color,
        budget: budgetNumber,
        type: categoryType,
      });
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert('Lỗi', 'Không thể lưu danh mục. Vui lòng thử lại.');
    }
  };

  const renderIconSelection = () => (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF' }]}>
        <TouchableOpacity
          onPress={() => setStep('form')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Chọn biểu tượng
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {ICONS.map(group => (
          <View key={group.key} style={{ marginBottom: 24 }}>
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
                    { backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB' },
                    selectedIcon === icon && styles.gridItemActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={icon as any}
                    size={32}
                    color={selectedIcon === icon ? '#3c83f6' : theme.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.bottomAction, { backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF' }]}>
        <TouchableOpacity
          onPress={() => setStep('form')}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderColorSelection = () => (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF' }]}>
        <TouchableOpacity
          onPress={() => setStep('form')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Chọn màu sắc
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              activeOpacity={0.7}
            />
          ))}
        </View>
        <View style={{ height: 160 }} />
      </ScrollView>

      <View style={[styles.bottomAction, { backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF' }]}>
        <TouchableOpacity
          onPress={() => setStep('form')}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Xác nhận</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setStep('form')}
          style={styles.textButton}
          activeOpacity={0.7}
        >
          <Text style={styles.textButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (step === 'icon') return renderIconSelection();
  if (step === 'color') return renderColorSelection();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF' }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Thêm danh mục
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Icon danh mục
            </Text>
            <TouchableOpacity
              onPress={() => setStep('icon')}
              style={[
                styles.selectInput,
                {
                  backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                  borderColor: isDarkMode ? theme.border : '#E5E7EB',
                },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.selectIconBox,
                  { backgroundColor: isDarkMode ? theme.iconBoxBg : '#EFF6FF' },
                ]}
              >
                <MaterialIcons
                  name={(selectedIcon as any) || 'category'}
                  size={20}
                  color={selectedIcon ? '#3c83f6' : theme.textSecondary}
                />
              </View>
              <Text style={[styles.selectText, { color: theme.textSecondary }]}>
                Chọn biểu tượng
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Tên danh mục
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                  borderColor: isDarkMode ? theme.border : '#E5E7EB',
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

          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Loại danh mục
            </Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
                    borderColor: isDarkMode ? theme.border : '#E5E7EB',
                  },
                  categoryType === 'expense' && styles.typeChipActive,
                ]}
                onPress={() => setCategoryType('expense')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    { color: theme.textSecondary },
                    categoryType === 'expense' && styles.typeChipTextActive,
                  ]}
                >
                  Chi tiêu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
                    borderColor: isDarkMode ? theme.border : '#E5E7EB',
                  },
                  categoryType === 'income' && styles.typeChipActive,
                ]}
                onPress={() => setCategoryType('income')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    { color: theme.textSecondary },
                    categoryType === 'income' && styles.typeChipTextActive,
                  ]}
                >
                  Thu nhập
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Màu sắc danh mục
            </Text>
            <TouchableOpacity
              onPress={() => setStep('color')}
              style={[
                styles.selectInput,
                {
                  backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                  borderColor: isDarkMode ? theme.border : '#E5E7EB',
                },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorPreview,
                  {
                    backgroundColor: selectedColor || theme.iconBoxBg,
                    borderColor: isDarkMode ? theme.border : '#E5E7EB',
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
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Ngân sách danh mục
              </Text>
              <View style={styles.moneyInputWrapper}>
                <TextInput
                  style={[
                    styles.moneyInput,
                    {
                      backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                      borderColor: isDarkMode ? theme.border : '#E5E7EB',
                      color: theme.textPrimary,
                    },
                  ]}
                  placeholder="Nhập ngân sách (tùy chọn)"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
                <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>
                  ₫
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Lưu danh mục</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.textButton}
            activeOpacity={0.7}
          >
            <Text style={styles.textButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { 
    fontSize: 19, 
    fontWeight: '700', 
    color: '#111418',
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  content: { 
    padding: 20,
    paddingBottom: 40,
  },
  gridContent: { 
    padding: 20, 
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111418',
    letterSpacing: -0.3,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
  },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gridItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3c83f6',
    shadowColor: '#3c83f6',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  colorGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
  },
  colorItem: { 
    width: 64, 
    height: 64, 
    borderRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  colorItemActive: {
    borderWidth: 4,
    borderColor: '#3c83f6',
    shadowColor: '#3c83f6',
    shadowOpacity: 0.3,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  form: { 
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  selectIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectText: { 
    flex: 1, 
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111418',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeChip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  typeChipActive: {
    backgroundColor: '#3c83f6',
    borderColor: '#3c83f6',
    shadowColor: '#3c83f6',
    shadowOpacity: 0.2,
  },
  typeChipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6b7280',
  },
  typeChipTextActive: {
    color: '#ffffff',
  },
  colorPreview: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  moneyInputWrapper: { 
    justifyContent: 'center',
  },
  moneyInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 56,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 15,
    color: '#111418',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  formActions: { 
    marginTop: 32, 
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3c83f6',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3c83f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    color: '#3c83f6',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: { 
    marginTop: 6, 
    fontSize: 13, 
    color: '#ef4444',
    fontWeight: '500',
  },
});

export default AddCategory;