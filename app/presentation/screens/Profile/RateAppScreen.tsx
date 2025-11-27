import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { useTheme } from '../../../context/ThemeContext';

const RateAppScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá');
      return;
    }

    // Nếu rating >= 4, mở store để đánh giá
    if (rating >= 4) {
      Alert.alert(
        'Cảm ơn bạn!',
        'Bạn có muốn đánh giá ứng dụng trên Store không?',
        [
          { text: 'Để sau', style: 'cancel' },
          { 
            text: 'Đánh giá ngay', 
            onPress: () => {
              const storeUrl = Platform.select({
                ios: 'https://apps.apple.com/app/idXXXXXXXXX',
                android: 'https://play.google.com/store/apps/details?id=com.expensetracker'
              });
              if (storeUrl) {
                Linking.openURL(storeUrl);
              }
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      // Nếu rating < 4, gửi feedback
      Alert.alert(
        'Cảm ơn phản hồi!',
        'Chúng tôi sẽ cải thiện ứng dụng dựa trên góp ý của bạn.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const getRatingMessage = () => {
    if (rating === 0) return 'Bạn cảm thấy ứng dụng thế nào?';
    if (rating === 1) return 'Rất tệ';
    if (rating === 2) return 'Tệ';
    if (rating === 3) return 'Bình thường';
    if (rating === 4) return 'Tốt';
    return 'Xuất sắc!';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Đánh giá Ứng dụng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.mainCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.appIconCircle, { backgroundColor: isDarkMode ? '#1e3a5f' : '#EFF6FF' }]}>
              <MaterialIcons name="favorite" size={48} color="#3c83f6" />
            </View>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>Bạn thích Expense Tracker?</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Đánh giá của bạn giúp chúng tôi cải thiện ứng dụng
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingPress(star)}
                activeOpacity={0.7}
                style={styles.starButton}
              >
                <MaterialIcons
                  name={star <= rating ? 'star' : 'star-border'}
                  size={48}
                  color={star <= rating ? '#F9AB00' : theme.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.ratingMessage, { color: rating > 0 ? '#3c83f6' : theme.textSecondary }]}>
            {getRatingMessage()}
          </Text>

          {/* Feedback Input */}
          {rating > 0 && (
            <View style={styles.feedbackContainer}>
              <Text style={[styles.feedbackLabel, { color: theme.textSecondary }]}>
                {rating >= 4 ? 'Bạn muốn chia sẻ gì thêm? (Không bắt buộc)' : 'Chúng tôi có thể cải thiện điều gì?'}
              </Text>
              <TextInput
                style={[styles.feedbackInput, { 
                  backgroundColor: theme.background, 
                  borderColor: theme.border, 
                  color: theme.textPrimary 
                }]}
                placeholder="Nhập ý kiến của bạn..."
                placeholderTextColor={theme.textSecondary}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>
              {rating >= 4 ? 'Gửi đánh giá' : 'Gửi phản hồi'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Card */}
        <View style={[styles.statsCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statsTitle, { color: theme.textPrimary }]}>Thống kê đánh giá</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#F9AB00' }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Trung bình</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#3c83f6' }]}>12.5K</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Đánh giá</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#22C55E' }]}>98%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Hài lòng</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Cảm ơn bạn đã sử dụng Expense Tracker! 💙
        </Text>
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
  mainCard: { borderRadius: 20, padding: 24, marginBottom: 16, alignItems: 'center' },
  iconContainer: { marginBottom: 20 },
  appIconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  starsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  starButton: { padding: 4 },
  ratingMessage: { fontSize: 18, fontWeight: '600', marginBottom: 24 },
  feedbackContainer: { width: '100%', marginBottom: 24 },
  feedbackLabel: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  feedbackInput: { borderWidth: 1, borderRadius: 12, minHeight: 100, padding: 12, fontSize: 14 },
  submitButton: { backgroundColor: '#3c83f6', width: '100%', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  statsCard: { borderRadius: 16, padding: 20, marginBottom: 16 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, height: 40, backgroundColor: '#e5e7eb' },
  footerText: { fontSize: 14, textAlign: 'center', marginTop: 8 },
});

export default RateAppScreen;