export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  App: undefined;
  AdminApp: undefined;
  AdminUserManagement: undefined;
  AdminCategories: undefined;
  AdminStatistic: undefined;
  AdminSetting: undefined;

  GoalList: undefined;
  GoalDetail: { id: string };   // 👈 goal detail có id
  AddGoals: undefined;
  EditGoal: { id: string };

  AddTransaction: undefined;
  AddCategory: undefined;
  CategoryDetail: { id: string };

  UpdateProfile: undefined;
  Notifications: undefined;
  ForgotPassword: undefined;
  ChangePassword: undefined;
  SecurityPolicy: undefined;
  HelpCenter: undefined;
  ContactSupport: undefined;
  RateApp: undefined;
  UpdateTransaction: { id: string };
};
