import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

type SafeScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const SafeScreen = ({children, style}: SafeScreenProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SafeScreen; 