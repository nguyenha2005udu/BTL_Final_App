// app/presentation/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './Register.styles';
import { registerWithEmail } from '@services/auth.service';

const Register: React.FC = () => {
  const navigation = useNavigation<any>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const result = await registerWithEmail({
        fullName: fullName.trim(),
        email,
        password,
      });

      console.log('Registered user: ', result.user.uid);

      const notes: string[] = [];
      if (!result.profileSaved) {
        notes.push('Hồ sơ người dùng chưa lưu được, vui lòng kiểm tra Firestore Rules.');
      }
      if (!result.verificationEmailSent) {
        notes.push('Email xác thực chưa gửi được, bạn có thể thử đăng nhập lại hoặc gửi lại email xác thực sau.');
      }

      Alert.alert(
        'Đăng ký thành công',
        [
          result.verificationEmailSent
            ? 'Chúng tôi đã gửi email xác nhận. Vui lòng kiểm tra hộp thư và xác thực tài khoản trước khi đăng nhập.'
            : 'Tài khoản đã được tạo.',
          ...notes,
        ].join('\n\n'),
      );

      navigation.goBack(); // quay về màn Login
    } catch (error: any) {
      console.log(error);

      let message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      const code = error?.code;

      if (code === 'auth/email-already-in-use') {
        message = 'Email này đã được sử dụng.';
      } else if (code === 'auth/invalid-email') {
        message = 'Định dạng email không hợp lệ.';
      } else if (code === 'auth/weak-password') {
        message = 'Mật khẩu quá yếu. Vui lòng dùng mật khẩu mạnh hơn.';
      } else if (code === 'auth/network-request-failed') {
        message = 'Không thể kết nối Firebase. Vui lòng kiểm tra mạng và thử lại.';
      } else if (code === 'auth/operation-not-allowed') {
        message = 'Firebase chưa bật phương thức đăng ký Email/Password.';
      } else if (code === 'auth/too-many-requests') {
        message = 'Bạn thao tác quá nhiều lần. Vui lòng thử lại sau ít phút.';
      }

      Alert.alert('Đăng ký thất bại', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng ký</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập thông tin của bạn để đăng ký.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Họ và Tên */}
            <View style={styles.field}>
              <Text style={styles.label}>Họ và Tên</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ và tên của bạn"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

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

            {/* Mật khẩu */}
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
                  onPress={() => setPasswordVisible(v => !v)}
                >
                  <MaterialIcons
                    name={passwordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Mật khẩu phải có ít nhất 8 ký tự
              </Text>
            </View>

            {/* Xác nhận mật khẩu */}
            <View style={styles.field}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() =>
                    setConfirmPasswordVisible(v => !v)
                  }
                >
                  <MaterialIcons
                    name={
                      confirmPasswordVisible
                        ? 'visibility'
                        : 'visibility-off'
                    }
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.termsText}>
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Text style={styles.linkText}>
                Điều khoản & Chính sách bảo mật
              </Text>
              .
            </Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
