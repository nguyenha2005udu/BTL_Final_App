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
            </V
