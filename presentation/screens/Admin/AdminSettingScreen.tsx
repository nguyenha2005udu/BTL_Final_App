
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCurrentUserProfile, logoutUser } from "@services/auth.service";
import { auth } from "@services/firebase/firebaseConfig";
import { FONT_SIZE, RADIUS, SPACING } from "@/utils/responsive";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_vMSFQARLvGWesaN0bPwdT0TwBkCjQuK-p1dyFrGdqF-NhAqX3D22UFhPgycZkrUA24cKIcSZEPLOfhmUcNZTvYIXtJBvgXlaRUnPVCaQ5zWzrC0n45kOlTptHz4fEKjcJrTwoasD3u6BnAo6DO1bJ2oe7sNZMz4X8J4ZExMW6HBrFk1JAZloRwzDfjdw4WOSE8HcBg82M53Zk1lZ9igZ6sqHdz0lO3Cvw1h6_YE38kL45oHN1DtJsD26XLF9ECZDyI3c-2ms-qO0";

export default function AdminSettingScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState<string>("Admin");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const isSmall = width < 360;
  const avatarSize = isSmall ? 64 : 72;
  const tabIconSize = isSmall ? 18 : 22;
  const menuIconSize = isSmall ? 20 : 22;
  const menuBoxSize = isSmall ? 40 : 44;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();

        if (profile?.fullName) {
          setDisplayName(profile.fullName);
        } else if (auth.currentUser?.email) {
          setDisplayName(auth.currentUser.email.split("@")[0]);
        }

        setEmail(auth.currentUser?.email || "");

        if (profile?.photoUrl && profile.photoUrl.trim() !== "") {
          setAvatarUrl(profile.photoUrl);
        } else if (auth.currentUser?.photoURL) {
          setAvatarUrl(auth.currentUser.photoURL);
        } else {
          setAvatarUrl(null);
        }
      } catch (error) {
        console.log("LOAD PROFILE ERROR >>>", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await logoutUser();
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: "TÀI KHOẢN",
      items: [
        {
          icon: "person" as const,
          iconColor: "#3B82F6",
          iconBg: "#EFF6FF",
          label: "Cập nhật thông tin cá nhân",
          onPress: () => navigation.navigate("UpdateProfile"),
        },
        {
          icon: "lock" as const,
          iconColor: "#10B981",
          iconBg: "#DCFCE7",
          label: "Đổi mật khẩu",
          onPress: () => navigation.navigate("ChangePassword"),
        },
        {
          icon: "security" as const,
          iconColor: "#EF4444",
          iconBg: "#FEE2E2",
          label: "Bảo mật và chính sách",
          onPress: () => navigation.navigate("SecurityPolicy"),
        },
      ],
    },
    {
      title: "HỖ TRỢ",
      items: [
        {
          icon: "help-outline" as const,
          iconColor: "#3B82F6",
          iconBg: "#EFF6FF",
          label: "Trung tâm trợ giúp",
          onPress: () => navigation.navigate("HelpCenter"),
        },
        {
          icon: "headset-mic" as const,
          iconColor: "#06B6D4",
          iconBg: "#CFFAFE",
          label: "Liên hệ để được hỗ trợ",
          onPress: () => navigation.navigate("ContactSupport"),
        },
        {
          icon: "star" as const,
          iconColor: "#F59E0B",
          iconBg: "#FEF3C7",
          label: "Đánh giá ứng dụng",
          onPress: () => navigation.navigate("RateApp"),
        },
      ],
    },
    {
      title: "QUẢN TRỊ",
      items: [
        {
          icon: "people" as const,
          iconColor: "#8B5CF6",
          iconBg: "#F5F3FF",
          label: "Quản lý người dùng",
          onPress: () => navigation.navigate("AdminUserManagement"),
        },
        {
          icon: "dashboard" as const,
          iconColor: "#EC4899",
          iconBg: "#FDF2F8",
          label: "Quản lý danh mục",
          onPress: () => navigation.navigate("AdminCategories"),
        },
        {
          icon: "bar-chart" as const,
          iconColor: "#14B8A6",
          iconBg: "#F0FDFA",
          label: "Thống kê hệ thống",
          onPress: () => navigation.navigate("AdminStatistic"),
        },
      ],
    },
  ];

  const bottomPad = insets.bottom + 60;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cá nhân</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: avatarUrl || DEFAULT_AVATAR }}
            style={[
              styles.avatar,
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
            ]}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{email}</Text>
            <View style={styles.adminBadge}>
              <MaterialIcons name="verified" size={13} color="#D97706" />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <MaterialIcons name="edit" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIdx) => (
          <View key={sectionIdx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, itemIdx) => (
                <View key={itemIdx}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuLeft}>
                      <View
                        style={[
                          styles.menuIconBox,
                          { backgroundColor: item.iconBg, width: menuBoxSize, height: menuBoxSize },
                        ]}
                      >
                        <MaterialIcons
                          name={item.icon}
                          size={menuIconSize}
                          color={item.iconColor}
                        />
                      </View>
                      <Text style={styles.menuLabel} numberOfLines={1}>{item.label}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                  </TouchableOpacity>

                  {itemIdx < section.items.length - 1 && (
                    <View style={[styles.menuDivider, { marginLeft: menuBoxSize + SPACING.xl }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.footer, { paddingBottom: SPACING.sm }]}>
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminUserManagement")}
        >
          <MaterialIcons name="admin-panel-settings" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Quản lý</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminCategories")}
        >
          <MaterialIcons name="dashboard" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Danh mục</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminStatistic")}
        >
          <MaterialIcons name="bar-chart" size={tabIconSize} color="#94A3B8" />
          <Text style={styles.footerText}>Thống kê</Text>
        </TouchableOpacity>

        <View style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="person" size={tabIconSize} color="#3B82F6" />
          <Text style={styles.activeFooterText}>Cá nhân</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FONT_SIZE.titleLg,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    borderWidth: 3,
    borderColor: "#3B82F6",
    marginRight: SPACING.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZE.title,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: FONT_SIZE.body,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: SPACING.sm,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  adminBadgeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
    color: "#D97706",
  },
  editButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: SPACING.md,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  menuIconBox: {
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: FONT_SIZE.bodyLg,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#EF4444",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  activeFooterTab: {
    backgroundColor: "#EFF6FF",
  },
  footerText: {
    color: "#94A3B8",
    fontSize: FONT_SIZE.caption,
    fontWeight: "600",
  },
  activeFooterText: {
    color: "#3B82F6",
    fontSize: FONT_SIZE.caption,
    fontWeight: "700",
  },
});
