export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  App: undefined;

  GoalList: undefined;
  GoalDetail: { id: string };   // 👈 goal detail có id
  AddGoals: undefined;

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

