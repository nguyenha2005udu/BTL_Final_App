import { StyleSheet } from 'react-native';

const PRIMARY = '#3c83f6';
const PRIMARY_DARK = '#2563EB';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  titleBlock: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  inputIcon: {
    position: 'absolute',
    left: 14,
    top: 14,
  },

  input: {
    paddingLeft: 44,
    paddingRight: 44,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },

  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },
  submitButton: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#6B7280',
  },
  footerLink: {
    fontWeight: '700',
    color: PRIMARY,
  },
});