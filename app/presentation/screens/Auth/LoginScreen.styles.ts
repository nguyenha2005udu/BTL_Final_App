import { StyleSheet } from 'react-native';

const PRIMARY = '#2563EB';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  titleBlock: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    color: '#6B7280',
  },

  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  // 🔧 SỬA Ở ĐÂY
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },

  // 🔧 BỎ border + background khỏi input
  input: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },

  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 10,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    alignItems: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    fontWeight: '700',
    color: PRIMARY,
  },
});
