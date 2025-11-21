import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';

const UpdateProfile: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật thông tin</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_vMSFQARLvGWesaN0bPwdT0TwBkCjQuK-p1dyFrGdqF-NhAqX3D22UFhPgycZkrUA24cKIcSZEPLOfhmUcNZTvYIXtJBvgXlaRUnPVCaQ5zWzrC0n45kOlTptHz4fEKjcJrTwoasD3u6BnAo6DO1bJ2oe7sNZMz4X8J4ZExMW6HBrFk1JAZloRwzDfjdw4WOSE8HcBg82M53Zk1lZ9igZ6sqHdz0lO3Cvw1h6_YE38kL45oHN1DtJsD26XLF9ECZDyI3c-2ms-qO0" }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon}>
              <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput 
              style={styles.input}
              defaultValue="Nguyễn Văn A"
              placeholder="Nhập họ và tên"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]}
              defaultValue="nguyenvana@email.com"
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput 
              style={styles.input}
              defaultValue="0901234567"
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày sinh</Text>
            <View style={styles.dateInputWrapper}>
              <TextInput 
                style={styles.dateInput}
                defaultValue="15/08/1998"
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9ca3af"
              />
              <MaterialIcons name="calendar-today" size={20} color="#9ca3af" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3c83f6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
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
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
  },
  dateInput: {
    flex: 1,
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

export default UpdateProfile;