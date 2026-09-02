import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  GraduationCap,
  ReceiptText,
  HeartPulse,
  Radio,
  Tv,
  Plane,
  Sparkles,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Gift,
  Coins,
  Banknote,
  Landmark,
  CreditCard,
  Smartphone,
  Wallet,
  Palmtree,
  ShieldCheck,
  Film,
  Wifi,
  Music,
  Zap,
  PiggyBank,
  Target,
  BarChart3,
  Receipt,
  LucideProps,
} from 'lucide-react';

export type IconName =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'education'
  | 'bills'
  | 'health'
  | 'subscription'
  | 'travel'
  | 'other_expense'
  | 'salary'
  | 'freelance'
  | 'business'
  | 'investment'
  | 'gift'
  | 'other_income'
  | 'cash'
  | 'bca'
  | 'dana'
  | 'gopay'
  | 'bank'
  | 'card'
  | 'wallet'
  | 'phone'
  | 'laptop'
  | 'vacation'
  | 'shield'
  | 'netflix'
  | 'wifi'
  | 'spotify'
  | string;

interface IconMapperProps extends Omit<LucideProps, 'ref'> {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  // Categories - Expense
  food: Utensils,
  utensils: Utensils,
  makanan: Utensils,
  transport: Car,
  car: Car,
  transportasi: Car,
  shopping: ShoppingBag,
  belanja: ShoppingBag,
  entertainment: Gamepad2,
  hiburan: Gamepad2,
  game: Gamepad2,
  education: GraduationCap,
  pendidikan: GraduationCap,
  book: GraduationCap,
  bills: ReceiptText,
  tagihan: ReceiptText,
  receipt: ReceiptText,
  health: HeartPulse,
  kesehatan: HeartPulse,
  subscription: Tv,
  langganan: Radio,
  tv: Tv,
  travel: Plane,
  perjalanan: Plane,
  flight: Plane,
  other_expense: Sparkles,
  lainnya: Sparkles,
  sparkles: Sparkles,

  // Categories - Income
  salary: Briefcase,
  gaji: Briefcase,
  freelance: Laptop,
  business: Building2,
  bisnis: Building2,
  investment: TrendingUp,
  investasi: TrendingUp,
  gift: Gift,
  hadiah: Gift,
  other_income: Sparkles,

  // Accounts
  cash: Banknote,
  tunai: Banknote,
  banknote: Banknote,
  money: Banknote,
  bca: Landmark,
  bank: Landmark,
  landmark: Landmark,
  dana: CreditCard,
  creditcard: CreditCard,
  card: CreditCard,
  gopay: Smartphone,
  smartphone: Smartphone,
  phone: Smartphone,
  wallet: Wallet,

  // Goals
  'laptop-goal': Laptop,
  bali: Palmtree,
  beach: Palmtree,
  vacation: Palmtree,
  liburan: Palmtree,
  palmtree: Palmtree,
  emergency: ShieldCheck,
  darurat: ShieldCheck,
  shield: ShieldCheck,

  // Upcoming bills / Services
  netflix: Film,
  film: Film,
  wifi: Wifi,
  internet: Wifi,
  spotify: Music,
  music: Music,

  // Quick navigation / Dash
  transactions: Receipt,
  accounts: Landmark,
  budget: PiggyBank,
  goals: Target,
  analytics: BarChart3,
  zap: Zap,
};

// Emoji fallback mapper in case legacy strings are passed
const emojiToIconMap: Record<string, React.ComponentType<LucideProps>> = {
  '💵': Banknote,
  '🏦': Landmark,
  '💳': CreditCard,
  '📱': Smartphone,
  '🍔': Utensils,
  '🚗': Car,
  '🛍️': ShoppingBag,
  '🛍': ShoppingBag,
  '🎮': Gamepad2,
  '📚': GraduationCap,
  '📄': ReceiptText,
  '❤️': HeartPulse,
  '📡': Radio,
  '✈️': Plane,
  '✈': Plane,
  '💫': Sparkles,
  '💼': Briefcase,
  '💻': Laptop,
  '🏢': Building2,
  '📈': TrendingUp,
  '🎁': Gift,
  '🏖️': Palmtree,
  '🏖': Palmtree,
  '🛡️': ShieldCheck,
  '🛡': ShieldCheck,
  '💸': Coins,
  '📊': BarChart3,
  '✨': Sparkles,
  '🎬': Film,
  '🌐': Wifi,
  '🎵': Music,
};

export default function IconMapper({
  name,
  size = 18,
  className = '',
  color,
  strokeWidth = 2,
  ...props
}: IconMapperProps) {
  const normalizedKey = name.toLowerCase().trim();

  // Try direct key mapping
  let IconComponent = iconMap[normalizedKey];

  // If not found, check emoji map
  if (!IconComponent) {
    IconComponent = emojiToIconMap[name] || emojiToIconMap[normalizedKey];
  }

  // Fallback to Sparkles or Coins if unknown
  if (!IconComponent) {
    IconComponent = Sparkles;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
