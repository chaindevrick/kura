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

type MembershipTier = 'pro' | 'ultimate' | 'vip';

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
  pro: {
    name: 'Pro',
    price: 'membership.pro.name',
    color: '#3B82F6',
    features: [
      {
        icon: 'link',
        name: 'membership.connections',
        description: 'membership.connectionsDesc',
      },
      {
        icon: 'calendar',
        name: 'membership.history',
        description: 'membership.historyDesc',
      },
      {
        icon: 'sync',
        name: 'membership.syncEvery6Hours',
        description: 'membership.syncEvery6HoursDesc',
      },
      {
        icon: 'trending-up',
        name: 'membership.netWorthChart',
        description: 'membership.netWorthChartDesc',
      },
      {
        icon: 'notifications',
        name: 'membership.basicNotifications',
        description: 'membership.basicNotificationsDesc',
      },
      {
        icon: 'download',
        name: 'membership.csvExport',
        description: 'membership.csvExportDesc',
      },
    ],
  },
  ultimate: {
    name: 'Ultimate',
    price: 'membership.ultimate.name',
    color: '#8B5CF6',
    features: [
      {
        icon: 'link',
        name: 'membership.connections',
        description: 'membership.connectionsDesc',
      },
      {
        icon: 'calendar',
        name: 'membership.history',
        description: 'membership.historyDesc',
      },
      {
        icon: 'sync',
        name: 'membership.syncEveryHour',
        description: 'membership.syncEveryHourDesc',
      },
      {
        icon: 'calculator',
        name: 'membership.defiAnalytics',
        description: 'membership.defiAnalyticsDesc',
      },
      {
        icon: 'notifications',
        name: 'membership.smartAlerts',
        description: 'membership.smartAlertsDesc',
      },
      {
        icon: 'document-text',
        name: 'membership.taxExport',
        description: 'membership.taxExportDesc',
      },
    ],
  },
  vip: {
    name: 'VIP',
    price: 'membership.vip.name',
    color: '#F59E0B',
    features: [
      {
        icon: 'link',
        name: 'membership.connections',
        description: 'membership.connectionsDesc',
      },
      {
        icon: 'calendar',
        name: 'membership.history',
        description: 'membership.historyDesc',
      },
      {
        icon: 'flash',
        name: 'membership.syncRealTime',
        description: 'membership.syncRealTimeDesc',
      },
      {
        icon: 'pricetag',
        name: 'membership.customTags',
        description: 'membership.customTagsDesc',
      },
      {
        icon: 'call',
        name: 'membership.prioritySupport',
        description: 'membership.prioritySupportDesc',
      },
      {
        icon: 'code',
        name: 'membership.webhooksAPI',
        description: 'membership.webhooksAPIDesc',
      },
    ],
  },
};

interface MembershipScreenProps {
  navigation?: any;
}

export default function MembershipScreen({ navigation }: MembershipScreenProps) {
  const [selectedTier, setSelectedTier] = useState<MembershipTier>('ultimate');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const userProfile = useAppStore((state) => state.userProfile);

  const currentTier = MEMBERSHIP_TIERS[selectedTier];

  const handleUpgrade = () => {
    // TODO: Implement purchase flow
    alert(`Upgrade to ${currentTier.name} coming soon!`);
  };

  const getPriceDisplay = () => {
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
          {(['pro', 'ultimate', 'vip'] as MembershipTier[]).map((tier) => {
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
                    ? 'rgba(139, 92, 246, 0.2)'
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
            backgroundColor: priceDisplay.isVIP ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
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

            {/* Billing Cycle Toggle - Right Side */}
            {selectedTier !== 'vip' && (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setBillingCycle('monthly')}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor: billingCycle === 'monthly' ? '#8B5CF6' : 'rgba(255, 255, 255, 0.05)',
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
                    backgroundColor: billingCycle === 'annual' ? '#8B5CF6' : 'rgba(255, 255, 255, 0.05)',
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
              {selectedTier === 'vip' ? t('membership.contactSales') : `${t('membership.upgradeTo')} ${currentTier.name.split(' ')[1]}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: 16,
            }}
          >
            {t('membership.features')}
          </Text>

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

        {/* Comparison Table */}
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: 12,
            }}
          >
            {t('membership.currentPlan')}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#8B5CF6',
            }}
          >
            {userProfile.membershipLabel || 'Free'}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#999999',
              marginTop: 4,
            }}
          >
            {t('membership.unlockFeatures')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
