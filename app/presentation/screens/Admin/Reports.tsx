import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;
const GREEN = '#2d6a4f';
const GREEN_DARK = '#1b4332';
const GREEN_LIGHT = '#95d5b2';

// --- Simple Line Chart ---
const LineChart = () => {
  const data = [30, 45, 38, 55, 60, 52, 70, 80, 72, 90, 85, 95];
  const W = SCREEN_WIDTH - 48;
  const H = 110;
  const pad = { top: 10, bottom: 20, left: 4, right: 4 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((v - min) / (max - min)) * chartH,
  }));
  const linePath = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `C${(pts[i-1].x+p.x)/2},${pts[i-1].y} ${(pts[i-1].x+p.x)/2},${p.y} ${p.x},${p.y}`)).join(' ');
  const areaPath = linePath + ` L${pts[pts.length-1].x},${H-pad.bottom} L${pts[0].x},${H-pad.bottom} Z`;
  const months = ['THÁNG 1','THÁNG 2','THÁNG 3','THÁNG 4','THÁNG 5','THÁNG 6'];

  return (
    <View>
      <Svg width={W} height={H}>
        <Defs>
          <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={GREEN} stopOpacity="0.25" />
            <Stop offset="1" stopColor={GREEN} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#area)" />
        <Path d={linePath} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {[3, 7, 11].map(i => (
          <Circle key={i} cx={pts[i].x} cy={pts[i].y} r="4" fill="#fff" stroke={GREEN} strokeWidth="2" />
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
        {months.map(m => (
          <Text key={m} style={styles.chartLabel}>{m}</Text>
        ))}
      </View>
    </View>
  );
};

// --- Donut Chart ---
const DonutChart = () => {
  const SIZE = 130;
  const R = 48;
  const STROKE = 18;
  const cx = SIZE / 2, cy = SIZE / 2;
  const circ = 2 * Math.PI * R;
  const active = circ * 0.95;
  const locked = circ * 0.05;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={SIZE} height={SIZE}>
        {/* locked (red) — drawn first so it's "behind" */}
        <Circle cx={cx} cy={cy} r={R} fill="none" stroke="#e63946" strokeWidth={STROKE}
          strokeDasharray={`${locked} ${circ - locked}`}
          strokeDashoffset={-active}
          strokeLinecap="round"
          rotation="-90" origin={`${cx},${cy}`}
        />
        {/* active (green) */}
        <Circle cx={cx} cy={cy} r={R} fill="none" stroke={GREEN} strokeWidth={STROKE}
          strokeDasharray={`${active} ${circ - active}`}
          strokeLinecap="round"
          rotation="-90" origin={`${cx},${cy}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.donutValue}>1.2k+</Text>
          <Text style={styles.donutSub}>TỔNG</Text>
        </View>
      </View>
    </View>
  );
};

// --- Animated Progress Bar ---
const ProgressBar = ({ label, percent, color, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: percent, duration: 900, delay, useNativeDriver: false }).start();
  }, []);
  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color }]}>{label}</Text>
        <Text style={styles.progressPercent}>{percent}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const NAV = [
  { key: 'dashboard', label: 'DASHBOARD', icon: '⊞' },
  { key: 'users', label: 'NGƯỜI DÙNG', icon: '👥' },
  { key: 'stats', label: 'THỐNG KÊ', icon: '📊' },
  { key: 'profile', label: 'HỒ SƠ', icon: '👤' },
];

export default function StatsScreen() {
  const [activeNav, setActiveNav] = useState('stats');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN_DARK} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerMenuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê Hệ thống</Text>
        <TouchableOpacity style={styles.bellWrap}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stat Cards Row 1 */}
        <View style={styles.cardRow}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>TỔNG NGƯỜI DÙNG</Text>
            <Text style={styles.cardValue}>1,284</Text>
            <Text style={styles.cardPositive}>↑ +5% tháng này</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>NGƯỜI DÙNG MỚI</Text>
            <Text style={styles.cardValue}>156</Text>
            <Text style={styles.cardMuted}>Tháng này</Text>
          </View>
        </View>

        {/* Stat Cards Row 2 */}
        <View style={styles.cardRow}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>TỶ LỆ HOẠT ĐỘNG</Text>
            <Text style={styles.cardValue}>85%</Text>
            <View style={styles.miniBar}>
              <View style={[styles.miniBarFill, { width: '85%' }]} />
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>TÀI KHOẢN BỊ KHÓA</Text>
            <Text style={styles.cardValue}>12</Text>
            <Text style={styles.cardWarning}>⚠ Cần kiểm tra</Text>
          </View>
        </View>

        {/* Line Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Tăng trưởng người dùng</Text>
            <Text style={styles.chartPeriod}>6 tháng qua</Text>
          </View>
          <LineChart />
        </View>

        {/* Donut Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Trạng thái tài khoản</Text>
          <DonutChart />
          <View style={styles.donutLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: GREEN }]} />
              <Text style={styles.legendText}>Hoạt động (95%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#e63946' }]} />
              <Text style={styles.legendText}>Bị khóa (5%)</Text>
            </View>
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Danh mục hoạt động nhất</Text>
          <View style={{ marginTop: 12 }}>
            <ProgressBar label="ĂN UỐNG" percent={42} color={GREEN} delay={0} />
            <ProgressBar label="DI CHUYỂN" percent={28} color="#2196f3" delay={150} />
            <ProgressBar label="MUA SẮM" percent={15} color="#f9a825" delay={300} />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {NAV.map(item => (
          <TouchableOpacity key={item.key} style={styles.navItem} onPress={() => setActiveNav(item.key)}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, activeNav === item.key && styles.navLabelActive]}>
              {item.label}
            </Text>
            {activeNav === item.key && <View style={styles.navIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f2f0' },

  header: {
    backgroundColor: GREEN_DARK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerMenuIcon: { fontSize: 22, color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  bellWrap: { position: 'relative' },
  bellIcon: { fontSize: 22 },
  bellDot: {
    position: 'absolute', top: -2, right: -2,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#e63946',
    borderWidth: 1.5, borderColor: GREEN_DARK,
  },

  scroll: { padding: 16, paddingBottom: 24 },

  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 10, color: '#999', fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  cardValue: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  cardPositive: { fontSize: 12, color: '#2d9c5a', fontWeight: '600' },
  cardMuted: { fontSize: 12, color: '#bbb' },
  cardWarning: { fontSize: 12, color: '#e63946', fontWeight: '600' },
  miniBar: {
    height: 5, backgroundColor: '#eee', borderRadius: 4, marginTop: 8,
  },
  miniBarFill: {
    height: 5, backgroundColor: GREEN, borderRadius: 4,
  },

  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  chartPeriod: { fontSize: 12, color: '#aaa' },
  chartLabel: { fontSize: 9, color: '#bbb', fontWeight: '600' },

  donutValue: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  donutSub: { fontSize: 10, color: '#aaa', fontWeight: '700', letterSpacing: 1 },
  donutLegend: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#555' },

  progressRow: { marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  progressPercent: { fontSize: 13, color: '#555', fontWeight: '600' },
  progressTrack: { height: 7, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 7, borderRadius: 4 },

  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 18, marginBottom: 3 },
  navLabel: { fontSize: 9, color: '#bbb', fontWeight: '700', letterSpacing: 0.3 },
  navLabelActive: { color: GREEN },
  navIndicator: {
    position: 'absolute', bottom: -8, width: 24, height: 3,
    backgroundColor: GREEN, borderRadius: 2,
  },
});