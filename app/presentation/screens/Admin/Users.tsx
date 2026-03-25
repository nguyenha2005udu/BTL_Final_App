import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

const USERS = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    status: 'active',
    createdAt: '20/05/2023',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    status: 'locked',
    createdAt: '18/06/2023',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '3',
    name: 'Lê Hoàng C',
    email: 'lehoangc@example.com',
    status: 'active',
    createdAt: '12/07/2023',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
];

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Hoạt động' },
  { key: 'locked', label: 'Bị khóa' },
];

const NAV_ITEMS = [
  { key: 'overview', label: 'Tổng quan', icon: '⊞' },
  { key: 'users', label: 'Người dùng', icon: '👥' },
  { key: 'stats', label: 'Thống kê', icon: '📊' },
  { key: 'settings', label: 'Cài đặt', icon: '⚙️' },
];

export default function UserManagementScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [activeNav, setActiveNav] = useState('users');

  const filteredUsers = USERS.filter((user) => {
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'active' && user.status === 'active') ||
      (activeTab === 'locked' && user.status === 'locked');
    const matchSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  const renderUser = ({ item }) => {
    const isLocked = item.status === 'locked';
    return (
      <View style={styles.userCard}>
        <View style={styles.userTop}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View style={[styles.statusBadge, isLocked ? styles.badgeLocked : styles.badgeActive]}>
            <Text style={[styles.statusText, isLocked ? styles.statusTextLocked : styles.statusTextActive]}>
              {isLocked ? 'BỊ KHÓA' : 'HOẠT ĐỘNG'}
            </Text>
          </View>
        </View>

        <View style={styles.userBottom}>
          <View>
            <Text style={styles.dateLabel}>Ngày tạo</Text>
            <Text style={styles.dateValue}>{item.createdAt}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, isLocked && styles.actionBtnLocked]}>
              <Text style={styles.actionIcon}>🔒</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addIcon}>👤+</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            <TouchableOpacity style={styles.loadMoreBtn}>
              <Text style={styles.loadMoreText}>Tải thêm người dùng</Text>
            </TouchableOpacity>
            <Text style={styles.totalText}>
              Hiển thị {filteredUsers.length} trong số 128 người dùng
            </Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => setActiveNav(item.key)}
          >
            <Text style={[styles.navIcon, activeNav === item.key && styles.navIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, activeNav === item.key && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const GREEN = '#2d7a3a';
const GREEN_LIGHT = '#e8f5eb';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f0f4f0',
  },
  menuBtn: { padding: 4 },
  menuIcon: { fontSize: 22 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addBtn: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addIcon: { fontSize: 16, color: '#fff' },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8, color: '#aaa' },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dde8dd',
  },
  tabActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },

  // User Card
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeActive: { backgroundColor: GREEN_LIGHT },
  badgeLocked: { backgroundColor: '#fde8e8' },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextActive: { color: GREEN },
  statusTextLocked: { color: '#d93025' },

  userBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  dateLabel: { fontSize: 12, color: '#aaa', marginBottom: 2 },
  dateValue: { fontSize: 13, color: '#444', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  actionBtnLocked: {
    borderColor: '#f5c6c6',
    backgroundColor: '#fff0f0',
  },
  actionIcon: { fontSize: 15 },

  // Load More
  loadMoreBtn: {
    borderWidth: 1,
    borderColor: '#cce0cc',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  loadMoreText: {
    color: GREEN,
    fontWeight: '600',
    fontSize: 15,
  },
  totalText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 13,
    marginBottom: 8,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: { fontSize: 20, marginBottom: 2 },
  navIconActive: {},
  navLabel: {
    fontSize: 11,
    color: '#aaa',
    fontWeight: '500',
  },
  navLabelActive: {
    color: GREEN,
    fontWeight: '700',
  },
});