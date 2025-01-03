import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getTokenLocal } from '../utils/auth';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ProtectedRouteProps {
  children: JSX.Element;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate a loading state (e.g., fetching token)
    const checkToken = async () => {
      const storedToken = await getTokenLocal();
      if (!storedToken) {
        // navigation.navigate('Login'); // Navigate to login screen if not authenticated
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
      setLoading(false);
    };

    checkToken();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="4A6741" />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;