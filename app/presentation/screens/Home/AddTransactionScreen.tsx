import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

import { listenCategories } from '../../../services/category.service';
import { createTransaction, TransactionType } from '../../../services/transaction.service';
import type { Category } from '../../../type/types';

const formatDateDDMMYYYY = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  const [type, setType] = useState<TransactionType>('expense');
  const [mountText, setMountText] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  useEffect(() => {
    const unsub = listenCategories(setCategories, (e) => console.log(e));
    return unsub;
  }, []);

  const filteredCategories = useMemo(
    () => categories.filter((c: any) => (c.type ? c.type === type : true)),
    [categories, type],
  );

  const selectedCategory = useMemo(
    () => filteredCategories.find(c => c.id === selectedCategoryId),
    [filteredCategories, selectedCategoryId],
  );

  useEffect(() => {
    if (!filteredCategories.length) {
      setSelectedCategoryId('');
      return;
    }
    if (!selectedCategoryId || !filteredCategories.some(c => c.id === selectedCategoryId)) {
      setSelectedCategoryId(filteredCategories[0].id);
    }
  }, [filteredCategories, selectedCategoryId]);

  const onSave = async () => {
    const amount = Number(mountText);

    if (!title.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên giao dịch.');
      return;
    }

    if (!mountText || Number.isNaN(amount) || amount <= 0) {
      Alert.alert('Số tiền không hợp lệ', 'Vui lòng nhập số tiền > 0.');
      return;
    }

    try {
      await createTransaction({
        title: title.trim(),
        amount,
        categoryId: selectedCategoryId,
        icon: selectedCategory?.icon || 'category',
        type,
        note: note ?? '',
        date,
      });

      Alert.alert('Thành công', 'Đã thêm giao dịch.');
      navigation.goBack();
    } catch (e: any) {
      console.log('createTransaction error', e);
      Alert.alert('Lỗi', e?.message ?? 'Không thể thêm giao dịch.');
    }
  };

  const hasCategoryForType = filteredCategories.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      {/* HEADER */}
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Thêm giao dịch</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TOGGLE CHI TIÊU / THU NHẬP */}
        <View style={[
          styles.toggleContainer,
          { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }
        ]}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              type === 'expense' && [
                styles.toggleActive,
                { 
                  backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
                  shadowColor: isDarkMode ? 'transparent' : '#000',
                }
              ],
            ]}
            onPress={() => setType('expense')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="trending-down" 
              size={20} 
              color={type === 'expense' ? '#EF4444' : theme.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              styles.toggleText,
              { color: type === 'expense' ? '#EF4444' : theme.textSecondary }
            ]}>
              Chi tiêu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              type === 'income' && [
                styles.toggleActive,
                { 
                  backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
                  shadowColor: isDarkMode ? 'transparent' : '#000',
                }
              ],
            ]}
            onPress={() => setType('income')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="trending-up" 
              size={20} 
              color={type === 'income' ? '#22C55E' : theme.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              styles.toggleText,
              { color: type === 'income' ? '#22C55E' : theme.textSecondary }
            ]}>
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* TÊN GIAO DỊCH */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Tên giao dịch <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[
              styles.inputWrapper,
              { 
                backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                borderColor: isDarkMode ? theme.border : '#E5E7EB'
              }
            ]}>
              <MaterialIcons 
                name="edit" 
                size={20} 
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="VD: Lương tháng 12, Mua sắm..."
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          {/* SỐ TIỀN */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Số tiền <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[
              styles.inputWrapper,
              { 
                backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                borderColor: isDarkMode ? theme.border : '#E5E7EB'
              }
            ]}>
              <MaterialIcons 
                name="attach-money" 
                size={20} 
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                value={mountText}
                onChangeText={setMountText}
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.currency, { color: theme.textSecondary }]}>₫</Text>
            </View>
          </View>

          {/* DANH MỤC */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Danh mục <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <TouchableOpacity
              disabled={!hasCategoryForType}
              style={[
                styles.selectInput,
                {
                  backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                  borderColor: isDarkMode ? theme.border : '#E5E7EB',
                  opacity: hasCategoryForType ? 1 : 0.6,
                },
              ]}
              onPress={() => hasCategoryForType && setCategoryModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.selectContent}>
                <View style={[
                  styles.categoryIconBox,
                  { backgroundColor: type === 'income' ? '#DCFCE7' : '#FEE2E2' }
                ]}>
                  <MaterialIcons
                    name={(selectedCategory?.icon as any) || 'category'}
                    size={20}
                    color={type === 'income' ? '#22C55E' : '#EF4444'}
                  />
                </View>
                <Text style={[styles.selectText, { color: theme.textPrimary }]}>
                  {selectedCategory?.name ||
                    (hasCategoryForType
                      ? 'Chọn danh mục'
                      : type === 'expense'
                      ? 'Chưa có danh mục chi tiêu'
                      : 'Chưa có danh mục thu nhập')}
                </Text>
              </View>
              <MaterialIcons name="expand-more" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* NGÀY */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Ngày</Text>
            <TouchableOpacity
              style={[
                styles.selectInput,
                { 
                  backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                  borderColor: isDarkMode ? theme.border : '#E5E7EB'
                },
              ]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.selectContent}>
                <View style={[styles.dateIconBox, { backgroundColor: '#DBEAFE' }]}>
                  <MaterialIcons name="calendar-today" size={18} color="#3B82F6" />
                </View>
                <Text style={[styles.selectText, { color: theme.textPrimary }]}>
                  {formatDateDDMMYYYY(date)}
                </Text>
              </View>
              <MaterialIcons name="expand-more" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* GHI CHÚ */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Ghi chú</Text>
            <View style={[
              styles.textAreaWrapper,
              { 
                backgroundColor: isDarkMode ? theme.cardBackground : '#F9FAFB',
                borderColor: isDarkMode ? theme.border : '#E5E7EB'
              }
            ]}>
              <MaterialIcons 
                name="notes" 
                size={20} 
                color={theme.textSecondary}
                style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 12 }]}
              />
              <TextInput
                value={note}
                onChangeText={setNote}
                style={[
                  styles.input,
                  styles.textArea,
                  { color: theme.textPrimary }
                ]}
                placeholder="Thêm ghi chú cho giao dịch này..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[
        styles.footer,
        { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
          borderTopColor: isDarkMode ? theme.border : '#F1F5F9'
        },
      ]}>
        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: type === 'income' ? '#22C55E' : '#EF4444'
          }]} 
          onPress={onSave}
          activeOpacity={0.8}
        >
          <MaterialIcons name="check" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Lưu giao dịch</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.cancelButton, { 
            backgroundColor: isDarkMode ? '#374151' : '#F3F4F6'
          }]} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Hủy</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL CHỌN DANH MỤC */}
      <Modal
        visible={categoryModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalOpen(false)}
      >
        <View style={modalStyles.backdrop}>
          <View style={[
            modalStyles.sheet,
            { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
              borderColor: isDarkMode ? theme.border : '#F1F5F9'
            },
          ]}>
            {/* HEADER */}
            <View style={modalStyles.header}>
              <Text style={[modalStyles.title, { color: theme.textPrimary }]}>
                Chọn danh mục {type === 'expense' ? 'chi tiêu' : 'thu nhập'}
              </Text>
              <TouchableOpacity 
                onPress={() => setCategoryModalOpen(false)}
                style={modalStyles.closeIcon}
              >
                <MaterialIcons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* LIST */}
            <ScrollView 
              style={modalStyles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {filteredCategories.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    modalStyles.item,
                    { 
                      borderBottomColor: isDarkMode ? theme.border : '#F1F5F9',
                      backgroundColor: c.id === selectedCategoryId 
                        ? (isDarkMode ? '#374151' : '#F9FAFB')
                        : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    setSelectedCategoryId(c.id);
                    setCategoryModalOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={modalStyles.itemLeft}>
                    <View style={[
                      modalStyles.categoryIcon,
                      { backgroundColor: type === 'income' ? '#DCFCE7' : '#FEE2E2' }
                    ]}>
                      <MaterialIcons
                        name={(c.icon as any) || 'category'}
                        size={20}
                        color={type === 'income' ? '#22C55E' : '#EF4444'}
                      />
                    </View>
                    <Text style={[modalStyles.itemText, { color: theme.textPrimary }]}>
                      {c.name}
                    </Text>
                  </View>

                  {c.id === selectedCategoryId && (
                    <MaterialIcons name="check-circle" size={22} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ================= STYLES ================= */

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
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
    height: 52,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  currency: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  textAreaWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 110,
  },
  textArea: {
    paddingTop: 0,
    minHeight: 86,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectText: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  closeIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  scrollView: {
    maxHeight: 420,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AddTransactionScreen;