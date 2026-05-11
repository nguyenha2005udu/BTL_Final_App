import { Slot } from "expo-router";

/**
 * Root layout cho Expo Router.
 * Toàn bộ navigation (Stack + Tab) được xử lý bởi app/(tabs)/index.tsx
 * thông qua React Navigation. Layout này chỉ cần render <Slot />.
 */
export default function RootLayout() {
  return <Slot />;
}
