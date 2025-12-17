import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export type PieItem = {
  id: string;
  name?: string;
  value: number;
  color: string;
};

type Props = {
  items: PieItem[];               // đã lọc theo expense/income + period
  size?: number;                  // đường kính
  thickness?: number;             // độ dày donut
  theme: any;
  centerLabel: string;            // "Tổng chi" / "Tổng thu"
  centerValue: string;            // "1,234,000₫"
  emptyLabel?: string;            // khi total=0
};

const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const donutPath = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
) => {
  const o1 = polar(cx, cy, rOuter, startAngle);
  const o2 = polar(cx, cy, rOuter, endAngle);
  const i2 = polar(cx, cy, rInner, endAngle);
  const i1 = polar(cx, cy, rInner, startAngle);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ');
};

export const ReportPieChart: React.FC<Props> = ({
  items,
  size = 190,
  thickness = 26,
  theme,
  centerLabel,
  centerValue,
  emptyLabel = 'Chưa có dữ liệu',
}) => {
  const total = React.useMemo(
    () => items.reduce((s, it) => s + (Number(it.value) || 0), 0),
    [items]
  );

  const rOuter = size / 2;
  const rInner = rOuter - thickness;
  const cx = rOuter;
  const cy = rOuter;

  const slices = React.useMemo(() => {
    if (total <= 0) return [];
    const nonZero = items.filter(i => i.value > 0);

    // để lát cắt nhìn “gọn”: sort lớn -> nhỏ
    const sorted = [...nonZero].sort((a, b) => b.value - a.value);

    const gap = 1.2; // độ hở giữa lát (độ)
    let start = 0;

    return sorted.map(it => {
      const sweep = (it.value / total) * 360;
      const s = start + gap / 2;
      const e = start + sweep - gap / 2;
      start += sweep;

      // nếu lát quá nhỏ thì khỏi gap cho khỏi “mất” lát
      const safeS = sweep < 3 ? start - sweep : s;
      const safeE = sweep < 3 ? start : e;

      return {
        id: it.id,
        color: it.color,
        d: donutPath(cx, cy, rOuter, rInner, safeS, safeE),
      };
    });
  }, [items, total, cx, cy, rOuter, rInner]);

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G>
            {/* nền vòng khi empty */}
            {total <= 0 ? (
              <Path
                d={donutPath(cx, cy, rOuter, rInner, 0, 359.99)}
                fill={theme.divider}
              />
            ) : (
              slices.map(s => <Path key={s.id} d={s.d} fill={s.color} />)
            )}
          </G>
        </Svg>

        <View style={[styles.center, { width: size, height: size }]}>
          <Text style={[styles.centerLabel, { color: theme.textSecondary }]}>
            {total > 0 ? centerLabel : emptyLabel}
          </Text>
          <Text style={[styles.centerValue, { color: theme.textPrimary }]} numberOfLines={1}>
            {total > 0 ? centerValue : '0₫'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  centerLabel: { fontSize: 13, fontWeight: '600' },
  centerValue: { marginTop: 6, fontSize: 18, fontWeight: '800' },
});
