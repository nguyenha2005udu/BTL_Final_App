import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const lightTheme = {
  background: "#f5f7f8",
  cardBackground: "white",
  headerBackground: "rgba(245, 247, 248, 0.9)",
  textPrimary: "#111418",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  divider: "#f3f4f6",
  iconBoxBg: "#f3f4f6",
};

export const darkTheme = {
  background: "#111418",
  cardBackground: "#1f2937",
  headerBackground: "rgba(17, 20, 24, 0.9)",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
  border: "#374151",
  divider: "#374151",
  iconBoxBg: "#374151",
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  isDarkMode: boolean;
  theme: Theme;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("isDarkMode");
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (e) {
      console.log("Error loading theme:", e);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newValue));
    } catch (e) {
      console.log("Error saving theme:", e);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
