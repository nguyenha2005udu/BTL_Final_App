import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { useTheme } from '../../../context/ThemeContext';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  const cardBg = isDarkMode ? theme.cardBackground : '#f8f9fa';

  return (
   <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? theme.headerBackground : 'rgba(245, 247, 248, 0.9)', borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Thông báo</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="mark-chat-read" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={styles.filterTextActive}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: isDarkMode ? theme.cardBackground : 'white', borderColor: theme.border }]}>
            <Text style={[styles.filterText, { color: theme.textSecondary }]}>Chưa đọc</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Hôm nay</Text>
          <View style={styles.cardList}>
            <View style={[styles.notificationCard, { backgroundColor: isDarkMode ? '#1e3a5f' : '#eff6ff' }]}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#4a1d1d' : '#FEE2E2' }]}>
                <MaterialIcons name="payments" size={24} color="#EF4444" />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>Giao dịch mới</Text>
                <Text style={[styles.notifBody, { color: theme.textSecondary }]}>Bạn đã chi tiêu 250.000₫ cho ăn uống.</Text>
                <Text style={styles.notifTime}>5 phút trước</Text>
              </View>
              <View style={styles.dot} />
            </View>
            
            <View style={[styles.notificationCard, { backgroundColor: isDarkMode ? '#1e3a5f' : '#eff6ff' }]}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1e3d2e' : '#DCFCE7' }]}>
                <MaterialIcons name="emoji-events" size={24} color="#22C55E" />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>Mục tiêu hoàn thành</Text>
                <Text style={[styles.notifBody, { color: theme.textSecondary }]}>Bạn đã đạt được mục tiêu Mua laptop mới!</Text>
                <Text style={styles.notifTime}>1 giờ trước</Text>
              </View>
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Tuần trước</Text>
          <View style={styles.cardList}>
            <View style={[styles.notificationCard, { backgroundColor: isDarkMode ? theme.cardBackground : 'white' }]}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1e3a5f' : '#DBEAFE' }]}>
                <MaterialIcons name="notifications-active" size={24} color="#3c83f6" />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>Nhắc nhở ngân sách</Text>
                <Text style={[styles.notifBody, { color: theme.textSecondary }]}>Bạn sắp đạt đến giới hạn ngân sách Ăn uống.</Text>
                <Text style={[styles.notifTime, { color: theme.textSecondary }]}>2 ngày trước</Text>
              </View>
            </View>

            <View style={[styles.notificationCard, { backgroundColor: isDarkMode ? theme.cardBackground : 'white' }]}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1e3d2e' : '#DCFCE7' }]}>
                <MaterialIcons name="savings" size={24} color="#22C55E" />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>Thêm vào mục tiêu</Text>
                <Text style={[styles.notifBody, { color: theme.textSecondary }]}>Bạn đã thêm 2.000.000₫ vào mục tiêu Du lịch Nhật Bản.</Text>
                <Text style={[styles.notifTime, { color: theme.textSecondary }]}>5 ngày trước</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111418',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#3c83f6',
    borderColor: '#3c83f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  cardList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111418',
    marginBottom: 2,
  },
  notifBody: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3c83f6',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3c83f6',
    marginTop: 6,
  },
});

export default NotificationsScreen;