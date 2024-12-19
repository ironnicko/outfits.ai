export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  OutfitCheck: undefined;
  GenerateOutfits: undefined;
  OccasionSelect: undefined;
  Notifications: undefined;
  Tutorials: undefined;
  Support: undefined;
  About: undefined;
  SelectClothingItem: {
    type: 'hat' | 'top' | 'bottom' | 'shoes' | 'bag';
    title: string;
  };
  AIRecommendation: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MyLooks: undefined;
  Wardrobe: undefined;
  Settings: undefined;
}; 