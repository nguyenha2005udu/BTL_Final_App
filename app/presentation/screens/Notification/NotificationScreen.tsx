import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#111418" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="mark-chat-read" size={24} color="#111418" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={styles.filterTextActive}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Chưa đọc</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hôm nay</Text>
          <View style={styles.cardList}>
            <View style={[styles.notificationCard, styles.unreadCard]}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="payments" size={24} color="#EF4444" />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>Giao dịch mới</Text>
                <Text style={styles.notifBody}>Bạn đã chi tiêu 250.000₫ cho ăn uống.</Text>
                <Text style={styles.notifTime}>5 phút trước</Text>
              </View>
              <View style={styles.dot} />
            </View>
            
            <View style={[styles.notificationCard, styles.unreadCard]}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <MaterialIcons name="emoji-events" size={24} color="#22C55E" />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>Mục tiêu hoàn thành</Text>
                <Text style={styles.notifBody}>Bạn đã đạt được mục tiêu Mua laptop mới!</Text>
                <Text style={styles.notifTime}>1 giờ trước</Text>
              </View>
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuần trước</Text>
          <View style={styles.cardList}>
            <View style={styles.notificationCard}>
              <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                <MaterialIcons name="notifications-active" size={24} color="#3c83f6" />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>Nhắc nhở ngân sách</Text>
                <Text style={styles.notifBody}>Bạn sắp đạt đến giới hạn ngân sách Ăn uống.</Text>
                <Text style={[styles.notifTime, { color: '#6b7280' }]}>2 ngày trước</Text>
              </View>
            </View>

            <View style={styles.notificationCard}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <MaterialIcons name="savings" size={24} color="#22C55E" />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>Thêm vào mục tiêu</Text>
                <Text style={styles.notifBody}>Bạn đã thêm 2.000.000₫ vào mục tiêu Du lịch Nhật Bản.</Text>
                <Text style={[styles.notifTime, { color: '#6b7280' }]}>5 ngày trước</Text>
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
    backgroundColor: '#f5f7f8',
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