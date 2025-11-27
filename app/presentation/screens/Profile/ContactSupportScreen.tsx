import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { useTheme } from '../../../context/ThemeContext';

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Liên hệ Hỗ trợ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Contact Methods */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Thông tin liên hệ</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleSendEmail}>
            <View style={[styles.contactIcon, { backgroundColor: isDarkMode ? '#1e3a5f' : '#EFF6FF' }]}>
              <MaterialIcons name="email" size={24} color="#3c83f6" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.textPrimary }]}>Email</Text>
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>support@expensetracker.com</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <View style={[styles.contactIcon, { backgroundColor: isDarkMode ? '#1e3d2e' : '#F0FDF4' }]}>
              <MaterialIcons name="phone" size={24} color="#22C55E" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.textPrimary }]}>Hotline</Text>
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>+84 123 456 789</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
            <View style={[styles.contactIcon, { backgroundColor: isDarkMode ? '#4a3d1d' : '#FEF7E0' }]}>
              <MaterialIcons name="language" size={24} color="#F9AB00" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: theme.textPrimary }]}>Website</Text>
              <Text style={[styles.contactValue, { color: theme.textSecondary }]}>expensetracker.com/support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Send Message Form */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Gửi tin nhắn</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Chủ đề</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Nhập chủ đề"
              placeholderTextColor={theme.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Nội dung</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Mô tả chi tiết vấn đề của bạn..."
              placeholderTextColor={theme.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendEmail}
            disabled={loading}
          >
            <MaterialIcons name="send" size={20} color="white" />
            <Text style={styles.sendButtonText}>Gửi tin nhắn</Text>
          </TouchableOpacity>
        </View>

        {/* Office Hours */}
        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1e3a5f' : '#EFF6FF' }]}>
          <MaterialIcons name="schedule" size={24} color="#3c83f6" />
          <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>Giờ làm việc</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Thứ 2 - Thứ 6: 8:00 - 17:00{'\n'}
            Thứ 7: 8:00 - 12:00{'\n'}
            Chủ nhật: Nghỉ
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, paddingHorizontal: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  contactValue: { fontSize: 14 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, height: 48, paddingHorizontal: 16, fontSize: 16 },
  textArea: { borderWidth: 1, borderRadius: 8, minHeight: 120, padding: 16, fontSize: 16 },
  sendButton: { flexDirection: 'row', backgroundColor: '#3c83f6', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  infoCard: { borderRadius: 16, padding: 20, alignItems: 'center' },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
  infoText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default ContactSupportScreen;