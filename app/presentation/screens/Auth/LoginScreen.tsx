// app/presentation/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './LoginScreen.styles';

// 👉 đường dẫn này tuỳ theo cấu trúc của bạn
import { loginWithEmail } from '../../../services/auth.service';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // ✔ KẾT HỢP LOGIC ĐĂNG NHẬP CHUẨN TỪ MAIN
  // ==========================================
  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const user = await loginWithEmail(email.trim(), password);
      console.log('Logged in user: ', user.uid);

      if (!user.emailVerified) {
        Alert.alert(
          'Chưa xác thực email',
          'Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư (kể cả Spam/Quảng cáo) và bấm vào link xác nhận trước khi đăng nhập.'
        );
        return;
      }

      navigation.navigate('App');
    } catch (error: any) {
      console.log(error);

      let message = 'Đăng nhập thất bại. Vui lòng thử lại.';
      const code = error?.code;

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        message = 'Email hoặc mật khẩu không chính xác.';
      } else if (code === 'auth/invalid-email') {
        message = 'Định dạng email không hợp lệ.';
      } else if (code === 'auth/too-many-requests') {
        message =
          'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ít phút hoặc đặt lại mật khẩu.';
      }

      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng nhập</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main content */}
        <View style={styles.main}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Đăng nhập bằng Email</Text>
            <Text style={styles.subtitle}>
              Nhập email và mật khẩu để tiếp tục.
            </Text>
          </View>

          {/* Form */}
          <View>
            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa chỉ email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setPasswordVisible(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={passwordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quên mật khẩu */}
            <TouchableOpacity
              style={styles.forgotButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Đăng nhập */}
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Chưa có tài khoản?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Đăng ký
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
