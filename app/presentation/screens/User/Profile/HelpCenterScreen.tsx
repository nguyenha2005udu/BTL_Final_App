import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '../../../../components/icon';
import { MaterialIcons } from '../../../../../components/icon';
import { useTheme } from '../../../../context/ThemeContext';

const HelpCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Làm thế nào để thêm giao dịch?',
      answer: 'Nhấn vào nút "+" ở góc dưới bên phải màn hình chính, chọn loại giao dịch (Thu/Chi), nhập số tiền, chọn danh mục và thêm ghi chú nếu cần.',
      icon: 'add-circle-outline',
      color: '#3B82F6'
    },
    {
      question: 'Làm sao để xem báo cáo chi tiêu?',
      answer: 'Vào tab "Báo cáo" ở thanh menu dưới cùng. Bạn có thể xem chi tiêu theo tuần, tháng hoặc tùy chọn thời gian.',
      icon: 'assessment',
      color: '#8B5CF6'
    },
    {
      question: 'Tôi có thể tạo mục tiêu tiết kiệm không?',
      answer: 'Có! Vào màn hình Mục tiêu, nhấn "Tạo mục tiêu mới", nhập tên, số tiền mục tiêu và thời hạn. Bạn có thể theo dõi tiến độ và nạp/rút tiền bất cứ lúc nào.',
      icon: 'savings',
      color: '#22C55E'
    },
    {
      question: 'Làm thế nào để đổi mật khẩu?',
      answer: 'Vào Profile → Đổi mật khẩu. Nhập mật khẩu hiện tại và mật khẩu mới, sau đó xác nhận.',
      icon: 'lock-outline',
      color: '#F59E0B'
    },
    {
      question: 'Dữ liệu của tôi có được sao lưu không?',
      answer: 'Có, tất cả dữ liệu được tự động đồng bộ và sao lưu trên cloud. Bạn có thể đăng nhập trên nhiều thiết bị để truy cập dữ liệu.',
      icon: 'cloud-done',
      color: '#06B6D4'
    },
    {
      question: 'Tôi có thể xuất dữ liệu không?',
      answer: 'Có! Vào màn hình Báo cáo, chọn "Xuất CSV" hoặc "Xuất PDF" để tải dữ liệu về máy.',
      icon: 'file-download',
      color: '#EC4899'
    },
    {
      question: 'Làm sao để xóa tài khoản?',
      answer: 'Liên hệ với chúng tôi qua email support@expensetracker.com để yêu cầu xóa tài khoản. Lưu ý: dữ liệu sẽ bị xóa vĩnh viễn.',
      icon: 'delete-outline',
      color: '#EF4444'
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Trung tâm Trợ giúp</Text>
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
            <MaterialIcons name="help-outline" size={40} color="#3B82F6" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Chúng tôi sẵn sàng giúp bạn
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Tìm câu trả lời cho các câu hỏi thường gặp
          </Text>
        </View>

        {/* Search Card */}
        <TouchableOpacity 
          style={[styles.searchCard, { 
            backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
          }]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="search" size={24} color={theme.textSecondary} />
          <Text style={[styles.searchText, { color: theme.textSecondary }]}>
            Tìm kiếm câu hỏi...
          </Text>
          <View style={styles.searchBadge}>
            <MaterialIcons name="keyboard" size={16} color="#64748B" />
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionCard, { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
            }]}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
              <MaterialIcons name="video-library" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.textPrimary }]}>
              Video hướng dẫn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickActionCard, { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
            }]}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#DCFCE7' }]}>
              <MaterialIcons name="article" size={24} color="#22C55E" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.textPrimary }]}>
              Tài liệu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Câu hỏi thường gặp
          </Text>
          <View style={[styles.badge, { 
            backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE'
          }]}>
            <Text style={[styles.badgeText, { 
              color: isDarkMode ? '#FFFFFF' : '#3B82F6'
            }]}>
              {faqs.length}
            </Text>
          </View>
        </View>

        {/* FAQ Cards */}
        {faqs.map((faq, index) => (
          <View 
            key={index} 
            style={[styles.faqCard, { 
              backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
            }]}
          >
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeaderLeft}>
                <View style={[styles.faqIcon, { 
                  backgroundColor: faq.color + '20'
                }]}>
                  <MaterialIcons name={faq.icon as any} size={20} color={faq.color} />
                </View>
                <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>
                  {faq.question}
                </Text>
              </View>
              <View style={[styles.expandButton, {
                backgroundColor: expandedIndex === index 
                  ? (isDarkMode ? '#3B82F6' : '#DBEAFE')
                  : (isDarkMode ? '#1F2937' : '#F8FAFC')
              }]}>
                <MaterialIcons 
                  name={expandedIndex === index ? "expand-less" : "expand-more"} 
                  size={20} 
                  color={expandedIndex === index ? '#3B82F6' : theme.textSecondary}
                />
              </View>
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <View style={[styles.faqAnswer, { 
                borderTopColor: isDarkMode ? theme.border : '#F1F5F9'
              }]}>
                <View style={[styles.answerIcon, { backgroundColor: faq.color + '15' }]}>
                  <MaterialIcons name="lightbulb-outline" size={18} color={faq.color} />
                </View>
                <Text style={[styles.faqAnswerText, { color: theme.textSecondary }]}>
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Contact Support Card */}
        <View style={[styles.contactCard, { 
          backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF'
        }]}>
          <View style={[styles.contactIconBox, { 
            backgroundColor: isDarkMode ? '#3B82F6' : '#FFFFFF'
          }]}>
            <MaterialIcons name="support-agent" size={48} color="#3B82F6" />
          </View>
          <Text style={[styles.contactTitle, { color: theme.textPrimary }]}>
            Không tìm thấy câu trả lời?
          </Text>
          <Text style={[styles.contactSubtitle, { color: theme.textSecondary }]}>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('ContactSupport')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="chat" size={20} color="white" />
            <Text style={styles.contactButtonText}>Liên hệ hỗ trợ</Text>
          </TouchableOpacity>

          <View style={styles.contactMethods}>
            <View style={styles.contactMethod}>
              <MaterialIcons name="email" size={16} color={theme.textSecondary} />
              <Text style={[styles.contactMethodText, { color: theme.textSecondary }]}>
                Email 24/7
              </Text>
            </View>
            <View style={styles.contactMethodDivider} />
            <View style={styles.contactMethod}>
              <MaterialIcons name="schedule" size={16} color={theme.textSecondary} />
              <Text style={[styles.contactMethodText, { color: theme.textSecondary }]}>
                Phản hồi nhanh
              </Text>
            </View>
          </View>
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
    marginBottom: 20,
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
    fontWeight: '500',
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  searchBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
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
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  faqIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    lineHeight: 21,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  faqAnswer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  answerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  faqAnswerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  contactIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  contactMethods: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactMethodText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  contactMethodDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
  },
});

export default HelpCenterScreen;