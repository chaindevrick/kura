// App.tsx
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import TabNavigator from './src/navigation/TabNavigator';
import { COLORS } from './src/theme/colors';

const KuraTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: COLORS.background },
};

export default function App() {
  return (
    <NavigationContainer theme={KuraTheme}>
      <StatusBar style="light" />
      <TabNavigator />
    </NavigationContainer>
  );
}