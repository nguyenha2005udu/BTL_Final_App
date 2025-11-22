import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
// chỉnh lại path cho đúng:
import { sendResetPasswordEmail } from '../../../services/auth.service';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    try {
      setLoading(true);
      await sendResetPasswordEmail(email.trim());

      Alert.alert(
        'Đã gửi email',
        'Chúng tôi đã gửi một email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả Spam/Quảng cáo) và làm theo hướng dẫn.'
      );

      navigation.goBack();
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        'Lỗi',
        error?.message || 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 16 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 8, marginRight: 8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Quên mật khẩu</Text>
        </View>

        {/* Content */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>
            Nhập email bạn đã dùng để đăng ký
          </Text>
          <Text style={{ color: '#6b7280', marginBottom: 8 }}>
            Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
          </Text>

          <Text style={{ marginBottom: 4 }}>Email</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
            placeholder="Nhập email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: '#2563EB',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={handleSendEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Gửi email đặt lại mật khẩu
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
