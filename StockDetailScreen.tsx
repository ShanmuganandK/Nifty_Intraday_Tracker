import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {StockData, IntradayData} from './types';
import LineChart from './LineChart';

interface Props {
  stock: StockData;
  onBack: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const StockDetailScreen: React.FC<Props> = ({stock, onBack, onSwipeLeft, onSwipeRight}) => {
  const [chartData, setChartData] = useState<IntradayData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntradayData = async () => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}.NS?interval=15m&range=1d`
      );
      const result = await response.json();
      
      if (result.chart?.result?.[0]) {
        const data = result.chart.result[0];
        const timestamps = data.timestamp || [];
        const prices = data.indicators?.quote?.[0]?.close || [];
        const volumes = data.indicators?.quote?.[0]?.volume || [];
        
        const intradayData: IntradayData[] = timestamps.map((time: number, index: number) => ({
          time: new Date(time * 1000),
          price: prices[index] || 0,
          volume: volumes[index] || 0,
        })).filter(item => item.price > 0);
        
        setChartData(intradayData);
      }
    } catch (error) {
      console.warn('Failed to fetch intraday data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntradayData();
  }, [stock.symbol]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.stockInfo}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.price}>₹{stock.price.toFixed(2)}</Text>
          <Text style={[styles.change, {color: stock.isPositive ? '#4CAF50' : '#F44336'}]}>
            {stock.isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <LineChart data={chartData} previousClose={stock.price - stock.change} />
        )}
      </View>

      <View style={styles.swipeHint}>
        <Text style={styles.hintText}>← Swipe to navigate between stocks →</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    color: '#fff',
    fontSize: 24,
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  price: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
  },
  change: {
    fontSize: 16,
    marginTop: 2,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  swipeHint: {
    padding: 15,
    alignItems: 'center',
  },
  hintText: {
    color: '#666',
    fontSize: 12,
  },
});

export default StockDetailScreen;