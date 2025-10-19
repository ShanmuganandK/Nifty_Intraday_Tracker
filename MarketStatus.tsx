import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MarketStatus: React.FC = () => {
  const now = new Date();
  const hour = now.getHours();
  const isMarketOpen = hour >= 9 && hour < 16; // 9 AM to 4 PM

  return (
    <View style={[styles.container, {backgroundColor: isMarketOpen ? '#E8F5E8' : '#FFEBEE'}]}>
      <Text style={[styles.status, {color: isMarketOpen ? '#2E7D32' : '#C62828'}]}>
        {isMarketOpen ? '🟢 Market Open' : '🔴 Market Closed'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MarketStatus;