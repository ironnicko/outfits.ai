import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getTokenLocal } from '../utils/auth';
import { useNavigation } from '@react-navigation/native';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate a loading state (e.g., fetching token)
    const checkToken = async () => {
      const storedToken = await getTokenLocal();
      if (!storedToken) {
        navigation.navigate('Login'); // Navigate to login screen if not authenticated
      }
      setLoading(false);
    };

    checkToken();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;