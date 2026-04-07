import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useFinanceStore } from '../store/useFinanceStore';
import WalletConnect from '@walletconnect/react-native-compat';
import { createPublicClient, http, formatEther } from 'viem';
import * as chains from 'viem/chains';

// 从 app.config.js 读取环境变量
const WALLETCONNECT_PROJECT_ID =
  Constants.expoConfig?.extra?.walletConnectProjectId ||
  process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  'development_project_id';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 支持的链
const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', nativeSymbol: 'ETH', icon: 'logo-ethereum' as any },
  { id: 137, name: 'Polygon', nativeSymbol: 'MATIC', icon: 'swap-horizontal' as any },
  { id: 42161, name: 'Arbitrum', nativeSymbol: 'ETH', icon: 'cube' as any },
];

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const syncConnectedWalletPosition = useFinanceStore(
    (state) => state.syncConnectedWalletPosition
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState<typeof SUPPORTED_CHAINS[0] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async (chain: typeof SUPPORTED_CHAINS[0]) => {
    try {
      setIsConnecting(true);
      setError(null);
      setSelectedChain(chain);

      console.log('[WalletConnect] Connecting to:', chain.name);

      // 验证 Project ID 已配置
      if (WALLETCONNECT_PROJECT_ID === 'development_project_id') {
        throw new Error(
          'WalletConnect Project ID not configured. Please set EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local'
        );
      }

      console.log('[WalletConnect] Project ID configured');

      // 创建 WalletConnect 实例（真实钱包连接）
      const walletConnect = new WalletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
        relayUrl: 'wss://relay.walletconnect.com',
      });

      console.log('[WalletConnect] Instance created');

      // 建立连接会话
      const session = await walletConnect.connect([{ chains: [chain.id] }]);
      
      console.log('[WalletConnect] Session established');

      // 提取用户钱包地址
      const userAddress = session.accounts[0].split(':')[2] as `0x${string}`;
      console.log('[WalletConnect] User address:', userAddress);

      // 获取对应链的配置
      const viemChain = Object.values(chains).find(c => c.id === chain.id);
      if (!viemChain) {
        throw new Error(`Chain ${chain.id} not supported`);
      }

      // 创建公链 RPC 客户端
      const publicClient = createPublicClient({
        chain: viemChain,
        transport: http(),
      });

      console.log('[WalletConnect] RPC client created');

      // 从区块链获取真实余额
      const balanceWei = await publicClient.getBalance({
        address: userAddress,
      });
      const nativeBalance = parseFloat(formatEther(balanceWei));
      console.log('[WalletConnect] Balance:', nativeBalance, chain.nativeSymbol);

      // 保存真实数据到 Store（仅一次）
      await syncConnectedWalletPosition({
        address: userAddress,
        chainId: chain.id,
        chainName: chain.name,
        nativeSymbol: chain.nativeSymbol,
        nativeBalance: nativeBalance,
      });

      console.log('[WalletConnect] Data saved to Store');

      Alert.alert('Success', `Wallet connected on ${chain.name}!\n\nBalance: ${nativeBalance.toFixed(4)} ${chain.nativeSymbol}`);
      onClose();
    } catch (err) {
      console.error('[WalletConnect] Connection failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      Alert.alert('Connection Error', errorMessage);
    } finally {
      setIsConnecting(false);
      setSelectedChain(null);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B0F' }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
            Connect Web3 Wallet
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#1A1A24',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Info */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '600', marginBottom: 8 }}>
              Select a blockchain network
            </Text>
            <Text style={{ fontSize: 12, color: '#999999' }}>
              Choose which blockchain you want to connect your wallet to. You can connect multiple
              wallets across different networks.
            </Text>
          </View>

          {/* Chain List */}
          <View style={{ gap: 12 }}>
            {SUPPORTED_CHAINS.map((chain) => (
              <TouchableOpacity
                key={chain.id}
                onPress={() => handleConnectWallet(chain)}
                disabled={isConnecting}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: '#1A1A24',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: isConnecting && selectedChain?.id !== chain.id ? 0.5 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16,
                    }}
                  >
                    <Ionicons name={chain.icon as any} size={24} color="#8B5CF6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                      {chain.name}
                    </Text>
                    <Text style={{ color: '#999999', fontSize: 12, marginTop: 4 }}>
                      {chain.nativeSymbol}
                    </Text>
                  </View>
                </View>

                {isConnecting && selectedChain?.id === chain.id ? (
                  <ActivityIndicator color="#8B5CF6" size="small" />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Error State */}
          {error && (
            <View
              style={{
                marginTop: 16,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.2)',
              }}
            >
              <Text style={{ fontSize: 12, color: '#FCA5A5' }}>{error}</Text>
            </View>
          )}

          {/* Info Box */}
          <View
            style={{
              marginTop: 24,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(139, 92, 246, 0.2)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Ionicons name="information-circle-outline" size={16} color="#8B5CF6" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#D1C7FF', fontWeight: '600', marginBottom: 4 }}>
                  WalletConnect is now available
                </Text>
                <Text style={{ fontSize: 11, color: '#B8ACFF' }}>
                  Connect your Web3 wallet to view your crypto holdings. Your wallet remains secure on your
                  device.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(139, 92, 246, 0.3)',
            }}
          >
            <Text style={{ color: '#8B5CF6', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
