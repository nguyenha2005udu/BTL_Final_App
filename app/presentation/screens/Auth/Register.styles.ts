import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },

  // Form
  form: {
    gap: 20,
  },
  // field = 1 nhóm label + input
  field: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
  },

  // icon bên trái trong input
  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },

  // nút mắt hiện/ẩn mật khẩu bên phải
  passwordToggle: {
    marginLeft: 8,
  },

  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  footer: {
    padding: 24,
    gap: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  linkText: {
    fontWeight: '600',
    color: '#3c83f6',
  },
  submitButton: {
    backgroundColor: '#3c83f6',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
