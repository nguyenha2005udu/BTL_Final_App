import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../../components/icon';
import { useTheme } from '../../../../context/ThemeContext';

const SecurityPolicyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Bảo mật và Chính sách</Text>
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
            <MaterialIcons name="verified-user" size={32} color="#3B82F6" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
            Cam kết bảo mật
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Thông tin của bạn được bảo vệ bởi các tiêu chuẩn bảo mật cao nhất
          </Text>
        </View>

        {/* Privacy Policy Card */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: isDarkMode ? '#1E3A5F' : '#EFF6FF' }]}>
              <MaterialIcons name="security" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Chính sách Bảo mật</Text>
          </View>

          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Ứng dụng Expense Tracker cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ tốt nhất.
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Thông tin chúng tôi thu thập
              </Text>
            </View>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE' }]}>
                  <MaterialIcons name="check" size={14} color="#3B82F6" />
                </View>
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  Email và thông tin đăng ký
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE' }]}>
                  <MaterialIcons name="check" size={14} color="#3B82F6" />
                </View>
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  Dữ liệu giao dịch thu chi của bạn
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#3B82F6' : '#DBEAFE' }]}>
                  <MaterialIcons name="check" size={14} color="#3B82F6" />
                </View>
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  Thông tin thiết bị và sử dụng ứng dụng
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>2</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Cách chúng tôi sử dụng thông tin
              </Text>
            </View>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#22C55E' : '#DCFCE7' }]}>
                  <MaterialIcons name="check" size={14} color="#22C55E" />
                </View>
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  Cung cấp và cải thiện dịch vụ
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#22C55E' : '#DCFCE7' }]}>
                  <MaterialIcons name="check" size={14} color="#22C55E" />
                </View>
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  Bảo mật tài khoản của bạn
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#22C55E' : '#DCFCE7' }]}>
                  <MaterialIcons name="check" size={14} color="#22C55E" />
                </View>
                <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                  Gửi thông báo quan trọng về tài khoản
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>3</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Bảo mật dữ liệu
              </Text>
            </View>
            <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
              Dữ liệu của bạn được mã hóa và lưu trữ an toàn trên Firebase. Chúng tôi sử dụng các biện pháp bảo mật hiện đại để bảo vệ thông tin của bạn.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>4</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Chia sẻ thông tin
              </Text>
            </View>
            <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
              Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi được yêu cầu bởi pháp luật.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>5</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Quyền của bạn
              </Text>
            </View>
            <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
              Bạn có quyền truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân của mình bất cứ lúc nào thông qua ứng dụng.
            </Text>
          </View>

          <View style={[styles.updateBadge, { 
            backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
            borderColor: isDarkMode ? theme.border : '#E2E8F0'
          }]}>
            <MaterialIcons name="update" size={16} color={theme.textSecondary} />
            <Text style={[styles.updateText, { color: theme.textSecondary }]}>
              Cập nhật lần cuối: 27/11/2024
            </Text>
          </View>
        </View>

        {/* Terms of Service Card */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: isDarkMode ? '#1E3D2E' : '#DCFCE7' }]}>
              <MaterialIcons name="description" size={24} color="#22C55E" />
            </View>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Điều khoản Sử dụng</Text>
          </View>

          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Bằng cách sử dụng ứng dụng này, bạn đồng ý với các điều khoản và điều kiện sau:
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#F59E0B' : '#FEF7E0' }]}>
                <MaterialIcons name="info" size={14} color="#F59E0B" />
              </View>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Bạn chịu trách nhiệm về tính chính xác của dữ liệu bạn nhập
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#F59E0B' : '#FEF7E0' }]}>
                <MaterialIcons name="info" size={14} color="#F59E0B" />
              </View>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Không sử dụng ứng dụng cho mục đích bất hợp pháp
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#F59E0B' : '#FEF7E0' }]}>
                <MaterialIcons name="info" size={14} color="#F59E0B" />
              </View>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Bảo mật thông tin đăng nhập của bạn
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: isDarkMode ? '#F59E0B' : '#FEF7E0' }]}>
                <MaterialIcons name="info" size={14} color="#F59E0B" />
              </View>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Tuân thủ các quy định pháp luật địa phương
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <MaterialIcons name="check-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Đã hiểu</Text>
        </TouchableOpacity>

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
    width: 72,
    height: 72,
    borderRadius: 36,
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
    lineHeight: 20,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    letterSpacing: -0.3,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    marginBottom: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    letterSpacing: -0.2,
  },
  bulletList: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    fontWeight: '500',
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  updateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#3B82F6',
    height: 52,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default SecurityPolicyScreen;