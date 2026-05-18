import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@context/ThemeContext';
import { getCurrentUserProfile } from '@services/auth.service';
import { auth } from '@services/firebase/firebaseConfig';

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
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Hồ sơ</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={[styles.profileCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <Image
            source={{ uri: avatarUrl || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{email}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF' }]}
            onPress={() => navigation.navigate('UpdateProfile')}
          >
            <MaterialIcons name="edit" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GIAO DIỆN</Text>
          <View style={[styles.card, { 
            backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
          }]}>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#4A3D1D' : '#FEF7E0' }]}>
                  <MaterialIcons name="dark-mode" size={24} color="#F59E0B" />
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
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor={'white'}
                ios_backgroundColor="#E2E8F0"
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TÀI KHOẢN</Text>
          <View style={[styles.card, { 
            backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
          }]}>
            <TouchableOpacity 
              style={styles.rowItem} 
              onPress={() => navigation.navigate('UpdateProfile')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF' }]}>
                  <MaterialIcons name="person" size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Cập nhật thông tin cá nhân</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? theme.divider : '#F1F5F9' }]} />
            
            <TouchableOpacity 
              style={styles.rowItem} 
              onPress={() => navigation.navigate('ChangePassword')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E3D2E' : '#DCFCE7' }]}>
                  <MaterialIcons name="lock" size={24} color="#22C55E" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Đổi mật khẩu</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isDarkMode ? theme.divider : '#F1F5F9' }]} />

            <TouchableOpacity 
              style={styles.rowItem} 
              onPress={() => navigation.navigate('SecurityPolicy')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#4A1D1D' : '#FEE2E2' }]}>
                  <MaterialIcons name="security" size={24} color="#EF4444" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Bảo mật và chính sách</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>HỖ TRỢ</Text>
          <View style={[styles.card, { 
            backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
          }]}>
            <TouchableOpacity 
              style={styles.rowItem} 
              onPress={() => navigation.navigate('HelpCenter')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF' }]}>
                  <MaterialIcons name="help-outline" size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Trung tâm trợ giúp</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? theme.divider : '#F1F5F9' }]} />
            
            <TouchableOpacity 
              style={styles.rowItem} 
              onPress={() => navigation.navigate('ContactSupport')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#0D3D3D' : '#CFFAFE' }]}>
                  <MaterialIcons name="headset-mic" size={24} color="#06B6D4" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Liên hệ để được hỗ trợ</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isDarkMode ? theme.divider : '#F1F5F9' }]} />

            <TouchableOpacity 
              style={styles.rowItem} 
              onPress={() => navigation.navigate('RateApp')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#4A3D1D' : '#FEF7E0' }]}>
                  <MaterialIcons name="star" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Đánh giá ứng dụng</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#4A1D1D' : '#FFFFFF' }]}
          onPress={() => navigation.navigate('Welcome')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#3B82F6',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 78,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    gap: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: -0.2,
  },
});

export default ProfileScreen;