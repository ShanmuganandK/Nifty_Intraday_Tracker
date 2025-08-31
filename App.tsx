import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {YahooStockData, StockData} from './types';
import StockDetailScreen from './StockDetailScreen';
import MarketStatus from './MarketStatus';

const NIFTY50_SYMBOLS = [
  'ADANIENT.NS', 'ADANIPORTS.NS', 'APOLLOHOSP.NS', 'ASIANPAINT.NS', 'AXISBANK.NS',
  'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BPCL.NS', 'BHARTIARTL.NS',
  'BRITANNIA.NS', 'CIPLA.NS', 'COALINDIA.NS', 'DIVISLAB.NS', 'DRREDDY.NS', 'EICHERMOT.NS',
  'GRASIM.NS', 'HCLTECH.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS', 'HEROMOTOCO.NS', 'HINDALCO.NS',
  'HINDUNILVR.NS', 'ICICIBANK.NS', 'ITC.NS', 'INDUSINDBK.NS', 'INFY.NS', 'JSWSTEEL.NS',
  'KOTAKBANK.NS', 'LTIM.NS', 'LT.NS', 'M&M.NS', 'MARUTI.NS', 'NTPC.NS', 'NESTLEIND.NS', 'ONGC.NS',
  'POWERGRID.NS', 'RELIANCE.NS', 'SBILIFE.NS', 'SBIN.NS', 'SUNPHARMA.NS', 'TCS.NS',
  'TATACONSUM.NS', 'TATAMOTORS.NS', 'TATASTEEL.NS', 'TECHM.NS', 'TITAN.NS', 'UPL.NS',
  'ULTRACEMCO.NS', 'WIPRO.NS'
];

const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES = 500;
const CACHE_KEY = 'nifty50_data';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// In-memory fallback cache
let memoryCache: {data: StockData[], timestamp: number} | null = null;

const App = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const fetchStockData = async (symbol: string): Promise<StockData | null> => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: YahooStockData = await response.json();
      
      if (!result.chart?.result?.[0]) {
        return null;
      }
      
      const data = result.chart.result[0];
      const meta = data.meta;
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      
      if (!currentPrice || !previousClose) {
        return null;
      }
      
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      return {
        symbol: symbol.replace('.NS', ''),
        price: currentPrice,
        change,
        changePercent,
        isPositive: change >= 0
      };
    } catch (error) {
      console.warn(`Failed to fetch data for ${symbol}:`, error);
      return null;
    }
  };

  const fetchDataInBatches = async () => {
    const allData: StockData[] = [];
    
    for (let i = 0; i < NIFTY50_SYMBOLS.length; i += BATCH_SIZE) {
      const batch = NIFTY50_SYMBOLS.slice(i, i + BATCH_SIZE);
      const promises = batch.map(fetchStockData);
      const results = await Promise.all(promises);
      
      const validResults = results.filter((item): item is StockData => item !== null);
      allData.push(...validResults);
      
      if (i + BATCH_SIZE < NIFTY50_SYMBOLS.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }
    
    return allData;
  };

  const loadCachedData = async (): Promise<{data: StockData[], timestamp: number} | null> => {
    return memoryCache;
  };

  const saveCachedData = async (stockData: StockData[]) => {
    const cacheData = {
      data: stockData,
      timestamp: Date.now()
    };
    memoryCache = cacheData;
  };

  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const fetchAndCacheData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      
      const results = await fetchDataInBatches();
      setData(results);
      setLastUpdated(new Date());
      await saveCachedData(results);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchAndCacheData(true);
  };

  useEffect(() => {
    const initializeData = async () => {
      const cached = await loadCachedData();
      
      if (cached && isCacheValid(cached.timestamp)) {
        setData(cached.data);
        setLastUpdated(new Date(cached.timestamp));
        setLoading(false);
      } else {
        if (cached) {
          setData(cached.data);
          setLastUpdated(new Date(cached.timestamp));
        }
        await fetchAndCacheData();
      }
    };

    initializeData();
  }, []);

  const renderItem = ({ item, index }: { item: StockData; index: number }) => {
    return (
      <TouchableOpacity 
        style={styles.item}
        onPress={() => {
          setSelectedStock(item);
          setSelectedIndex(index);
        }}
      >
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
          <Text style={[styles.change, { color: item.isPositive ? '#4CAF50' : '#F44336' }]}>
            {item.isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.error}>Error fetching data. Please try again later.</Text>
      </View>
    );
  }

  if (selectedStock) {
    return (
      <StockDetailScreen
        stock={selectedStock}
        onBack={() => setSelectedStock(null)}
        onSwipeLeft={() => {
          const newIndex = selectedIndex > 0 ? selectedIndex - 1 : data.length - 1;
          setSelectedStock(data[newIndex]);
          setSelectedIndex(newIndex);
        }}
        onSwipeRight={() => {
          const newIndex = selectedIndex < data.length - 1 ? selectedIndex + 1 : 0;
          setSelectedStock(data[newIndex]);
          setSelectedIndex(newIndex);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Nifty 50 Stock Tracker</Text>
        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </View>
      <MarketStatus />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  symbol: {
    fontSize: 18,
    color: '#fff',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    color: '#fff',
  },
  change: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
});

export default App;
