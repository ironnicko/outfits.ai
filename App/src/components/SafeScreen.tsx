import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, ViewStyle} from 'react-native';

type SafeScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const SafeScreen = ({children, style}: SafeScreenProps) => {

  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor='#FAFAFA'
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
});

export default SafeScreen; 