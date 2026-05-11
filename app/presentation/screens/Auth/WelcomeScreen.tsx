import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { loginWithGoogle } from '../../../services/auth.service';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  App: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLoginWithEmail = () => {
    navigation.navigate('Login');
  };

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle();
    navigation.replace('App');
  };

  const handleLoginWithFacebook = () => {
    console.log('Facebook login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <MaterialIcons name="account-balance-wallet" size={40} color="#3c83f6" />
              </View>
            </View>

            <Text style={styles.title}>Chi Tiêu Của Tôi</Text>
            <Text style={styles.subtitle}>
              Theo dõi chi tiêu và quản lý tài chính thông minh
            </Text>
          </View>

          {/* MAIN */}
          <View style={styles.main}>
            {/* Feature Card */}
            <View style={styles.featureCard}>
              <MaterialIcons name="trending-up" size={48} color="#3c83f6" style={{ marginBottom: 16 }} />
              <Text style={styles.featureTitle}>
                Quản lý tài chính cá nhân hiệu quả
              </Text>
              <Text style={styles.featureText}>
                Ghi lại mọi giao dịch, đặt ra các mục tiêu tiết kiệm thông minh, và xem các báo cáo chi tiết để kiểm soát tài chính của bạn một cách dễ dàng.
              </Text>
            </View>

            {/* Button Group */}
            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.button, styles.buttonGoogle]}
                onPress={handleLoginWithGoogle}
              >
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA',
                  }}
                  style={styles.socialIcon}
                />
                <Text style={styles.buttonGoogleText}>Tiếp tục với Google</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonFacebook]}
                onPress={handleLoginWithFacebook}
              >
                <View style={styles.fbIcon}>
                  <Text style={styles.fbIconText}>f</Text>
                </View>
                <Text style={styles.buttonFacebookText}>Tiếp tục với Facebook</Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>hoặc</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleLoginWithEmail}
              >
                <MaterialIcons name="email" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.buttonPrimaryText}>Đăng nhập bằng Email</Text>
              </Pressable>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bằng cách tiếp tục, bạn đồng ý với{' '}
              <Text style={styles.footerLink}>Điều khoản Dịch vụ</Text>
              {' '}và{' '}
              <Text style={styles.footerLink}>Chính sách Bảo mật</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logoCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3c83f6',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111418',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#60708a',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 24,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111418',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#60708a',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonGroup: {
    flexDirection: 'column',
  },
  button: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonGoogle: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  buttonGoogleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111418',
  },
  buttonFacebook: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  buttonFacebookText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111418',
  },
  buttonPrimary: {
    backgroundColor: '#3c83f6',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  fbIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbIconText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#3c83f6',
    fontWeight: '600',
  },
});

export default WelcomeScreen;