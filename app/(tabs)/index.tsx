import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '../../components/icon';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import Welcome from '../presentation/screens/Auth/WelcomeScreen';
import Login from '../presentation/screens/Auth/LoginScreen';
import Register from '../presentation/screens/Auth/RegisterScreen';
import Home from '../presentation/screens/Home/HomeScreen';
import TransactionList from '../presentation/screens/Statistics/StatisticsScreen';
import Report from '../presentation/screens/Report/ReportScreen';
import Profile from '../presentation/screens/Profile/ProfileScreen';
import GoalList from '../presentation/screens/Goals/SavingGoalsScreen';
import GoalDetail from '../presentation/screens/Goals/GoalDetail';
import AddGoal from '../presentation/screens/Goals/AddGoals';
import AddTransaction from '../presentation/screens/Home/AddTransactionScreen';
import AddCategory from '../presentation/screens/Report/AddCategory';
import CategoryDetail from '../presentation/screens/Report/CategoryDetail';
import UpdateProfile from '../presentation/screens/Profile/UpdateProfile';
import NotificationScreen from '../presentation/screens/Notification/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tách MainTabs ra để có thể sử dụng useTheme
function MainTabs() {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName: string = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Transactions') iconName = 'receipt-long';
          else if (route.name === 'Report') iconName = 'bar-chart';
          else if (route.name === 'Profile') iconName = 'person';
          return <MaterialIcons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#3c83f6',
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
          fontWeight: '500',
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="Transactions" component={TransactionList} options={{ title: 'Giao dịch' }} />
      <Tab.Screen name="Report" component={Report} options={{ title: 'Báo cáo' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Hồ sơ' }} />
    </Tab.Navigator>
  );
}

// Component chứa Navigator với theme
function AppNavigator() {
  const { theme, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background} 
      />
      <Stack.Navigator
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
        initialRouteName="Welcome"
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="App" component={MainTabs} />
        <Stack.Screen name="GoalList" component={GoalList} />
        <Stack.Screen name="GoalDetail" component={GoalDetail} />
        <Stack.Screen name="AddGoal" component={AddGoal} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
        <Stack.Screen name="AddCategory" component={AddCategory} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
      </Stack.Navigator>
    </>
  );
}

export default function RootNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}