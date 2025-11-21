import { Transaction, Goal, Category } from '../app/type/types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Ăn trưa bạn bè',
    subtitle: 'Hôm nay',
    amount: -250000,
    date: '2024-05-30',
    icon: 'restaurant',
    colorClass: 'text-primary bg-primary/10',
    type: 'expense',
  },
  {
    id: '2',
    title: 'Lương tháng 5',
    subtitle: 'Hôm qua',
    amount: 15000000,
    date: '2024-05-29',
    icon: 'payments',
    colorClass: 'text-accent-green bg-accent-green/10',
    type: 'income',
  },
  {
    id: '3',
    title: 'Mua sắm online',
    subtitle: '28 Thg 5, 2024',
    amount: -1200000,
    date: '2024-05-28',
    icon: 'shopping_bag',
    colorClass: 'text-primary bg-primary/10',
    type: 'expense',
  },
  {
    id: '4',
    title: 'Cà phê Highland',
    subtitle: '25 Th10',
    amount: -55000,
    date: '2023-10-25',
    icon: 'coffee',
    colorClass: 'text-gray-700 bg-gray-100',
    type: 'expense',
  },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Mua iPad',
    savedAmount: 6000000,
    targetAmount: 10000000,
    status: 'ongoing',
    deadline: '24 Thg 7, 2025',
    color: 'primary',
  },
  {
    id: '2',
    title: 'Quỹ khẩn cấp',
    savedAmount: 10000000,
    targetAmount: 10000000,
    status: 'completed',
    color: 'accent-green',
  },
  {
    id: '3',
    title: 'Mua iPhone mới',
    savedAmount: 5000000,
    targetAmount: 25000000,
    status: 'cancelled',
    deadline: '01 Thg 1, 2026',
    color: 'gray-400',
  },
];

export const ICONS = [
  'restaurant', 'local_cafe', 'bakery_dining', 'local_bar', 'cake', 
  'local_pizza', 'icecream', 'shopping_cart', 'directions_car', 
  'directions_bus', 'train', 'flight', 'local_taxi', 'local_gas_station'
];

export const COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', 
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', 
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF'
];
