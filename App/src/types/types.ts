import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SelectedClothing } from "../screens/generateOutfits/GenerateOutfitsScreen";
import { Clothes } from '../store/clothingStore';
import { SavedOutfit } from "../store/outfitStore";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type MixMatchItems = {
  clothes: Clothes[],
  rating: number,
  explanation: string,

}

export type RootStackParamList = {
  Home: undefined;
  OutfitPreview: {
    occasion?: string;

    outfits: SavedOutfit | Clothes[];
  };
  OutfitPreviewScreen: {
    occasion?: string;
    saveToLooks: boolean;
    outfits: SavedOutfit[] | Clothes[][];
  };
  MyLooks: undefined;
  Login: undefined;
  Signup: undefined
  MainTabs: undefined;
  OutfitCheck: undefined;
  GenerateOutfits: undefined;
  Onboarding: undefined;
  Notifications: undefined;
  Tutorials: undefined;
  Support: undefined;
  About: undefined;
  SelectClothingItem: { type: string; onSelect: (clothing: SelectedClothing) => void };
  OccasionSelect: { onSelect: (occasion: string) => void }
  MixAndMatch: undefined;
  Profile: undefined;
  ColorTheory: { imageUri: string };  
  InstructionsScreen: undefined;
  MixAndMatchResult:
  {
    data: MixMatchItems
    imageURI: string
  };
  ClothingDetail: {
    item: Clothes;
  };
  OutfitCheckResult: {
    result: {
      DoingWell: string;
      Improvements: string;
      NotDoingWell: string;
      Score: number;
    };
    imageUri: string | undefined;
  };
  ColorTherapyLanding: undefined;

};

export type MainTabParamList = {
  Home: undefined;
  OutfitCheck: undefined;
  GenerateOutfits: undefined;
  Wardrobe: undefined;
}; 
