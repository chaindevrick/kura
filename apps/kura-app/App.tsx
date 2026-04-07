import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from './src/components/Header';
import TabNavigator from './src/components/TabNavigator';

// 💡 建立專屬 Kura 的深色導航主題
// 這能確保在頁面切換、或是抽屜推拉時，底色不會突然閃出白光
const KuraDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#2A2A2A', // 深灰色背景
  },
};

export default function App() {
  return (
    // SafeAreaProvider 確保在有瀏海或動態島的 iPhone 上，UI 不會被切到
    <SafeAreaProvider>
      {/* NavigationContainer 是所有路由的總司令部 */}
      <NavigationContainer theme={KuraDarkTheme}>
        
        {/* 確保手機頂部的時間、電量等狀態列圖示是白色的 (Light Content) */}
        <StatusBar style="light" translucent={true} />
        
        {/* Header + TabNavigator 容器 */}
        <View style={{ flex: 1, backgroundColor: '#0B0B0F' }}>
          {/* Header 固定在頂部 */}
          <Header />
          
          {/* TabNavigator 占據剩餘空間 */}
          <TabNavigator />
        </View>
        
      </NavigationContainer>
    </SafeAreaProvider>
  );
}