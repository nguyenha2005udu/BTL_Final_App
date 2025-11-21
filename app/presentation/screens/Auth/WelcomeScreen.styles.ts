import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB', // bg-background-light
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59,130,246,0.15)', // primary/20
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    color: '#2563EB', // primary
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111418',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#60708a',
    textAlign: 'center',
  },
  main: {
    flexGrow: 1,
    justifyContent: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111418',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#60708a',
  },
  buttonGroup: {
    flexDirection: 'column',
  },
  button: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonOutlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonOutlinedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111418',
  },
  buttonPrimary: {
    backgroundColor: '#2563EB', // primary
  },
  buttonPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  fbIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbIconText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default styles;
