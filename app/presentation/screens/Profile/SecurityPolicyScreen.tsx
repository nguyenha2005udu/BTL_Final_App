import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { useTheme } from '../../../context/ThemeContext';

const SecurityPolicyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Bảo mật và Chính sách</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Chính sách Bảo mật</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Ứng dụng Expense Tracker cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ tốt nhất.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>1. Thông tin chúng tôi thu thập</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            • Email và thông tin đăng ký{'\n'}
            • Dữ liệu giao dịch thu chi của bạn{'\n'}
            • Thông tin thiết bị và sử dụng ứng dụng
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>2. Cách chúng tôi sử dụng thông tin</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            • Cung cấp và cải thiện dịch vụ{'\n'}
            • Bảo mật tài khoản của bạn{'\n'}
            • Gửi thông báo quan trọng về tài khoản
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>3. Bảo mật dữ liệu</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Dữ liệu của bạn được mã hóa và lưu trữ an toàn trên Firebase. Chúng tôi sử dụng các biện pháp bảo mật hiện đại để bảo vệ thông tin của bạn.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>4. Chia sẻ thông tin</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi được yêu cầu bởi pháp luật.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>5. Quyền của bạn</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Bạn có quyền truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân của mình bất cứ lúc nào thông qua ứng dụng.
          </Text>

          <Text style={[styles.updateText, { color: theme.textSecondary }]}>
            Cập nhật lần cuối: 27/11/2024
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Điều khoản Sử dụng</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Bằng cách sử dụng ứng dụng này, bạn đồng ý với các điều khoản và điều kiện sau:
          </Text>

          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            • Bạn chịu trách nhiệm về tính chính xác của dữ liệu bạn nhập{'\n'}
            • Không sử dụng ứng dụng cho mục đích bất hợp pháp{'\n'}
            • Bảo mật thông tin đăng nhập của bạn{'\n'}
            • Tuân thủ các quy định pháp luật địa phương
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#3c83f6' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Đã hiểu</Text>
        </TouchableOpacity>
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  updateText: { fontSize: 12, marginTop: 16, fontStyle: 'italic' },
  button: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default SecurityPolicyScreen;