import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalletConnectModal from './WalletConnectModal';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlaid: () => void | Promise<void>;
  onSelectWalletConnect: () => void | Promise<void>;
}

export default function ConnectAccountModal({
  isOpen,
  onClose,
  onSelectPlaid,
  onSelectWalletConnect,
}: ConnectAccountModalProps) {
  const [isConnecting, setIsConnecting] = useState<'plaid' | 'walletconnect' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false);

  const handlePlaidPress = async () => {
    try {
      setIsConnecting('plaid');
      setError(null);
      await onSelectPlaid();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Plaid account');
    } finally {
      setIsConnecting(null);
    }
  };

  const handleWalletConnectPress = async () => {
    try {
      setError(null);
      // Show the WalletConnectModal instead of calling external callback
      setShowWalletConnectModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handleClose = () => {
    setError(null);
    setIsConnecting(null);
    onClose();
  };

  const handleWalletConnectModalClose = () => {
    setShowWalletConnectModal(false);
    onClose();
  };

  return (
    <>
      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              {/* Card */}
              <View
                style={{
                  width: '85%',
                  backgroundColor: '#0B0B0F',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                }}
              >
            {/* Header */}
            <View
              style={{
                paddingTop: 24,
                paddingHorizontal: 24,
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.05)',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>Connect Account</Text>
                <Text style={{ fontSize: 13, color: '#9CA3AF' }}>Select the type of account to link.</Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
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
            <View style={{ padding: 24, gap: 16 }}>
            {error && (
              <View
                style={{
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

            {/* Plaid Button */}
            <TouchableOpacity
              onPress={handlePlaidPress}
              disabled={isConnecting !== null}
              style={{
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isConnecting === 'plaid' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isConnecting === 'plaid' ? 'rgba(139, 92, 246, 0.1)' : '#1A1A24',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="card-outline" size={24} color="#8B5CF6" />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#8B5CF6', marginBottom: 4 }}>Plaid</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 16 }}>Connect bank & brokerage accounts</Text>
              </View>

              {/* Spinner or Arrow */}
              {isConnecting === 'plaid' ? (
                <ActivityIndicator color="#8B5CF6" size="small" />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
              )}
            </TouchableOpacity>

            {/* WalletConnect Button */}
            <TouchableOpacity
              onPress={handleWalletConnectPress}
              disabled={isConnecting !== null}
              style={{
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isConnecting === 'walletconnect' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isConnecting === 'walletconnect' ? 'rgba(59, 130, 246, 0.1)' : '#1A1A24',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="swap-horizontal" size={24} color="#3B82F6" />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#3B82F6', marginBottom: 4 }}>WalletConnect</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 16 }}>Connect Web3 wallets</Text>
              </View>

              {/* Spinner or Arrow */}
              {isConnecting === 'walletconnect' ? (
                <ActivityIndicator color="#3B82F6" size="small" />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
      </Modal>

      {/* WalletConnect Modal */}
      <WalletConnectModal
        isOpen={showWalletConnectModal}
        onClose={handleWalletConnectModalClose}
      />
    </>
  );
}
