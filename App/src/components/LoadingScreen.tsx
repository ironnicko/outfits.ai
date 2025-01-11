import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const LoadingScreen = () =>(
    <View 
    style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: 'white' 
    }}
  >
    <ActivityIndicator 
      size="large" 
      color="#4A6741" 
    />
  </View>
)