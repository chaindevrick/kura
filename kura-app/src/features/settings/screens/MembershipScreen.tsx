import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useAppTranslation } from '../../../shared/hooks/useAppTranslation';
import { useAppStore } from '../../../shared/store/useAppStore';

type MembershipTier = 'basic' | 'pro' | 'ultimate' | 'vip';

interface TierFeature {
  icon: string;
  name: string;
  description: string;
}

interface TierData {
  name: string;
  price: string;
  features: TierFeature[];
  color: string;
}

const MEMBERSHIP_TIERS: Record<MembershipTier, TierData> = {
  basic: {
    name: 'Basic',
    price: 'membership.basic.name',
    color: '#10B981',
    features: [
      {
        icon: 'link',
        name: 'membership.basic.unlimitedConnections',
        description: 'membership.basic.unlimitedConnectionsDesc',
      },
      {
        icon: 'trending-up',
        name: 'membership.basic.netWorth',
        description: 'membership.basic.netWorthDesc',
      },
      {
        icon: 'calendar',
        name: 'membership.basic.thirtyDayHistory',
        description: 'membership.basic.thirtyDayHistoryDesc',
      },
    ],
  },
  pro: {
    name: 'Pro',
    price: 'membership.pro.name',
    color: '#3B82F6',
    features: [
      {
        icon: 'alert-circle',
        name: 'membership.pro.crossDomainAlerts',
        description: 'membership.pro.crossDomainAlertsDesc',
      },
      {
        icon: 'document-text',
        name: 'membership.pro.taxExport',
        description: 'membership.pro.taxExportDesc',
      },
      {
        icon: 'infinite',
        name: 'membership.pro.permanentHistory',
        description: 'membership.pro.permanentHistoryDesc',
      },
      {
        icon: 'sync',
        name: 'membership.pro.advancedSync',
        description: 'membership.pro.advancedSyncDesc',
      },
    ],
  },
  ultimate: {
    name: 'Ultimate',
    price: 'membership.ultimate.name',
    color: '#8B5CF6',
    features: [
      {
        icon: 'layers',
        name: 'membership.ultimate.defiAnalytics',
        description: 'membership.ultimate.defiAnalyticsDesc',
      },
      {
        icon: 'notifications',
        name: 'membership.ultimate.realTimeAlerts',
        description: 'membership.ultimate.realTimeAlertsDesc',
      },
      {
        icon: 'flash',
        name: 'membership.ultimate.highFreqSync',
        description: 'membership.ultimate.highFreqSyncDesc',
      },
    ],
  },
  vip: {
    name: 'VIP',
    price: 'membership.vip.name',
    color: '#F59E0B',
    features: [
      {
        icon: 'server',
        name: 'membership.vip.customNode',
        description: 'membership.vip.customNodeDesc',
      },
      {
        icon: 'code',
        name: 'membership.vip.developerApi',
        description: 'membership.vip.developerApiDesc',
      },
    ],
  },
};

interface MembershipScreenProps {
  navigation?: any;
}

export default function MembershipScreen({ navigation }: MembershipScreenProps) {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const userProfile = useAppStore((state) => state.userProfile);

  // Get current membership tier from Store and normalize it
  const getMembershipTierFromLabel = (label: string): MembershipTier => {
    if (!label) return 'basic';
    
    const normalizedLabel = label.toLowerCase();
    
    // Handle different label formats
    if (normalizedLabel.includes('basic')) return 'basic';
    if (normalizedLabel.includes('pro')) return 'pro';
    if (normalizedLabel.includes('ultimate')) return 'ultimate';
    if (normalizedLabel.includes('vip')) return 'vip';
    
    return 'basic'; // fallback
  };

  const currentMembershipTier = getMembershipTierFromLabel(userProfile.membershipLabel);

  // Initialize selected tier to current membership tier
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(currentMembershipTier);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const currentTier = MEMBERSHIP_TIERS[selectedTier];

  const handleUpgrade = () => {
    // Special handling for VIP
    if (selectedTier === 'vip') {
      alert(t('membership.contactSalesDesc') || 'Please contact our sales team for VIP pricing');
      return;
    }
    
    // TODO: Implement purchase flow for other tiers
    alert(`${getButtonText()} coming soon!`);
  };

  // Get button text based on user's current tier vs selected tier
  const getButtonText = () => {
    // Define tier hierarchy (lower index = lower tier)
    const tierHierarchy = ['basic', 'pro', 'ultimate', 'vip'];
    
    const selectedTierIndex = tierHierarchy.indexOf(selectedTier);
    const currentTierIndex = tierHierarchy.indexOf(currentMembershipTier);

    if (selectedTierIndex === currentTierIndex) {
      return t('membership.currentPlan') || 'Current Plan';
    } else if (selectedTierIndex > currentTierIndex) {
      return `${t('membership.upgradeTo')} ${currentTier.name}`;
    } else {
      return `${t('membership.downgradeTo')} ${currentTier.name}`;
    }
  };

  const getPriceDisplay = () => {
    if (selectedTier === 'basic') {
      return {
        price: t('membership.basic.price') || '免費',
        period: '',
        note: '',
        isBasic: true,
      };
    }

    if (selectedTier === 'vip') {
      return {
        price: t('membership.vip.price'),
        period: t('membership.vip.priceNote'),
        note: t('membership.contactSalesDesc'),
        isVIP: true,
      };
    }

    if (selectedTier === 'pro') {
      const price = billingCycle === 'monthly' 
        ? t('membership.pro.monthlyPrice')
        : t('membership.pro.annualPrice');
      const period = billingCycle === 'monthly'
        ? t('membership.perMonth')
        : t('membership.perYear');
      const note = billingCycle === 'annual'
        ? t('membership.pro.annualPriceNote')
        : '';
      return { price, period, note, isVIP: false };
    }

    // Ultimate
    const price = billingCycle === 'monthly'
      ? t('membership.ultimate.monthlyPrice')
      : t('membership.ultimate.annualPrice');
    const period = billingCycle === 'monthly'
      ? t('membership.perMonth')
      : t('membership.perYear');
    const note = billingCycle === 'annual'
      ? t('membership.ultimate.annualPriceNote')
      : '';
    return { price, period, note, isVIP: false };
  };

  const priceDisplay = getPriceDisplay();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0F' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: Math.max(insets.top || 0, 12),
          borderBottomWidth: 1,
          borderBottomColor: '#333333',
        }}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            color: '#FFFFFF',
            marginLeft: 12,
          }}
        >
          {t('membership.title')}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tier Selection */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {(['basic', 'pro', 'ultimate', 'vip'] as MembershipTier[]).map((tier) => {
            const tierData = MEMBERSHIP_TIERS[tier];
            const isSelected = selectedTier === tier;

            return (
              <TouchableOpacity
                key={tier}
                onPress={() => setSelectedTier(tier)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 12,
                  backgroundColor: isSelected
                    ? `${tierData.color}20`
                    : 'rgba(255, 255, 255, 0.05)',
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? tierData.color : '#333333',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: isSelected ? tierData.color : '#999999',
                    textAlign: 'center',
                  }}
                >
                  {tierData.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Price Section */}
        <View
          style={{
            backgroundColor: priceDisplay.isBasic 
              ? 'rgba(16, 185, 129, 0.1)' 
              : priceDisplay.isVIP 
              ? 'rgba(245, 158, 11, 0.1)' 
              : 'rgba(139, 92, 246, 0.1)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: currentTier.color,
          }}
        >
          {/* Price Header with Billing Cycle Toggle */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            {/* Price Display */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: currentTier.color,
                  }}
                >
                  {priceDisplay.price}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#999999',
                  }}
                >
                  {priceDisplay.period}
                </Text>
              </View>
              
              {priceDisplay.note && (
                <Text
                  style={{
                    fontSize: 12,
                    color: '#999999',
                  }}
                >
                  {priceDisplay.note}
                </Text>
              )}
            </View>

            {/* Billing Cycle Toggle - Right Side (only for Pro and Ultimate) */}
            {selectedTier !== 'basic' && selectedTier !== 'vip' && (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setBillingCycle('monthly')}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor: billingCycle === 'monthly' ? currentTier.color : 'rgba(255, 255, 255, 0.05)',
                    borderWidth: billingCycle === 'monthly' ? 0 : 1,
                    borderColor: '#333333',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: billingCycle === 'monthly' ? '#FFFFFF' : '#999999',
                    }}
                  >
                    {t('membership.monthly')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBillingCycle('annual')}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor: billingCycle === 'annual' ? currentTier.color : 'rgba(255, 255, 255, 0.05)',
                    borderWidth: billingCycle === 'annual' ? 0 : 1,
                    borderColor: '#333333',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: billingCycle === 'annual' ? '#FFFFFF' : '#999999',
                    }}
                  >
                    {t('membership.annual')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleUpgrade}
            style={{
              backgroundColor: currentTier.color,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
              }}
            >
              {getButtonText()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: 4,
              }}
            >
              {t('membership.features')}
            </Text>
            {selectedTier !== 'basic' && (
              <Text
                style={{
                  fontSize: 12,
                  color: '#999999',
                }}
              >
                {selectedTier === 'pro' && t('membership.includesAllBasic')}
                {selectedTier === 'ultimate' && t('membership.includesAllPro')}
                {selectedTier === 'vip' && t('membership.includesAllUltimate')}
              </Text>
            )}
          </View>

          {currentTier.features.map((feature, index) => (
            <View key={index} style={{ marginBottom: 16, flexDirection: 'row', gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: `rgba(139, 92, 246, 0.1)`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name={feature.icon as any} size={20} color={currentTier.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: 4,
                  }}
                >
                  {t(feature.name)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#999999',
                  }}
                >
                  {t(feature.description)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
