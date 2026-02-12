export type AuthStackParamList = {
  FarmerAuth: undefined;
  AgronomistAuth: undefined;
};

export type FarmerTabsParamList = {
  FarmerHome: undefined;
  Diagnose: undefined;
  History: undefined;
  FarmerArticles: undefined;
  FarmerProfile: undefined;
};

export type FarmerStackParamList = {
  FarmerTabs: undefined;
  DiagnosisDetail: { id: string };
  ArticleDetail: { id: string };
};

export type AgronomistTabsParamList = {
  AgronomistDashboard: undefined;
  PendingQueue: undefined;
  AgronomistArticles: undefined;
  AgronomistProfile: undefined;
};

export type AgronomistStackParamList = {
  AgronomistTabs: undefined;
  DiagnosisReview: { id: string };
  ArticleEditor: { id?: string };
};
