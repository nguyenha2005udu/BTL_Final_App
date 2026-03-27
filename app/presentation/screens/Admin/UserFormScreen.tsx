import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type UserStatus = "active" | "locked";
type UserRole = "user" | "admin";

export default function UserFormScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<UserStatus>("active");
  const [role, setRole] = useState<UserRole>("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }

    Alert.alert(
      "Lưu người dùng",
      `Họ tên: ${fullName}\nEmail: ${email}\nVai trò: ${
        role === "admin" ? "Admin" : "User"
      }\nTrạng thái: ${status === "active" ? "Hoạt động" : "Bị khóa"}`
    );
  };

  const handleCancel = () => {
    Alert.alert("Hủy", "Quay lại màn hình trước");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Thêm người dùng mới</Text>
            <Text style={styles.headerSubtitle}>
              Nhập thông tin tài khoản và quyền truy cập
            </Text>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="camera-outline" size={34} color="#94a3b8" />
            </View>

            <TouchableOpacity style={styles.avatarEditBtn}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.avatarTitle}>Ảnh đại diện</Text>
            <Text style={styles.avatarHint}>PNG, JPG tối đa 5MB</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập địa chỉ email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Vai trò</Text>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[styles.segmentBtn, role === "user" && styles.segmentBtnActive]}
                  onPress={() => setRole("user")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      role === "user" && styles.segmentTextActive,
                    ]}
                  >
                    Người dùng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.segmentBtn, role === "admin" && styles.segmentBtnActive]}
                  onPress={() => setRole("admin")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      role === "admin" && styles.segmentTextActive,
                    ]}
                  >
                    Quản trị viên
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Trạng thái</Text>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    status === "active" && styles.segmentBtnActive,
                  ]}
                  onPress={() => setStatus("active")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      status === "active" && styles.segmentTextActive,
                    ]}
                  >
                    Hoạt động
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    status === "locked" && styles.segmentBtnActive,
                  ]}
                  onPress={() => setStatus("locked")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      status === "locked" && styles.segmentTextActive,
                    ]}
                  >
                    Bị khóa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.noteText}>
            Người dùng mới sẽ nhận được email kích hoạt tài khoản sau khi bạn lưu thông tin.
            Vui lòng kiểm tra kỹ địa chỉ email trước khi tạo.
          </Text>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Lưu người dùng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    position: "relative",
  },
  avatarCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: 72,
    right: 120,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#065f46",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  avatarHint: {
    marginTop: 4,
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
  },
  segmentWrap: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnActive: {
    backgroundColor: "#065f46",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748b",
  },
  segmentTextActive: {
    color: "#ffffff",
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    height: 52,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },
  eyeBtn: {
    marginLeft: 8,
  },
  noteText: {
    marginTop: 16,
    paddingHorizontal: 4,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#334155",
    fontWeight: "800",
    fontSize: 14,
  },
  saveBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#065f46",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 8,
  },
});