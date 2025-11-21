import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';

const Register: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tạo tài khoản mới</Text>
        <Text style={styles.subtitle}>Vui lòng nhập thông tin của bạn để đăng ký.</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput 
              style={styles.input}
              placeholder="Nhập họ và tên của bạn"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Nhập địa chỉ email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
              />
              <MaterialIcons name="mail" size={20} color="#9ca3af" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
              <TouchableOpacity>
                <MaterialIcons name="visibility-off" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Mật khẩu phải có ít nhất 8 ký tự</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận Mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.termsText}>
          Bằng cách đăng ký, bạn đồng ý với <Text style={styles.linkText}>Điều khoản & Chính sách bảo mật</Text>.
        </Text>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('App')}>
          <Text style={styles.submitButtonText}>Đăng ký</Text>
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
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
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
    color: '#1f2937',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    padding: 24,
    gap: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  linkText: {
    fontWeight: '600',
    color: '#3c83f6',
  },
  submitButton: {
    backgroundColor: '#3c83f6',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;