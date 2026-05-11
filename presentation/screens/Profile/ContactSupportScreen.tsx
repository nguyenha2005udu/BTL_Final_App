import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@components/icon';
import { useTheme } from '@context/ThemeContext';

const ContactSupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = () => {
    if (!subject || !message) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const email = 'support@expensetracker.com';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    Linking.openURL(mailto).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
    });
  };

  const handleCall = () => {
    Linking.openURL('tel:+84123456789');
  };

  const openWebsite = () => {
    Linking.openURL('https://expensetracker.com/support');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Liên hệ hỗ trợ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={[styles.heroCard, { 
          backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF'
        }]}>
          <View style={[styles.heroIcon, { backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE' }]}>
            <MaterialIcons name="support-agent" size={40} color="#3B82F6" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Chúng tôi luôn sẵn sàng
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Hãy cho chúng tôi biết làm thế nào chúng tôi có thể giúp bạn
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Kênh liên hệ
          </Text>
          <View style={[styles.badge, { 
            backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE'
          }]}>
            <Text style={[styles.badgeText, { 
              color: isDarkMode ? '#FFFFFF' : '#3B82F6'
            }]}>
              3
            </Text>
          </View>
        </View>

        <View style={[styles.card, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <TouchableOpacity 
            style={[styles.contactItem, styles.contactItemBorder, {
              borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
            }]}
            onPress={handleSendEmail}
            activeOpacity={0.7}
          >
            <View style={[styles.contactIcon, { backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF' }]}>
              <MaterialIcons name="email" size={24} color="#3B82F6" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.textPrimary }]}>Email hỗ trợ</Text>
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                support@expensetracker.com
              </Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Phản hồi trong 24h</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactItem, styles.contactItemBorder, {
              borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
            }]}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <View style={[styles.contactIcon, { backgroundColor: isDarkMode ? '#1E3D2E' : '#DCFCE7' }]}>
              <MaterialIcons name="phone" size={24} color="#22C55E" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.textPrimary }]}>Hotline</Text>
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                +84 123 456 789
              </Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                <Text style={styles.statusText}>Thứ 2 - Thứ 6: 8h-17h</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={openWebsite}
            activeOpacity={0.7}
          >
            <View style={[styles.contactIcon, { backgroundColor: isDarkMode ? '#4A3D1D' : '#FEF7E0' }]}>
              <MaterialIcons name="language" size={24} color="#F59E0B" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.textPrimary }]}>Website</Text>
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>
                expensetracker.com/support
              </Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.statusText}>Tài liệu & FAQ</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Send Message Form */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Gửi tin nhắn
          </Text>
          <MaterialIcons name="chat-bubble-outline" size={20} color={theme.textSecondary} />
        </View>

        <View style={[styles.card, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Chủ đề</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="subject" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
                  borderColor: isDarkMode ? theme.border : '#E2E8F0',
                  color: theme.textPrimary 
                }]}
                placeholder="VD: Lỗi đồng bộ dữ liệu"
                placeholderTextColor={theme.textSecondary}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Nội dung</Text>
            <View style={styles.textAreaWrapper}>
              <MaterialIcons name="description" size={20} color={theme.textSecondary} style={styles.textAreaIcon} />
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
                  borderColor: isDarkMode ? theme.border : '#E2E8F0',
                  color: theme.textPrimary 
                }]}
                placeholder="Mô tả chi tiết vấn đề của bạn... Càng chi tiết càng tốt để chúng tôi có thể hỗ trợ bạn nhanh nhất."
                placeholderTextColor={theme.textSecondary}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              <MaterialIcons name="info-outline" size={14} color={theme.textSecondary} />
              {' '}Bao gồm ảnh chụp màn hình nếu có lỗi
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendEmail}
            disabled={loading}
            activeOpacity={0.8}
          >
            <MaterialIcons name="send" size={20} color="white" />
            <Text style={styles.sendButtonText}>Gửi tin nhắn</Text>
          </TouchableOpacity>
        </View>

        {/* Office Hours */}
        <View style={[styles.infoCard, { 
          backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF'
        }]}>
          <View style={[styles.infoIconBox, { 
            backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE'
          }]}>
            <MaterialIcons name="schedule" size={28} color="#3B82F6" />
          </View>
          <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>
            Giờ làm việc
          </Text>
          <View style={styles.scheduleList}>
            <View style={styles.scheduleItem}>
              <MaterialIcons name="event" size={16} color={theme.textSecondary} />
              <Text style={[styles.scheduleText, { color: theme.textSecondary }]}>
                Thứ 2 - Thứ 6: <Text style={{ fontWeight: '700' }}>8:00 - 17:00</Text>
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <MaterialIcons name="event" size={16} color={theme.textSecondary} />
              <Text style={[styles.scheduleText, { color: theme.textSecondary }]}>
                Thứ 7: <Text style={{ fontWeight: '700' }}>8:00 - 12:00</Text>
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <MaterialIcons name="event-busy" size={16} color="#EF4444" />
              <Text style={[styles.scheduleText, { color: theme.textSecondary }]}>
                Chủ nhật: <Text style={{ fontWeight: '700', color: '#EF4444' }}>Nghỉ</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Theo dõi chúng tôi
          </Text>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={[styles.socialButton, { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
            }]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="facebook" size={24} color="#1877F2" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
            }]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="mail" size={24} color="#EA4335" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
            }]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chat" size={24} color="#25D366" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
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
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  contactItemBorder: {
    borderBottomWidth: 1,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
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
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  textAreaWrapper: {
    position: 'relative',
  },
  textAreaIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    minHeight: 140,
    paddingLeft: 48,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#3B82F6',
    height: 52,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.1,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  scheduleList: {
    gap: 10,
    width: '100%',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});

export default ContactSupportScreen;