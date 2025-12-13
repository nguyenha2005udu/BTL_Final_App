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

const formatDateYYYYMMDD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  // thu / chi
  const [type, setType] = useState<TransactionType>('expense');

  // form
  const [mountText, setMountText] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  // categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  useEffect(() => {
    const unsub = listenCategories(setCategories, (e) => console.log(e));
    return unsub;
  }, []);

  // chỉ lấy những category đúng loại (income / expense)
  const filteredCategories = useMemo(
    () =>
      categories.filter((c: any) =>
        c.type ? c.type === type : true, // nếu category chưa có field type thì cho hiện hết
      ),
    [categories, type],
  );

  const selectedCategory = useMemo(
    () => filteredCategories.find(c => c.id === selectedCategoryId),
    [filteredCategories, selectedCategoryId],
  );

  // auto chọn category đầu tiên của loại hiện tại
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
    const mount = Number(mountText);

    if (!selectedCategoryId) {
      Alert.alert('Thiếu danh mục', `Vui lòng tạo danh mục ${type === 'expense' ? 'chi tiêu' : 'thu nhập'} trước.`);
      return;
    }
    if (!mountText || Number.isNaN(mount) || mount <= 0) {
      Alert.alert('Số tiền không hợp lệ', 'Vui lòng nhập số tiền > 0.');
      return;
    }

    try {
      await createTransaction({
        categoryId: selectedCategoryId,
        type,
        mount,
        note,
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.headerBackground, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Thêm giao dịch</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Chọn loại giao dịch */}
        <View
          style={[
            styles.toggleContainer,
            { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.toggleButton,
              type === 'expense' && [styles.toggleActive, { backgroundColor: theme.cardBackground }],
            ]}
            onPress={() => setType('expense')}
          >
            <Text
              style={[
                styles.toggleText,
                { color: theme.textSecondary },
                type === 'expense' && styles.toggleTextActive,
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              type === 'income' && [styles.toggleActive, { backgroundColor: theme.cardBackground }],
            ]}
            onPress={() => setType('income')}
          >
            <Text
              style={[
                styles.toggleText,
                { color: theme.textSecondary },
                type === 'income' && styles.toggleTextActive,
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Số tiền */}
          <View className="inputGroup">
            <Text style={[styles.label, { color: theme.textSecondary }]}>Số tiền</Text>
            <TextInput
              value={mountText}
              onChangeText={setMountText}
              style={[
                styles.input,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder="Nhập số tiền"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Danh mục */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Danh mục</Text>
            <TouchableOpacity
              disabled={!hasCategoryForType}
              style={[
                styles.selectInput,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  opacity: hasCategoryForType ? 1 : 0.6,
                },
              ]}
              onPress={() => hasCategoryForType && setCategoryModalOpen(true)}
            >
              <View style={styles.selectContent}>
                <MaterialIcons
                  name={(selectedCategory?.icon as any) || 'category'}
                  size={20}
                  color={theme.textSecondary}
                  style={styles.inputIcon}
                />
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

          {/* Ngày */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Ngày</Text>
            <TouchableOpacity
              style={[
                styles.selectInput,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.selectContent}>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={theme.textSecondary}
                  style={styles.inputIcon}
                />
                <Text style={[styles.selectText, { color: theme.textPrimary }]}>
                  {formatDateYYYYMMDD(date)}
                </Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  // Android: user bấm cancel thì selectedDate = undefined
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


          {/* Ghi chú */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Ghi chú</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder="Nhập ghi chú (không bắt buộc)"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.cardBackground, borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      {/* Modal chọn danh mục */}
      <Modal
        visible={categoryModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalOpen(false)}
      >
        <View style={modalStyles.backdrop}>
          <View
            style={[
              modalStyles.sheet,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[modalStyles.title, { color: theme.textPrimary }]}>
              Chọn danh mục {type === 'expense' ? 'chi tiêu' : 'thu nhập'}
            </Text>

            <ScrollView style={{ maxHeight: 320 }}>
              {filteredCategories.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[modalStyles.item, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    setSelectedCategoryId(c.id);
                    setCategoryModalOpen(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                      name={(c.icon as any) || 'category'}
                      size={20}
                      color={theme.textSecondary}
                    />
                    <Text style={[modalStyles.itemText, { color: theme.textPrimary }]}>
                      {c.name}
                    </Text>
                  </View>

                  {c.id === selectedCategoryId ? (
                    <MaterialIcons name="check" size={20} color={theme.textSecondary} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => setCategoryModalOpen(false)} style={modalStyles.closeBtn}>
              <Text style={[modalStyles.closeText, { color: theme.textSecondary }]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

// styles cũ của bạn giữ nguyên
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
    height: 48,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#3c83f6',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111418',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  selectText: {
    fontSize: 16,
    color: '#111418',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#3c83f6',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#3c83f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;
