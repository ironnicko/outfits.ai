import { SelectedClothing } from '../screens/generateOutfits/GenerateOutfitsScreen';

export interface SavedOutfit {
  ID?: string;
  OutfitTop?: SelectedClothing;
  Outfitbottom?: SelectedClothing;
  OutfitHat?: SelectedClothing;
  OutfitShoe?: SelectedClothing;
  occasion?: string;
  createdAt?: string;
}

