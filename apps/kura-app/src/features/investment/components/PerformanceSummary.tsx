import React from 'react';
import { View, Text } from 'react-native';

interface PerformanceSummaryProps {
  totalValue: number;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PerformanceSummary({ totalValue }: PerformanceSummaryProps) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 24, marginBottom: 16 }}>
      <Text style={{ color: '#999999', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 }}>Investments</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', marginTop: 8 }}>{formatCurrency(totalValue)}</Text>
      <Text style={{ color: '#666666', fontSize: 14, marginTop: 8 }}>Grouped by connected accounts</Text>
    </View>
  );
}
