import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { listenAppNotifications, type AppNotification } from '../../../services/notification.service';

type Filter = 'all' | 'unread';

const formatTimeAgo = (d: Date) => {
  const now = Date.now();
  const diff = Math.max(0, now - d.getTime());

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (sec < 60) return 'Vừa xong';
  if (min < 60) return `${min} phút trước`;
  if (hour < 24) return `${hour} giờ trước`;
  return `${day} ngày trước`;
};

const buildSections = (list: AppNotification[]) => {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const today: AppNotification[] = [];
  const older: AppNotification[] = [];

  list.forEach(n => {
    if (n.createdAt.getTime() >= startToday.getTime()) today.push(n);
    else older.push(n);
  });

  const sections: { title: string; data: AppNotification[] }[] = [];
  if (today.length) sections.push({ title: 'Hôm nay', data: today });
  if (older.length) sections.push({ title: 'Tuần trước', data: older });

  return sections;
};

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();

  const [filter, setFilter] = React.useState<Filter>('all');
  const [items, setItems] = React.useState<AppNotification[]>([]);

  React.useEffect(() => {
    const unsub = listenAppNotifications(
      n => {
        setItems(prev => [n, ...prev].slice(0, 80));
      },
      err => console.log('listenAppNotifications error', err),
    );

    return () => unsub?.();
  }, []);

  const visible = React.useMemo(() => {
    return filter === 'unread' ? items.filter(i => !i.read) : items;
  }, [items, filter]);

  const sections = React.useMemo(() => buildSections(visible), [visible]);

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));

  const onPressNotif = (id: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, read: true } : i)));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Thông báo</Text>

          <TouchableOpacity style={styles.iconButton} onPress={markAllRead}>
            <MaterialIcons name="mark-chat-read" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all'
                ? styles.filterButtonActive
                : { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
            onPress={() => setFilter('all')}
            activeOpacity={0.85}
          >
            <Text style={filter === 'all' ? styles.filterTextActive : [styles.filterText, { color: theme.textSecondary }]}>
              Tất cả
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'unread'
                ? styles.filterButtonActive
                : { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
            onPress={() => setFilter('unread')}
            activeOpacity={0.85}
          >
            <Text
              style={
                filter === 'unread' ? styles.filterTextActive : [styles.filterText, { color: theme.textSecondary }]
              }
            >
              Chưa đọc
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {visible.length === 0 ? (
          <View style={[styles.emptyWrap, { borderColor: theme.border }]}>
            <MaterialIcons name="notifications-none" size={28} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Chưa có thông báo</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Khi dữ liệu thay đổi trên Firebase, thông báo sẽ xuất hiện ở đây.
            </Text>
          </View>
        ) : (
          sections.map(section => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{section.title}</Text>

              <View style={styles.cardList}>
                {section.data.map(item => {
                  const cardBg = !item.read
                    ? isDarkMode
                      ? '#1e3a5f'
                      : '#eff6ff'
                    : theme.cardBackground;

                  const timeColor = item.read ? theme.textSecondary : '#3c83f6';
                  const iconBg = isDarkMode ? item.iconBgDark : item.iconBgLight;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => onPressNotif(item.id)}
                      style={[styles.notificationCard, { backgroundColor: cardBg }]}
                    >
                      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                        <MaterialIcons name={item.icon as any} size={24} color={item.iconColor} />
                      </View>

                      <View style={styles.notifContent}>
                        <Text style={[styles.notifTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={[styles.notifBody, { color: theme.textSecondary }]} numberOfLines={2}>
                          {item.body}
                        </Text>
                        <Text style={[styles.notifTime, { color: timeColor }]}>{formatTimeAgo(item.createdAt)}</Text>
                      </View>

                      {!item.read ? <View style={styles.dot} /> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}
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
    padding: 16,
    borderRadius: 12,
    gap: 16,
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
  emptyWrap: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default NotificationsScreen;
