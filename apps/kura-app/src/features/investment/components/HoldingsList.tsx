import React from 'react';
import { View, Text } from 'react-native';
import HoldingCard from './HoldingCard';

interface Investment {
  id: string;
  symbol: string;
  logo: string;
  holdings: number;
  currentPrice: number;
  change24h: number;
}

interface HoldingsListProps {
  investments: Investment[];
  selectedAccountId: string | null;
}

export default function HoldingsList({ investments, selectedAccountId }: HoldingsListProps) {
  // Calculate total portfolio value
  const totalValue = investments.reduce((sum, inv) => sum + inv.holdings * inv.currentPrice, 0);

  return (
    <View style={{ paddingHorizontal: 24 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
          {selectedAccountId ? `Holdings (${investments.length})` : `All Holdings (${investments.length})`}
        </Text>
      </View>

      {investments.length > 0 ? (
        <View style={{ gap: 12 }}>
          {investments.map((investment) => (
            <HoldingCard key={investment.id} investment={investment} totalValue={totalValue} />
          ))}
        </View>
      ) : (
        <View style={{ paddingVertical: 24, alignItems: 'center', paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>No holdings found</Text>
        </View>
      )}
    </View>
  );
}
