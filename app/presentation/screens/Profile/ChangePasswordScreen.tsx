import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { useTheme } from '../../../context/ThemeContext';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../../services/firebase/firebaseConfig';

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Đổi mật khẩu</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Security Notice */}
        <View style={[styles.noticeCard, { backgroundColor: isDarkMode ? '#1e3a5f' : '#EFF6FF' }]}>
          <MaterialIcons name="info" size={24} color="#3c83f6" />
          <Text style={[styles.noticeText, { color: theme.textPrimary }]}>
            Để bảo mật tài khoản, vui lòng xác nhận mật khẩu hiện tại trước khi thay đổi.
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Mật khẩu hiện tại</Text>
            <View style={[styles.passwordInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <MaterialIcons 
                  name={showCurrentPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Mật khẩu mới</Text>
            <View style={[styles.passwordInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <MaterialIcons 
                  name={showNewPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
            </Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Xác nhận mật khẩu mới</Text>
            <View style={[styles.passwordInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Password Requirements */}
        <View style={[styles.requirementsCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.requirementsTitle, { color: theme.textPrimary }]}>Yêu cầu mật khẩu:</Text>
          <View style={styles.requirement}>
            <MaterialIcons name="check-circle" size={16} color="#22C55E" />
            <Text style={[styles.requirementText, { color: theme.textSecondary }]}>Ít nhất 8 ký tự</Text>
          </View>
          <View style={styles.requirement}>
            <MaterialIcons name="check-circle" size={16} color="#22C55E" />
            <Text style={[styles.requirementText, { color: theme.textSecondary }]}>Có chữ hoa (A-Z)</Text>
          </View>
          <View style={styles.requirement}>
            <MaterialIcons name="check-circle" size={16} color="#22C55E" />
            <Text style={[styles.requirementText, { color: theme.textSecondary }]}>Có chữ thường (a-z)</Text>
          </View>
          <View style={styles.requirement}>
            <MaterialIcons name="check-circle" size={16} color="#22C55E" />
            <Text style={[styles.requirementText, { color: theme.textSecondary }]}>Có số (0-9)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={[styles.footer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, paddingHorizontal: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  noticeCard: { flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 16, gap: 12 },
  noticeText: { flex: 1, fontSize: 14, lineHeight: 20 },
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  passwordInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, height: 48, paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, fontSize: 16 },
  helperText: { fontSize: 12, marginTop: 4 },
  forgotButton: { alignSelf: 'flex-end' },
  forgotText: { color: '#3c83f6', fontSize: 14, fontWeight: '600' },
  requirementsCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
  requirementsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  requirement: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  requirementText: { fontSize: 14 },
  footer: { padding: 16, borderTopWidth: 1, gap: 12 },
  saveButton: { backgroundColor: '#3c83f6', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: '#3c83f6', fontSize: 16, fontWeight: 'bold' },
});

export default ChangePasswordScreen;