import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../providers/AuthProvider";

// Screens
import ForgotPasswordScreen from "../presentation/screens/Auth/ForgotPasswordScreen";
import Login from "../presentation/screens/Auth/LoginScreen";
import Register from "../presentation/screens/Auth/RegisterScreen";
import Welcome from "../presentation/screens/Auth/WelcomeScreen";

import AddTransaction from "../presentation/screens/User/Home/AddTransactionScreen";
import Home from "../presentation/screens/User/Home/HomeScreen";
import UpdateTransactionScreen from "../presentation/screens/User/Home/UpdateTransactionScreen";

import ChangePasswordScreen from "../presentation/screens/User/Profile/ChangePasswordScreen";
import ContactSupportScreen from "../presentation/screens/User/Profile/ContactSupportScreen";
import HelpCenterScreen from "../presentation/screens/User/Profile/HelpCenterScreen";
import Profile from "../presentation/screens/User/Profile/ProfileScreen";
import RateAppScreen from "../presentation/screens/User/Profile/RateAppScreen";
import SecurityPolicyScreen from "../presentation/screens/User/Profile/SecurityPolicyScreen";
import UpdateProfile from "../presentation/screens/User/Profile/UpdateProfile";

import AddCategory from "../presentation/screens/User/Report/AddCategory";
import CategoryDetail from "../presentation/screens/User/Report/CategoryDetail";
import Report from "../presentation/screens/User/Report/ReportScreen";

import TransactionList from "../presentation/screens/User/Statistics/StatisticsScreen";

import AddGoal from "../presentation/screens/User/Goals/AddGoals";
import EditGoal from "../presentation/screens/User/Goals/EditGoal";
import GoalDetail from "../presentation/screens/User/Goals/GoalDetail";
import GoalList from "../presentation/screens/User/Goals/SavingGoalsScreen";

import NotificationScreen from "../presentation/screens/User/Notification/NotificationScreen";

import { RootStackParamList } from "../navigation/RootNavigator";
import AdminTabs from "../navigation/adminTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function LoadingScreen() {
  const { theme, isDarkMode } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <ActivityIndicator size="large" color="#3c83f6" />
      <Text
        style={{
          marginTop: 12,
          fontSize: 16,
          color: theme.textPrimary,
        }}
      >
        Đang tải...
      </Text>
    </View>
  );
}

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName: string = "home";

          if (route.name === "Trang chủ") iconName = "home";
          else if (route.name === "Giao dịch") iconName = "receipt-long";
          else if (route.name === "Báo cáo") iconName = "bar-chart";
          else if (route.name === "Hồ sơ") iconName = "person";

          return (
            <MaterialIcons name={iconName as any} size={28} color={color} />
          );
        },
        tabBarActiveTintColor: "#3c83f6",
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: theme.cardBackground,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen name="Trang chủ" component={Home} />
      <Tab.Screen name="Giao dịch" component={TransactionList} />
      <Tab.Screen name="Báo cáo" component={Report} />
      <Tab.Screen name="Hồ sơ" component={Profile} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { theme, isDarkMode } = useTheme();
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="App"
              component={isAdmin ? AdminTabs : MainTabs}
            />

            <Stack.Screen name="GoalList" component={GoalList} />
            <Stack.Screen name="GoalDetail" component={GoalDetail} />
            <Stack.Screen name="EditGoal" component={EditGoal} />

            <Stack.Screen name="AddGoals" component={AddGoal} />
            <Stack.Screen name="AddTransaction" component={AddTransaction} />
            <Stack.Screen
              name="UpdateTransaction"
              component={UpdateTransactionScreen}
            />

            <Stack.Screen name="AddCategory" component={AddCategory} />
            <Stack.Screen name="CategoryDetail" component={CategoryDetail} />

            <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />

            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
            <Stack.Screen
              name="SecurityPolicy"
              component={SecurityPolicyScreen}
            />

            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen
              name="ContactSupport"
              component={ContactSupportScreen}
            />
            <Stack.Screen name="RateApp" component={RateAppScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}

export default function RootNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
