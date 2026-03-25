// presentation/screens/Admin/DashboardScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
  StatusBar, Animated, Dimensions,
} from 'react-native';
import Svg, {
  Rect, Circle, Path, Defs, LinearGradient, Stop,
} from 'react-native-svg';

const { width: SW } = Dimensions.get('window');
const GREEN = '#1db87a';
const GREEN_LIGHT = '#b7f5d8';
const GREEN_DARK = '#0e9e62';
const RED = '#e63946';

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BAR_DATA = [
  { label: 'JAN', value: 35 },
  { label: 'FEB', value: 55 },
  { label: 'MAR', value: 48 },
  { label: 'APR', value: 68 },
  { label: 'MAY', value: 80 },
  { label: 'JUN', value: 95 },
];

const BarChart = () => {
  const anims = useRef(BAR_DATA.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(80, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: false, tension: 60, friction: 8 })
    )).start();
  }, []);

  const W = SW - 64;
  const H = 180;
  const barW = (W / BAR_DATA.length) * 0.55;
  const maxVal = Math.max(...BAR_DATA.map(d => d.value));

  return (
    <View style={{ height: H + 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: H, width: W }}>
        {BAR_DATA.map((d, i) => {
          const isLast = i === BAR_DATA.length - 1;
          const pct = d.value / maxVal;
          const barH = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, H * pct] });
          const slotW = W / BAR_DATA.length;
          return (
            <View key={d.label} style={{ width: slotW, alignItems: 'center', justifyContent: 'flex-end', height: H }}>
              <Animated.View style={{
                width: barW, height: barH, borderRadius: 6,
                backgroundColor: isLast ? GREEN_DARK : i >= 4 ? GREEN : GREEN_LIGHT,
                overflow: 'hidden',
              }} />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', width: W, marginTop: 6 }}>
        {BAR_DATA.map((d) => (
          <View key={d.label} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.barLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const DonutChart = () => {
  const SIZE = 160;
  const R = 60;
  const STROKE = 20;
  const cx = SIZE / 2, cy = SIZE / 2;
  const circ = 2 * Math.PI * R;
  const activePct = 0.85;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {/* track */}
          <Circle cx={cx} cy={cy} r={R} fill="none" stroke="#eee" strokeWidth={STROKE} />
          {/* locked red */}
          <Circle cx={cx} cy={cy} r={R} fill="none" stroke={RED}
            strokeWidth={STROKE}
            strokeDasharray={`${circ * 0.15} ${circ * 0.85}`}
            strokeDashoffset={-(circ * activePct)}
            strokeLinecap="round"
            rotation="-90" origin={`${cx},${cy}`}
          />
          {/* active green */}
          <Circle cx={cx} cy={cy} r={R} fill="none" stroke={GREEN}
            strokeWidth={STROKE}
            strokeDasharray={`${circ * activePct} ${circ * 0.15}`}
            strokeLinecap="round"
            rotation="-90" origin={`${cx},${cy}`}
          />
        </Svg>
        <View style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.donutValue}>1.2k</Text>
            <Text style={styles.donutSub}>USERS</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, label, value }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <View style={{ marginLeft: 14 }}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const [period, setPeriod] = useState('Last 6 Months');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f5f7" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Text style={{ fontSize: 20, color: '#444' }}>☰</Text>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search users, logs..."
            placeholderTextColor="#bbb"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
          <View style={styles.bellDot} />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={{ fontSize: 18 }}>👤</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stat Cards */}
        <StatCard icon="👥" iconBg="#eaf0fb" label="Total Users" value="1,284" />
        <StatCard icon="✅" iconBg="#e6faf2" label="Active Users" value="1,120" />
        <StatCard icon="🔒" iconBg="#fde8e8" label="Locked Users" value="164" />
        <StatCard icon="🏷️" iconBg="#fff4e6" label="Total Categories" value="42" />

        {/* Bar Chart Card */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>User Growth by{'\n'}Month</Text>
            <TouchableOpacity style={styles.periodBtn}>
              <Text style={styles.periodText}>{period}  ▾</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 16 }}>
            <BarChart />
          </View>
        </View>

        {/* Donut Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Status Distribution</Text>
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <DonutChart />
          </View>
          <View style={styles.legendBox}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: GREEN }]} />
              <Text style={styles.legendLabel}>Active Accounts</Text>
              <Text style={styles.legendPct}>85%</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: RED }]} />
              <Text style={styles.legendLabel}>Locked Accounts</Text>
              <Text style={styles.legendPct}>15%</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f5f7' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f4f5f7',
    gap: 10,
  },
  menuBtn: { padding: 4 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 7,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },
  bellBtn: { position: 'relative', padding: 4 },
  bellDot: {
    position: 'absolute', top: 2, right: 2,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: RED, borderWidth: 1.5, borderColor: '#f4f5f7',
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#e0c9a6', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },

  scroll: { paddingHorizontal: 16, paddingBottom: 28, gap: 12 },

  statCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  iconBox: {
    width: 46, height: 46, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 22 },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 3 },
  statValue: { fontSize: 26, fontWeight: '800', color: '#1a1a1a' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', lineHeight: 22 },
  periodBtn: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#fafafa',
  },
  periodText: { fontSize: 12, color: '#555', fontWeight: '500' },
  barLabel: { fontSize: 10, color: '#aaa', fontWeight: '600' },

  donutValue: { fontSize: 26, fontWeight: '800', color: '#1a1a1a' },
  donutSub: { fontSize: 10, color: '#aaa', fontWeight: '700', letterSpacing: 1 },

  legendBox: { marginTop: 20, gap: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 11, height: 11, borderRadius: 6, marginRight: 10 },
  legendLabel: { flex: 1, fontSize: 14, color: '#444' },
  legendPct: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
});