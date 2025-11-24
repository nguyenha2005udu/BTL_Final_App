// LoginScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './LoginScreen.styles';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = () => {
    // TODO: Validate / gọi API đăng nhập
    navigation.navigate('App'); 
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
          {/* Dummy view để giữ tiêu đề ở giữa */}
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
              onPress={() => {
                // navigation.navigate('ForgotPassword');
              }}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Đăng nhập */}
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Đăng nhập</Text>
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
