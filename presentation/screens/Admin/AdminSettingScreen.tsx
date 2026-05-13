import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCurrentUserProfile, logoutUser } from "@services/auth.service";
import { auth } from "@services/firebase/firebaseConfig";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_vMSFQARLvGWesaN0bPwdT0TwBkCjQuK-p1dyFrGdqF-NhAqX3D22UFhPgycZkrUA24cKIcSZEPLOfhmUcNZTvYIXtJBvgXlaRUnPVCaQ5zWzrC0n45kOlTptHz4fEKjcJrTwoasD3u6BnAo6DO1bJ2oe7sNZMz4X8J4ZExMW6HBrFk1JAZloRwzDfjdw4WOSE8HcBg82M53Zk1lZ9igZ6sqHdz0lO3Cvw1h6_YE38kL45oHN1DtJsD26XLF9ECZDyI3c-2ms-qO0";

export default function AdminSettingScreen() {
  const navigation = useNavigation<any>();

  const [displayName, setDisplayName] = useState<string>("Admin");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
          iconColor: "#6366F1",
          iconBg: "rgba(99,102,241,0.15)",
          label: "Cập nhật thông tin cá nhân",
          onPress: () => navigation.navigate("UpdateProfile"),
        },
        {
          icon: "lock" as const,
          iconColor: "#10B981",
          iconBg: "rgba(16,185,129,0.15)",
          label: "Đổi mật khẩu",
          onPress: () => navigation.navigate("ChangePassword"),
        },
        {
          icon: "security" as const,
          iconColor: "#EF4444",
          iconBg: "rgba(239,68,68,0.15)",
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
          iconBg: "rgba(59,130,246,0.15)",
          label: "Trung tâm trợ giúp",
          onPress: () => navigation.navigate("HelpCenter"),
        },
        {
          icon: "headset-mic" as const,
          iconColor: "#06B6D4",
          iconBg: "rgba(6,182,212,0.15)",
          label: "Liên hệ để được hỗ trợ",
          onPress: () => navigation.navigate("ContactSupport"),
        },
        {
          icon: "star" as const,
          iconColor: "#F59E0B",
          iconBg: "rgba(245,158,11,0.15)",
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
          iconBg: "rgba(139,92,246,0.15)",
          label: "Quản lý người dùng",
          onPress: () => navigation.navigate("AdminUserManagement"),
        },
        {
          icon: "dashboard" as const,
          iconColor: "#EC4899",
          iconBg: "rgba(236,72,153,0.15)",
          label: "Quản lý danh mục",
          onPress: () => navigation.navigate("AdminCategories"),
        },
        {
          icon: "bar-chart" as const,
          iconColor: "#14B8A6",
          iconBg: "rgba(20,184,166,0.15)",
          label: "Thống kê hệ thống",
          onPress: () => navigation.navigate("AdminStatistic"),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cá nhân</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: avatarUrl || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <View style={styles.adminBadge}>
              <MaterialIcons name="verified" size={14} color="#F59E0B" />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <MaterialIcons name="edit" size={20} color="#6366F1" />
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
                        style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}
                      >
                        <MaterialIcons
                          name={item.icon}
                          size={22}
                          color={item.iconColor}
                        />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#64748B" />
                  </TouchableOpacity>

                  {itemIdx < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
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

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        {/* Quản lý */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminUserManagement")}
        >
          <MaterialIcons name="admin-panel-settings" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Quản lý</Text>
        </TouchableOpacity>

        {/* Danh mục */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminCategories")}
        >
          <MaterialIcons name="dashboard" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Danh mục</Text>
        </TouchableOpacity>

        {/* Thống kê */}
        <TouchableOpacity
          style={styles.footerTab}
          onPress={() => navigation.navigate("AdminStatistic")}
        >
          <MaterialIcons name="bar-chart" size={22} color="#94A3B8" />
          <Text style={styles.footerText}>Thống kê</Text>
        </TouchableOpacity>

        {/* Cá nhân - Active */}
        <TouchableOpacity style={[styles.footerTab, styles.activeFooterTab]}>
          <MaterialIcons name="person" size={22} color="#FFFFFF" />
          <Text style={styles.activeFooterText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
  },

  header: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#6366F1",
    marginRight: 16,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },

  profileEmail: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 8,
  },

  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(245,158,11,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  adminBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },

  editButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(99,102,241,0.15)",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 12,
    letterSpacing: 0.8,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },

  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },

  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginLeft: 74,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: 18,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(239,68,68,0.2)",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
    letterSpacing: -0.2,
  },

  footer: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    backgroundColor: "#111827",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  footerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 18,
  },

  activeFooterTab: {
    backgroundColor: "#4F46E5",
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },

  activeFooterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
