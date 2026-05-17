import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@components/icon";
import { useTheme } from "@context/ThemeContext";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "@services/auth.service";
import { auth, storage } from "@services/firebase/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UpdateProfile: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useTheme();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const userEmail = auth.currentUser?.email || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setFullName(profile.fullName || "");
          setPhone(profile.phone || "");
          setBirthDate(profile.birthDate ? new Date(profile.birthDate) : null);
          setAvatarUrl(profile.photoUrl || auth.currentUser?.photoURL || null);
        }
      } catch (error) {
        console.log("LOAD PROFILE ERROR >>>", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChangeAvatar = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert("Cần quyền truy cập Camera và Thư viện ảnh");
      return;
    }

    Alert.alert("Chọn ảnh", "Chọn nguồn ảnh", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
          });
          
          if (!result.canceled && result.assets && result.assets[0]) {
            await uploadAvatar(result.assets[0].uri);
          }
        },
      },
      {
        text: "Thư viện",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
          });
          
          if (!result.canceled && result.assets && result.assets[0]) {
            await uploadAvatar(result.assets[0].uri);
          }
        },
      },
      { text: "Huỷ", style: "cancel" },
    ]);
  };

  const uploadAvatar = async (uri: string) => {
    setLoading(true);
    try {
      console.log("Starting upload for URI:", uri);
      
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileRef = ref(storage, `avatars/${auth.currentUser?.uid}_${Date.now()}.jpg`);
      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);
      
      console.log("Upload successful:", downloadUrl);
      setAvatarUrl(downloadUrl);
      Alert.alert("Thành công", "Đã tải ảnh lên thành công");
    } catch (error) {
      console.error("UPLOAD AVATAR ERROR >>>", error);
      Alert.alert("Lỗi", "Không thể tải ảnh lên. Kiểm tra quyền và kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setBirthDate(selectedDate);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        fullName,
        phone,
        birthDate: birthDate ? birthDate.toISOString() : null,
      });
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      navigation.goBack();
    } catch (error) {
      console.log("UPDATE PROFILE ERROR >>>", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#FFFFFF' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? theme.headerBackground : '#FFFFFF',
        borderBottomColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cập nhật thông tin</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={[styles.avatarCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatarUrl || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={[styles.editIcon, loading && styles.editIconLoading]} 
              onPress={handleChangeAvatar} 
              disabled={loading}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={loading ? "hourglass-empty" : "camera-alt"} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.avatarHint, { color: theme.textSecondary }]}>
            Nhấn vào biểu tượng camera để thay đổi ảnh
          </Text>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { 
          backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF'
        }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Họ và Tên</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
                  borderColor: isDarkMode ? theme.border : '#E2E8F0',
                  color: theme.textPrimary 
                }]}
                placeholder="Nhập họ và tên"
                placeholderTextColor={theme.textSecondary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.disabledInput, { 
                  backgroundColor: isDarkMode ? '#374151' : '#F1F5F9',
                  borderColor: isDarkMode ? theme.border : '#E2E8F0',
                  color: theme.textSecondary 
                }]}
                value={userEmail}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Số điện thoại</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="phone" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
                  borderColor: isDarkMode ? theme.border : '#E2E8F0',
                  color: theme.textPrimary 
                }]}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={theme.textSecondary}
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Ngày sinh</Text>
            <TouchableOpacity
              style={[styles.dateInputWrapper, { 
                backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
                borderColor: isDarkMode ? theme.border : '#E2E8F0'
              }]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="cake" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <Text style={[styles.dateText, { 
                color: birthDate ? theme.textPrimary : theme.textSecondary 
              }]}>
                {birthDate ? birthDate.toLocaleDateString('vi-VN') : "Chọn ngày sinh"}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={birthDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={[styles.footer, { 
        backgroundColor: isDarkMode ? theme.cardBackground : '#FFFFFF',
        borderTopColor: isDarkMode ? theme.border : '#F1F5F9'
      }]}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading && <MaterialIcons name="hourglass-empty" size={20} color="white" style={{ marginRight: 8 }} />}
          <Text style={styles.saveButtonText}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: isDarkMode ? theme.border : '#E2E8F0' }]} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Hủy</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  avatarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#3B82F6",
  },
  editIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editIconLoading: {
    backgroundColor: "#94A3B8",
  },
  avatarHint: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 14,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    height: 52,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    color: "#94A3B8",
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    height: 52,
    paddingLeft: 48,
    paddingRight: 16,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  cancelButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UpdateProfile;