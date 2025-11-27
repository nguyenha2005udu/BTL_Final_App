import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { useTheme } from '../../../context/ThemeContext';

const HelpCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Làm thế nào để thêm giao dịch?',
      answer: 'Nhấn vào nút "+" ở góc dưới bên phải màn hình chính, chọn loại giao dịch (Thu/Chi), nhập số tiền, chọn danh mục và thêm ghi chú nếu cần.'
    },
    {
      question: 'Làm sao để xem báo cáo chi tiêu?',
      answer: 'Vào tab "Báo cáo" ở thanh menu dưới cùng. Bạn có thể xem chi tiêu theo tuần, tháng hoặc tùy chọn thời gian.'
    },
    {
      question: 'Tôi có thể tạo mục tiêu tiết kiệm không?',
      answer: 'Có! Vào màn hình Mục tiêu, nhấn "Tạo mục tiêu mới", nhập tên, số tiền mục tiêu và thời hạn. Bạn có thể theo dõi tiến độ và nạp/rút tiền bất cứ lúc nào.'
    },
    {
      question: 'Làm thế nào để đổi mật khẩu?',
      answer: 'Vào Profile → Đổi mật khẩu. Nhập mật khẩu hiện tại và mật khẩu mới, sau đó xác nhận.'
    },
    {
      question: 'Dữ liệu của tôi có được sao lưu không?',
      answer: 'Có, tất cả dữ liệu được tự động đồng bộ và sao lưu trên cloud. Bạn có thể đăng nhập trên nhiều thiết bị để truy cập dữ liệu.'
    },
    {
      question: 'Tôi có thể xuất dữ liệu không?',
      answer: 'Có! Vào màn hình Báo cáo, chọn "Xuất CSV" hoặc "Xuất PDF" để tải dữ liệu về máy.'
    },
    {
      question: 'Làm sao để xóa tài khoản?',
      answer: 'Liên hệ với chúng tôi qua email support@expensetracker.com để yêu cầu xóa tài khoản. Lưu ý: dữ liệu sẽ bị xóa vĩnh viễn.'
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Trung tâm Trợ giúp</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.searchCard, { backgroundColor: theme.cardBackground }]}>
          <MaterialIcons name="search" size={24} color={theme.textSecondary} />
          <Text style={[styles.searchText, { color: theme.textSecondary }]}>Tìm kiếm câu hỏi...</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Câu hỏi thường gặp</Text>

        {faqs.map((faq, index) => (
          <View key={index} style={[styles.faqCard, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>{faq.question}</Text>
              <MaterialIcons 
                name={expandedIndex === index ? "expand-less" : "expand-more"} 
                size={24} 
                color={theme.textSecondary} 
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={[styles.faqAnswer, { borderTopColor: theme.border }]}>
                <Text style={[styles.faqAnswerText, { color: theme.textSecondary }]}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={[styles.contactCard, { backgroundColor: isDarkMode ? '#1e3a5f' : '#EFF6FF' }]}>
          <MaterialIcons name="help-outline" size={40} color="#3c83f6" />
          <Text style={[styles.contactTitle, { color: theme.textPrimary }]}>Không tìm thấy câu trả lời?</Text>
          <Text style={[styles.contactSubtitle, { color: theme.textSecondary }]}>
            Liên hệ với chúng tôi để được hỗ trợ trực tiếp
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('ContactSupport')}
          >
            <Text style={styles.contactButtonText}>Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
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
  searchCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 24, gap: 12 },
  searchText: { fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  faqCard: { borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { fontSize: 16, fontWeight: '600', flex: 1, paddingRight: 8 },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, paddingTop: 12 },
  faqAnswerText: { fontSize: 14, lineHeight: 22 },
  contactCard: { borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 24 },
  contactTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
  contactSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  contactButton: { backgroundColor: '#3c83f6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  contactButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default HelpCenterScreen;