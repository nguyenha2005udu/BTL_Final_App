import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';

const AddGoal: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo mục tiêu mới</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên mục tiêu</Text>
            <TextInput 
              style={styles.input}
              placeholder="Ví dụ: Mua xe máy"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số tiền mục tiêu</Text>
            <View style={styles.currencyInputWrapper}>
              <TextInput 
                style={styles.currencyInput}
                placeholder="Nhập số tiền"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              <Text style={styles.currencySymbol}>₫</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số tiền đã có</Text>
            <View style={styles.currencyInputWrapper}>
              <TextInput 
                style={styles.currencyInput}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                defaultValue="0"
              />
              <Text style={styles.currencySymbol}>₫</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thời hạn</Text>
            <TouchableOpacity style={styles.dateInputWrapper}>
              <Text style={styles.datePlaceholder}>Chọn ngày</Text>
              <MaterialIcons name="calendar-today" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Lưu mục tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  currencyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
  },
  currencyInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 16,
    paddingRight: 40,
    fontSize: 16,
    color: '#111418',
  },
  currencySymbol: {
    position: 'absolute',
    right: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  dateInputWrapper: {
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
  datePlaceholder: {
    color: '#9ca3af',
    fontSize: 16,
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

export default AddGoal;