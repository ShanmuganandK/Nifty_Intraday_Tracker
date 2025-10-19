import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, SafeAreaView, ScrollView} from 'react-native';
import {StockData} from './types';

interface Props {
  data: StockData[];
  onStockPress: (stock: StockData, index: number) => void;
  onBack: () => void;
}

const TopMoversScreen: React.FC<Props> = ({data, onStockPress, onBack}) => {
  const gainers = data
    .filter(stock => stock.isPositive)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);

  const losers = data
    .filter(stock => !stock.isPositive)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 10);

  const renderStock = ({item, index}: {item: StockData; index: number}) => (
    <TouchableOpacity 
      style={styles.stockItem}
      onPress={() => onStockPress(item, data.indexOf(item))}
    >
      <View style={styles.stockInfo}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
      </View>
      <View style={[styles.changeContainer, {backgroundColor: item.isPositive ? '#E8F5E8' : '#FFEBEE'}]}>
        <Text style={[styles.change, {color: item.isPositive ? '#2E7D32' : '#C62828'}]}>
          {item.isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Top Movers</Text>
        </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Top Gainers</Text>
          <FlatList
            data={gainers}
            renderItem={renderStock}
            keyExtractor={(item, index) => `gainer-${index}`}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📉 Top Losers</Text>
          <FlatList
            data={losers}
            renderItem={renderStock}
            keyExtractor={(item, index) => `loser-${index}`}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    minWidth: 80,
  },
  backText: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  price: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 2,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TopMoversScreen;