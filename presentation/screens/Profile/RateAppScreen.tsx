import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, Linking, Platform, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@components/icon';
import { useTheme } from '@context/ThemeContext';

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
    if (rating === 0) return 'Chạm vào sao để đánh giá';
    if (rating === 1) return 'Rất tệ 😞';
    if (rating === 2) return 'Tệ 😕';
    if (rating === 3) return 'Bình thường 😐';
    if (rating === 4) return 'Tốt 😊';
    return 'Xuất sắc! 🎉';
  };

  const getRatingColor = () => {
    if (rating === 0) return theme.textSecondary;
    if (rating <= 2) return '#EF4444';
    if (rating === 3) return '#F59E0B';
    return '#22C55E';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Đánh giá Ứng dụng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Rating Card */}
        <View style={[styles.mainCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.appIconCircle, { 
              backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF'
            }]}>
              <MaterialIcons name="favorite" size={56} color="#EF4444" />
            </View>
            <View style={styles.sparkles}>
              <MaterialIcons name="star" size={20} color="#F59E0B" style={styles.sparkle1} />
              <MaterialIcons name="star" size={16} color="#F59E0B" style={styles.sparkle2} />
              <MaterialIcons name="star" size={18} color="#F59E0B" style={styles.sparkle3} />
            </View>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Bạn thích Expense Tracker?
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Đánh giá của bạn giúp chúng tôi phát triển tốt hơn
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingPress(star)}
                activeOpacity={0.6}
                style={[styles.starButton, {
                  transform: [{ scale: star <= rating ? 1.1 : 1 }],
                }]}
              >
                <MaterialIcons
                  name={star <= rating ? 'star' : 'star-border'}
                  size={48}
                  color={star <= rating ? '#F59E0B' : (isDarkMode ? '#475569' : '#CBD5E1')}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.ratingMessageBox, {
            backgroundColor: rating > 0 
              ? (isDarkMode ? '#1F2937' : '#F8FAFC')
              : 'transparent'
          }]}>
            <Text style={[styles.ratingMessage, { color: getRatingColor() }]}>
              {getRatingMessage()}
            </Text>
          </View>

          {/* Feedback Input */}
          {rating > 0 && (
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackHeader}>
                <MaterialIcons 
                  name={rating >= 4 ? 'chat-bubble-outline' : 'feedback'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
                <Text style={[styles.feedbackLabel, { color: theme.textSecondary }]}>
                  {rating >= 4 ? 'Chia sẻ thêm (không bắt buộc)' : 'Chúng tôi có thể cải thiện gì?'}
                </Text>
              </View>
              <TextInput
                style={[styles.feedbackInput, { 
                  backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
                  borderColor: isDarkMode ? theme.border : '#E2E8F0',
                  color: theme.textPrimary 
                }]}
                placeholder="Chia sẻ trải nghiệm của bạn..."
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
            style={[
              styles.submitButton, 
              rating === 0 && styles.submitButtonDisabled,
              rating >= 4 && styles.submitButtonPositive
            ]}
            onPress={handleSubmit}
            disabled={rating === 0}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={rating >= 4 ? 'thumb-up' : 'send'} 
              size={20} 
              color="white" 
            />
            <Text style={styles.submitButtonText}>
              {rating >= 4 ? 'Gửi đánh giá' : rating > 0 ? 'Gửi phản hồi' : 'Chọn số sao'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Card */}
        <View style={[styles.statsCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <View style={styles.statsHeader}>
            <MaterialIcons name="analytics" size={24} color="#3B82F6" />
            <Text style={[styles.statsTitle, { color: theme.textPrimary }]}>
              Thống kê đánh giá
            </Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEF7E0' }]}>
                <MaterialIcons name="star" size={28} color="#F59E0B" />
              </View>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Trung bình</Text>
            </View>

            <View style={[styles.statDivider, { 
              backgroundColor: isDarkMode ? theme.border : '#E2E8F0'
            }]} />

            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                <MaterialIcons name="people" size={28} color="#3B82F6" />
              </View>
              <Text style={[styles.statNumber, { color: '#3B82F6' }]}>12.5K</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Đánh giá</Text>
            </View>

            <View style={[styles.statDivider, { 
              backgroundColor: isDarkMode ? theme.border : '#E2E8F0'
            }]} />

            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
                <MaterialIcons name="mood" size={28} color="#22C55E" />
              </View>
              <Text style={[styles.statNumber, { color: '#22C55E' }]}>98%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Hài lòng</Text>
            </View>
          </View>

          <View style={[styles.ratingBars, { 
            backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
            borderColor: isDarkMode ? theme.border : '#E2E8F0'
          }]}>
            {[5, 4, 3, 2, 1].map((star) => {
              const percentage = star === 5 ? 75 : star === 4 ? 20 : star === 3 ? 3 : star === 2 ? 1 : 1;
              return (
                <View key={star} style={styles.ratingBar}>
                  <Text style={[styles.ratingBarLabel, { color: theme.textSecondary }]}>
                    {star}★
                  </Text>
                  <View style={[styles.ratingBarBg, { 
                    backgroundColor: isDarkMode ? '#374151' : '#E2E8F0'
                  }]}>
                    <View 
                      style={[styles.ratingBarFill, { 
                        width: `${percentage}%`,
                        backgroundColor: '#F59E0B'
                      }]} 
                    />
                  </View>
                  <Text style={[styles.ratingBarPercentage, { color: theme.textSecondary }]}>
                    {percentage}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Thank You Card */}
        <View style={[styles.thankYouCard, { 
          backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF'
        }]}>
          <MaterialIcons name="favorite" size={32} color="#EF4444" />
          <Text style={[styles.thankYouText, { color: theme.textPrimary }]}>
            Cảm ơn bạn đã sử dụng Expense Tracker!
          </Text>
          <Text style={[styles.thankYouSubtext, { color: theme.textSecondary }]}>
            Chúng tôi luôn lắng nghe và cải thiện
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  appIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  sparkles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle1: {
    position: 'absolute',
    top: -5,
    right: 10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 5,
    left: -5,
  },
  sparkle3: {
    position: 'absolute',
    top: 15,
    left: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  starButton: {
    padding: 4,
  },
  ratingMessageBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 24,
  },
  ratingMessage: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  feedbackContainer: {
    width: '100%',
    marginBottom: 24,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  feedbackInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    minHeight: 110,
    padding: 16,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#3B82F6',
    width: '100%',
    height: 52,
    borderRadius: 14,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.1,
  },
  submitButtonPositive: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    justifyContent: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E2E8F0',
  },
  ratingBars: {
    gap: 10,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingBarLabel: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    color: '#64748B',
  },
  ratingBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  ratingBarPercentage: {
    fontSize: 12,
    fontWeight: '700',
    width: 38,
    textAlign: 'right',
    color: '#64748B',
  },
  thankYouCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  thankYouText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  thankYouSubtext: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default RateAppScreen;
