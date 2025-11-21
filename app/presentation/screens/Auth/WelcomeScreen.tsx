import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './WelcomeScreen.styles';

// Tùy project của bạn, khai báo cho khớp với RootStack
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  MainApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLoginWithEmail = () => {
    navigation.navigate('Login');
  };

  const handleContinueWithoutLogin = () => {
    navigation.navigate('MainApp');
  };

  const handleLoginWithGoogle = () => {
    // TODO: logic Google Sign-in
    console.log('Google login');
  };

  const handleLoginWithFacebook = () => {
    // TODO: logic Facebook login
    console.log('Facebook login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>₫</Text>
              </View>
            </View>

            <Text style={styles.title}>Chi Tiêu Của Tôi</Text>
            <Text style={styles.subtitle}>
              Theo dõi chi tiêu và mục tiêu tiết kiệm của bạn
            </Text>
          </View>

          {/* MAIN */}
          <View style={styles.main}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Quản lý tài chính cá nhân hiệu quả
              </Text>
              <Text style={styles.cardText}>
                Ghi lại mọi giao dịch, đặt ra các mục tiêu tiết kiệm thông minh, và
                xem các báo cáo chi tiết để kiểm soát tài chính của bạn một cách
                dễ dàng.
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.button, styles.buttonOutlined]}
                onPress={handleLoginWithGoogle}
              >
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA',
                  }}
                  style={styles.socialIcon}
                />
                <Text style={styles.buttonOutlinedText}>
                  Tiếp tục với Google
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonOutlined]}
                onPress={handleLoginWithFacebook}
              >
                <View style={styles.fbIcon}>
                  <Text style={styles.fbIconText}>f</Text>
                </View>
                <Text style={styles.buttonOutlinedText}>
                  Tiếp tục với Facebook
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleLoginWithEmail}
              >
                <Text style={styles.buttonPrimaryText}>
                  Đăng nhập bằng Email
                </Text>
              </Pressable>
            </View>

            <View style={styles.linkContainer}>
              <Pressable onPress={handleContinueWithoutLogin}>
                <Text style={styles.linkText}>
                  Tiếp tục không cần đăng nhập
                </Text>
              </Pressable>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bằng cách tiếp tục, bạn đồng ý với Điều khoản &amp; Chính sách bảo mật.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
