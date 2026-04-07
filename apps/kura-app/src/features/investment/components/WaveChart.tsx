import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinanceStore } from '../../../shared/store/useFinanceStore';

interface WaveChartProps {
  selectedTimeRange: '1M' | '3M' | '6M' | '1Y' | 'All';
  onTimeRangeChange: (timeRange: '1M' | '3M' | '6M' | '1Y' | 'All') => void;
}

const timeRanges = ['1M', '3M', '6M', '1Y', 'All'] as const;

export default function WaveChart({ selectedTimeRange, onTimeRangeChange }: WaveChartProps) {
  const chartDataByTimeRange = useFinanceStore((state) => state.chartDataByTimeRange);
  const chartData = chartDataByTimeRange[selectedTimeRange];

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      <View style={{ height: 100, backgroundColor: '#1A1A24', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.2)', padding: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* 柱狀波浪圖 */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%', height: 70, gap: 4 }}>
          {chartData.map((height, index) => (
            <LinearGradient
              key={index}
              colors={['#8B5CF6', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                flex: 1,
                height: `${height * 100}%`,
                borderRadius: 4,
                opacity: 0.8,
              }}
            />
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4, gap: 8 }}>
        {timeRanges.map((timeRange) => (
          <TouchableOpacity
            key={timeRange}
            onPress={() => onTimeRangeChange(timeRange)}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: selectedTimeRange === timeRange ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              borderWidth: 1,
              borderColor: selectedTimeRange === timeRange ? 'rgba(139, 92, 246, 0.5)' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: selectedTimeRange === timeRange ? '#8B5CF6' : '#666666', fontSize: 11, fontWeight: selectedTimeRange === timeRange ? '600' : '400' }}>
              {timeRange}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
