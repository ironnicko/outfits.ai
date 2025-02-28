import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainTabNavigator from './TabNavigator';
import AiToolsTabNavigator from './AiToolsTabNavigator';
import ClosetTabNavigator from './ClosetTabNavigator';
import useNavigationStore from '../store/useNavigationStore';

const MainNavigator = () => {
  const activeNavigator = useNavigationStore((state) => state.activeNavigator);

  return (
    <View style={styles.container}>
      {activeNavigator === 'Main' && <MainTabNavigator />}
      {activeNavigator === 'AiTools' && <AiToolsTabNavigator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default MainNavigator;
