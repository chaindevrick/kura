import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// 簡易的測試頁面
const DummyScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>{title}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary, // 發出 Kura 紫光
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFill} />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          height: 90,
          paddingBottom: 20,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Net Worth') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Investment') iconName = focused ? 'trending-up' : 'trending-up-outline';
          else if (route.name === 'Budget') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Kura AI') iconName = focused ? 'sparkles' : 'sparkles-outline';

          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Net Worth" children={() => <DummyScreen title="Dashboard" />} />
      <Tab.Screen name="Investment" children={() => <DummyScreen title="Investment" />} />
      <Tab.Screen name="Budget" children={() => <DummyScreen title="Budget" />} />
      <Tab.Screen name="Kura AI" children={() => <DummyScreen title="Hi, I'm Kura" />} />
    </Tab.Navigator>
  );
}