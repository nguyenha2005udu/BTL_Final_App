import * as React from 'react';
import type { Transaction } from '../app/services/transaction.service'; // chỉnh path nếu khác

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

export const useReportTotals = (transactions: Transaction[]) => {
  const [period, setPeriod] = React.useState<ReportPeriod>('month');

  const range = React.useMemo(() => {
    const now = new Date();
    return period === 'week' ? getThisWeekRange(now) : getThisMonthRange(now);
  }, [period]);

  const txInRange = React.useMemo(() => {
    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();
    return transactions.filter(t => {
      const ms = t.date.getTime();
      return ms >= fromMs && ms <= toMs;
    });
  }, [transactions, range]);

  const totals = React.useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of txInRange) {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [txInRange]);

  return { period, setPeriod, txInRange, range, ...totals };
};