import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createSavingGoal } from "../../../services/savingGoals.service";
import { auth } from "../../../services/firebase/firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddGoals({ navigation }: { navigation: any }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!title || !targetAmount) return;

    await createSavingGoal(user.uid, {
      title,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialIcons name="arrow-back" size={28} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Tạo mục tiêu tiết kiệm</Text>

      <TextInput
        placeholder="Tên mục tiêu"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Số tiền cần đạt"
        keyboardType="numeric"
        value={targetAmount}
        onChangeText={setTargetAmount}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu mục tiêu</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#4C6EF5",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
