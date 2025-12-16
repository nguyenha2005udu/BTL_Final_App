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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "../../../../components/icon";
import { useTheme } from "../../../context/ThemeContext";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "../../../services/auth.service";
import { auth, storage } from "../../../services/firebase/firebaseConfig";
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
  const cardBg = isDarkMode ? theme.cardBackground : '#f8f9fa';

  return (
   <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : '#ffffff' }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Cập nhật thông tin</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatarUrl || "https://via.placeholder.com/150" }}
              style={[styles.avatar, { borderColor: theme.cardBackground }]}
            />
            <TouchableOpacity style={styles.editIcon} onPress={handleChangeAvatar} disabled={loading}>
              <MaterialIcons name={loading ? "hourglass-empty" : "edit"} size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Họ và Tên</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Nhập họ và tên"
              placeholderTextColor={theme.textSecondary}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? "#374151" : "#f3f4f6", borderColor: theme.border, color: theme.textSecondary }]}
              value={userEmail}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Số điện thoại</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Nhập số điện thoại"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Ngày sinh</Text>
            <TouchableOpacity
              style={[styles.dateInputWrapper, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: theme.textPrimary }}>
                {birthDate ? birthDate.toLocaleDateString() : "DD/MM/YYYY"}
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
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "rgba(245, 247, 248, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111418",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3c83f6",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111418",
  },
  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: "#111418",
  },
  footer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#3c83f6",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#3c83f6",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateProfile;
