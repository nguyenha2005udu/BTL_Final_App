import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { getCurrentUserProfile } from '../../../services/auth.service';
import { auth } from '../../../services/firebase/firebaseConfig';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA_vMSFQARLvGWesaN0bPwdT0TwBkCjQuK-p1dyFrGdqF-NhAqX3D22UFhPgycZkrUA24cKIcSZEPLOfhmUcNZTvYIXtJBvgXlaRUnPVCaQ5zWzrC0n45kOlTptHz4fEKjcJrTwoasD3u6BnAo6DO1bJ2oe7sNZMz4X8J4ZExMW6HBrFk1JAZloRwzDfjdw4WOSE8HcBg82M53Zk1lZ9igZ6sqHdz0lO3Cvw1h6_YE38kL45oHN1DtJsD26XLF9ECZDyI3c-2ms-qO0';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isDarkMode, theme, toggleDarkMode } = useTheme();

  const [displayName, setDisplayName] = useState<string>('Người dùng');
  const [email, setEmail] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();

        if (profile?.fullName) {
          setDisplayName(profile.fullName);
        } else if (auth.currentUser?.email) {
          setDisplayName(auth.currentUser.email.split('@')[0]);
        }

        setEmail(auth.currentUser?.email || '');

        if (profile?.photoUrl && profile.photoUrl.trim() !== '') {
          setAvatarUrl(profile.photoUrl);
        } else if (auth.currentUser?.photoURL) {
          setAvatarUrl(auth.currentUser.photoURL);
        } else {
          setAvatarUrl(null);
        }
      } catch (error) {
        console.log('LOAD PROFILE ERROR >>>', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Hồ sơ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: avatarUrl || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{email}</Text>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Giao diện</Text>
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.iconBoxBg }]}>
                  <MaterialIcons name="dark-mode" size={24} color={isDarkMode ? '#fbbf24' : '#4b5563'} />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Chế độ tối</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
                    {isDarkMode ? 'Đang bật' : 'Đang tắt'}
                  </Text>
                </View>
              </View>
              <Switch 
                value={isDarkMode} 
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#d1d5db', true: '#3c83f6' }}
                thumbColor={'white'}
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Tài khoản</Text>
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('UpdateProfile')}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1e3a5f' : '#E8F0FE' }]}>
                  <MaterialIcons name="person" size={24} color="#1A73E8" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Cập nhật thông tin cá nhân</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            
            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('ChangePassword')}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1e3d2e' : '#E6F4EA' }]}>
                  <MaterialIcons name="lock" size={24} color="#1E8E3E" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Đổi mật khẩu</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('SecurityPolicy')}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#4a1d1d' : '#FCE8E6' }]}>
                  <MaterialIcons name="security" size={24} color="#D93025" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Bảo mật và chính sách</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Hỗ trợ</Text>
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('HelpCenter')}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1e3a5f' : '#E8F0FE' }]}>
                  <MaterialIcons name="help-outline" size={24} color="#1A73E8" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Trung tâm trợ giúp</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            
            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('ContactSupport')}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#0d3d3d' : '#E0F7FA' }]}>
                  <MaterialIcons name="headset-mic" size={24} color="#007B83" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Liên hệ để được hỗ trợ</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('RateApp')}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#4a3d1d' : '#FEF7E0' }]}>
                  <MaterialIcons name="star" size={24} color="#F9AB00" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Đánh giá ứng dụng</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#4a1d1d' : '#FEF2F2' }]}
          onPress={() => navigation.navigate('Welcome')}
        >
          <MaterialIcons name="logout" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111418',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 72, 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});

export default ProfileScreen;