import * as React from 'react';
import type { Transaction } from '@services/transaction.service'; // chỉnh path nếu khác

export type ReportPeriod = 'week' | 'month';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Tuần bắt đầu từ Thứ 2
const getThisWeekRange = (now = new Date()) => {
  const d = startOfDay(now);
  const day = d.getDay(); // 0=CN
  const diffToMon = day === 0 ? 6 : day - 1;

  const from = new Date(d);
  from.setDate(d.getDate() - diffToMon);

  const to = new Date(from);
  to.setDate(from.getDate() + 6);

  return { from: startOfDay(from), to: endOfDay(to) };
};

const getThisMonthRange = (now = new Date()) => {
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: startOfDay(from), to: endOfDay(to) };
};

const getTxMs = (t: any) => {
  const v = t?.date ?? t?.createdAt;
  if (!v) return NaN;
  if (typeof v?.toDate === 'function') return v.toDate().getTime(); // Firestore Timestamp
  const d = v instanceof Date ? v : new Date(v);
  return d.getTime();
};

const getTxAmount = (t: any) => {
  if (typeof t?.mount === 'number') return Math.abs(t.mount);
  if (typeof t?.amount === 'number') return Math.abs(t.amount);
  const n = Number(t?.mount ?? t?.amount ?? 0);
  return Number.isFinite(n) ? Math.abs(n) : 0;
};

export const useReportTotals = (transactions: Transaction[]) => {
  const [period, setPeriod] = React.useState<ReportPeriod>('month');

  const range = React.useMemo(() => {
    const now = new Date();
    return period === 'week' ? getThisWeekRange(now) : getThisMonthRange(now);
  }, [period]);

  const txInRange = React.useMemo(() => {
    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();

    return (transactions ?? []).filter(t => {
      const ms = getTxMs(t);
      return Number.isFinite(ms) && ms >= fromMs && ms <= toMs;
    });
  }, [transactions, range]);

  const totals = React.useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of txInRange) {
      const money = getTxAmount(t);
      if (t.type === 'income') totalIncome += money;
      else totalExpense += money;
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [txInRange]);

  return { period, setPeriod, txInRange, range, ...totals };
};
