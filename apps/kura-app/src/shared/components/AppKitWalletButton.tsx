/**
 * Reown AppKit Wallet Connection Component
 * Provides unified wallet connection interface using AppKit
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAppKit, useAccount } from '@reown/appkit-react-native';
import { useFinanceStore } from '../store/useFinanceStore';
import Logger from '../utils/Logger';

interface AppKitWalletButtonProps {
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export default function AppKitWalletButton({
  onConnected,
  onDisconnected,
}: AppKitWalletButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const syncConnectedWalletPosition = useFinanceStore(
    (state) => state.syncConnectedWalletPosition
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle wallet connection state changes
  useEffect(() => {
    if (isConnected && address) {
      const chainIdNum = typeof chainId === 'string' ? parseInt(chainId, 10) : chainId;
      Logger.info('AppKitWalletButton', 'Wallet connected', { address, chainId: chainIdNum });
      
      // Fetch wallet balance and sync position
      const syncWallet = async () => {
        try {
          setIsLoading(true);
          
          // Get chain info
          const chainInfo = getChainInfo(chainIdNum);
          if (!chainInfo) {
            Alert.alert('Unsupported Chain', `Chain ${chainIdNum} is not supported`);
            return;
          }

          // Get wallet balance (would need to fetch from provider)
          // For now, we'll use a placeholder
          const nativeBalance = 0; // TODO: Fetch actual balance

          await syncConnectedWalletPosition({
            address: address.toLowerCase(),
            chainId: chainIdNum || 1,
            chainName: chainInfo.name,
            nativeSymbol: chainInfo.nativeSymbol,
            nativeBalance,
          });

          Logger.info('AppKitWalletButton', 'Wallet position synced');
          onConnected?.();
        } catch (error) {
          Logger.error('AppKitWalletButton', 'Failed to sync wallet', error);
          Alert.alert('Error', 'Failed to sync wallet position');
        } finally {
          setIsLoading(false);
        }
      };

      syncWallet();
    } else if (!isConnected) {
      Logger.info('AppKitWalletButton', 'Wallet disconnected');
      onDisconnected?.();
    }
  }, [isConnected, address, chainId, syncConnectedWalletPosition, onConnected, onDisconnected]);

  const handleConnectPress = () => {
    try {
      Logger.debug('AppKitWalletButton', 'Opening AppKit modal');
      open();
    } catch (error) {
      Logger.error('AppKitWalletButton', 'Failed to open AppKit modal', error);
      Alert.alert('Error', 'Failed to open wallet modal');
    }
  };

  if (isLoading) {
    return (
      <TouchableOpacity
        disabled
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 44,
        }}
      >
        <ActivityIndicator color="#8B5CF6" />
      </TouchableOpacity>
    );
  }

  if (isConnected && address) {
    return (
      <View style={{ paddingVertical: 8 }}>
        <TouchableOpacity
          onPress={handleConnectPress}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(16, 185, 129, 0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
            Wallet Connected
          </Text>
          <Text style={{ color: '#10B981', fontSize: 11, fontFamily: 'monospace' }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleConnectPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: '600' }}>
        Connect Wallet
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Get chain information by chain ID
 */
function getChainInfo(
  chainId: number | undefined
): { name: string; nativeSymbol: string } | null {
  const chainMap: Record<number, { name: string; nativeSymbol: string }> = {
    1: { name: 'Ethereum', nativeSymbol: 'ETH' },
    137: { name: 'Polygon', nativeSymbol: 'MATIC' },
    42161: { name: 'Arbitrum', nativeSymbol: 'ETH' },
  };

  return chainId ? chainMap[chainId] || null : null;
}
