import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useFinanceStore } from '../../../shared/store/useFinanceStore';
import { useExchangeStore } from '../../../shared/store/useExchangeStore';
import { useAppStore } from '../../../shared/store/useAppStore';
import PerformanceSummary from '../components/PerformanceSummary';
import WaveChart from '../components/WaveChart';
import AccountCapsules from '../components/AccountCapsules';
import HoldingsList from '../components/HoldingsList';
import ConnectAccountModal from '../../../shared/components/ConnectAccountModal';
import PlaidLinkModal from '../../../shared/components/PlaidLinkModal';
import ExchangeLinkModal from '../../../shared/components/ExchangeLinkModal';

export default function InvestmentScreen() {
  // Finance Store (Plaid/Broker/Web3)
  const financeInvestmentAccounts = useFinanceStore((state) => state.investmentAccounts);
  const financeInvestments = useFinanceStore((state) => state.investments);
  const selectedTimeRange = useFinanceStore((state) => state.selectedTimeRange);
  const setSelectedTimeRange = useFinanceStore((state) => state.setSelectedTimeRange);

  // Exchange Store (交易所專用數據)
  const exchangeAccounts = useExchangeStore((state) => state.exchangeAccounts);
  const exchangeInvestmentAccounts = useExchangeStore((state) => state.exchangeInvestmentAccounts);
  const exchangeInvestments = useExchangeStore((state) => state.exchangeInvestments);
  const exchangeIsLoading = useExchangeStore((state) => state.isLoading);
  const exchangeError = useExchangeStore((state) => state.error);



  // Combine data from all sources
  // 展開所有帳戶，並保留 type 字段用於胶囊标签
  const investmentAccounts = useMemo(() => {
    const combined = [
      ...financeInvestmentAccounts.map(acc => ({
        ...acc,
        type: (acc.type || 'Broker') as 'Broker' | 'Exchange' | 'Web3 Wallet' // 為 financeInvestmentAccounts 設定默認類型
      })),
      ...exchangeInvestmentAccounts.map(acc => ({
        ...acc,
        type: 'Exchange' as const // 交易所帳戶明確標示為 Exchange
      }))
    ];
    const logData = {
      total: combined.length,
      finance: financeInvestmentAccounts.length,
      exchange: exchangeInvestmentAccounts.length,
      combined: combined.map(a => ({ id: a.id, name: a.name, type: a.type, logo: a.logo }))
    };
    console.log('📊 [InvestmentScreen] Combined Investment Accounts:', JSON.stringify(logData, null, 2));
    return combined;
  }, [financeInvestmentAccounts, exchangeInvestmentAccounts]);

  const investments = useMemo(
    () => [...financeInvestments, ...exchangeInvestments],
    [financeInvestments, exchangeInvestments]
  );

  // Check if any exchange account is loading
  const isAnyExchangeLoading = useMemo(
    () => Object.values(exchangeIsLoading).some((loading) => loading),
    [exchangeIsLoading]
  );

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const plaidLinkToken = useAppStore((state: any) => state.plaidLinkToken);
  const authToken = useAppStore((state: any) => state.authToken);

  // 🔄 自動獲取交易所餘額數據（只在首次獲取，之後不重複）
  useEffect(() => {
    const fetchExchangeData = async () => {
      // 只在交易所投資數據為空且有新帳戶時才獲取
      if (exchangeAccounts.length === 0 || !authToken) {
        return;
      }

      // 如果已經有交易所投資數據，就不再重複獲取
      if (exchangeInvestments.length > 0) {
        return;
      }

      const fetchExchangeBalances = useExchangeStore.getState().fetchExchangeBalances;
      
      for (const account of exchangeAccounts) {
        try {
          await fetchExchangeBalances(account.id, authToken);
        } catch {
          // Silently handle errors
        }
      }
    };

    fetchExchangeData();
  }, [exchangeAccounts, authToken, exchangeInvestments.length]);

  // Clear selected account if it no longer exists
  useEffect(() => {
    if (selectedAccountId && !investmentAccounts.find(acc => acc.id === selectedAccountId)) {
      setSelectedAccountId(null);
    }
  }, [investmentAccounts, selectedAccountId]);

  const displayedInvestments = useMemo(() => {
    if (selectedAccountId) {
      return investments.filter((investment) => investment.accountId === selectedAccountId);
    }
    return investments;
  }, [investments, selectedAccountId]);

  const handleAddAccount = () => {
    setShowConnectModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0F' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <PerformanceSummary timeRange={selectedTimeRange} />
        <WaveChart selectedTimeRange={selectedTimeRange} onTimeRangeChange={setSelectedTimeRange} />
        
        {/* 顯示交易所加載狀態 */}
        {isAnyExchangeLoading && (
          <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(139, 92, 246, 0.3)',
              }}
            >
              <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: '500' }}>
                🔄 同步中... （交易所帳戶）
              </Text>
            </View>
          </View>
        )}

        {/* 顯示交易所錯誤 */}
        {exchangeError && (
          <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.3)',
              }}
            >
              <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '500' }}>
                ⚠️ {exchangeError}
              </Text>
            </View>
          </View>
        )}

        <AccountCapsules 
          accounts={investmentAccounts} 
          selectedAccountId={selectedAccountId} 
          onSelectAccount={setSelectedAccountId}
          onAddAccount={handleAddAccount}
        />
        <HoldingsList 
          investments={displayedInvestments} 
          selectedAccountId={selectedAccountId}
        />
      </ScrollView>

      {/* Connect Account Modal */}
      <ConnectAccountModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onPlaidPress={() => setShowPlaidModal(true)}
        onWeb3Press={() => {
          // Web3 wallet connection is handled directly by AppKit modal
          // No additional modal needed
        }}
        onExchangePress={() => setShowExchangeModal(true)}
      />

      {/* Plaid Link Modal */}
      <PlaidLinkModal
        isVisible={showPlaidModal}
        linkToken={plaidLinkToken}
        onClose={() => setShowPlaidModal(false)}
        onSuccess={() => setShowPlaidModal(false)}
      />

      {/* Exchange Link Modal */}
      <ExchangeLinkModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        onSuccess={() => {
          // Exchange account connected successfully
          // You can add additional logic here if needed
        }}
      />
    </View>
  );
}
