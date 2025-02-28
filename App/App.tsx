import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { MD3LightTheme as DefaultTheme, MD3Theme, PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';

// Define your custom theme
const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#843CA7',
  },

};

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
