import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainTabNavigator from './TabNavigator';
import useNavigationStore from '../store/useNavigationStore';
import MarketPlaceNavigator from './MarketPlaceNavigator';
import AiToolsTabNavigator from './AiToolsNavigator';

const MainNavigator = () => {
  const activeNavigator = useNavigationStore((state) => state.activeNavigator);

  return (
    <View style={styles.container}>
      {activeNavigator === 'Main' && <MainTabNavigator />}
      {activeNavigator === 'Market' && <MarketPlaceNavigator />}
      {activeNavigator === 'AiTools' && <AiToolsTabNavigator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default MainNavigator;
