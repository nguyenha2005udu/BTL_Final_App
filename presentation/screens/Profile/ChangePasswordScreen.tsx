import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@components/icon';
import { useTheme } from '@context/ThemeContext';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@services/firebase/firebaseConfig';

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate password
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    }
    if (!/[a-z]/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ thường';
    }
    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 số';
    }
    return null;
  };

  // Handle change password
  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Lỗi', passwordError);
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Re-authenticate user với mật khẩu hiện tại
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Cập nhật mật khẩu mới
      await updatePassword(user, newPassword);

      Alert.alert(
        'Thành công',
        'Đổi mật khẩu thành công!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Change password error:', error);
      
      let errorMessage = 'Không thể đổi mật khẩu';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mật khẩu hiện tại không đúng';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Mật khẩu mới quá yếu';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password - send reset email
  const handleForgotPassword = () => {
    Alert.alert(
      'Quên mật khẩu?',
      'Chúng tôi sẽ gửi email đặt lại mật khẩu cho bạn.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Gửi email',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user || !user.email) {
                Alert.alert('Lỗi', 'Không tìm thấy email');
                return;
              }

              await sendPasswordResetEmail(auth, user.email);
              Alert.alert(
                'Đã gửi email',
                `Vui lòng kiểm tra email ${user.email} để đặt lại mật khẩu.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error: any) {
              console.error('Send reset email error:', error);
              Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu');
            }
          }
        }
      ]
    );
  };

  // Check password strength
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    return checks;
  };

  const passwordChecks = getPasswordStrength(newPassword);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Đổi mật khẩu</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Notice */}
        <View style={[styles.noticeCard, { 
          backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF'
        }]}>
          <View style={[styles.noticeIcon, { backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE' }]}>
            <MaterialIcons name="security" size={24} color="#3B82F6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>
              Bảo mật tài khoản
            </Text>
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
              Xác nhận mật khẩu hiện tại trước khi thay đổi để đảm bảo an toàn.
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Mật khẩu hiện tại</Text>
            <View style={[styles.passwordInput, { 
              backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
              borderColor: isDarkMode ? theme.border : '#E2E8F0'
            }]}>
              <MaterialIcons name="lock-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                <MaterialIcons 
                  name={showCurrentPassword ? "visibility" : "visibility-off"} 
                  size={22} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Mật khẩu mới</Text>
            <View style={[styles.passwordInput, { 
              backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
              borderColor: isDarkMode ? theme.border : '#E2E8F0'
            }]}>
              <MaterialIcons name="vpn-key" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                <MaterialIcons 
                  name={showNewPassword ? "visibility" : "visibility-off"} 
                  size={22} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Xác nhận mật khẩu mới</Text>
            <View style={[styles.passwordInput, { 
              backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
              borderColor: isDarkMode ? theme.border : '#E2E8F0'
            }]}>
              <MaterialIcons name="check-circle-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={22} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity 
            onPress={handleForgotPassword} 
            style={styles.forgotButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="help-outline" size={16} color="#3B82F6" />
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Password Requirements */}
        <View style={[styles.requirementsCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <Text style={[styles.requirementsTitle, { color: theme.textPrimary }]}>
            Yêu cầu mật khẩu:
          </Text>
          
          <View style={styles.requirement}>
            <MaterialIcons 
              name={passwordChecks.length ? "check-circle" : "radio-button-unchecked"} 
              size={20} 
              color={passwordChecks.length ? "#22C55E" : theme.textSecondary} 
            />
            <Text style={[styles.requirementText, { 
              color: passwordChecks.length ? "#22C55E" : theme.textSecondary 
            }]}>
              Ít nhất 8 ký tự
            </Text>
          </View>

          <View style={styles.requirement}>
            <MaterialIcons 
              name={passwordChecks.uppercase ? "check-circle" : "radio-button-unchecked"} 
              size={20} 
              color={passwordChecks.uppercase ? "#22C55E" : theme.textSecondary} 
            />
            <Text style={[styles.requirementText, { 
              color: passwordChecks.uppercase ? "#22C55E" : theme.textSecondary 
            }]}>
              Có chữ hoa (A-Z)
            </Text>
          </View>

          <View style={styles.requirement}>
            <MaterialIcons 
              name={passwordChecks.lowercase ? "check-circle" : "radio-button-unchecked"} 
              size={20} 
              color={passwordChecks.lowercase ? "#22C55E" : theme.textSecondary} 
            />
            <Text style={[styles.requirementText, { 
              color: passwordChecks.lowercase ? "#22C55E" : theme.textSecondary 
            }]}>
              Có chữ thường (a-z)
            </Text>
          </View>

          <View style={styles.requirement}>
            <MaterialIcons 
              name={passwordChecks.number ? "check-circle" : "radio-button-unchecked"} 
              size={20} 
              color={passwordChecks.number ? "#22C55E" : theme.textSecondary} 
            />
            <Text style={[styles.requirementText, { 
              color: passwordChecks.number ? "#22C55E" : theme.textSecondary 
            }]}>
              Có số (0-9)
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={[styles.footer, { 
        backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
        borderTopColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading && (
            <MaterialIcons name="hourglass-empty" size={20} color="white" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.saveButtonText}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: isDarkMode ? theme.border : '#E2E8F0' }]} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Hủy</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    color: '#0F172A',
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
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    gap: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  noticeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    paddingLeft: 48,
    paddingRight: 12,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  forgotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    marginTop: 4,
  },
  forgotText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  requirementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cancelButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;