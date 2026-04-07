// apps/kura-app/src/features/header/components/Header.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserSettingsModal from '../features/settings/screens/UserSettingsModal';
import { useAppStore } from '../shared/store/useAppStore';

export default function Header() {
  const [isModalVisible, setModalVisible] = useState(false);
  const userProfile = useAppStore((state) => state.userProfile);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const displayName = userProfile.displayName.trim();
  const avatarInitial = displayName ? displayName.slice(0, 1).toUpperCase() : '?';

  const handleLogoPress = () => {
    // 回到首頁（返回）
    if (navigation.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('Banking');
    }
  };

  return (
    <View style={{ backgroundColor: '#1A1A24', borderBottomWidth: 1, borderBottomColor: '#1A1A24' }}>
      <View 
        style={{ paddingTop: Math.max(insets.top, 10) + 6, paddingHorizontal: 24, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
      >
        <TouchableOpacity onPress={handleLogoPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>K</Text>
          </View>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 24, letterSpacing: 0.5 }}>Kura</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ width: 40, height: 40, backgroundColor: '#1A1A24', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Ionicons name="notifications-outline" size={20} color="#9CA3AF" />
            <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1, borderColor: '#1A1A24' }} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            style={{ width: 40, height: 40, backgroundColor: '#8B5CF6', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{avatarInitial}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <UserSettingsModal 
        isVisible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
}
