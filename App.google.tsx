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
import {YahooStockData, StockData} from './types';
import StockDetailScreen from './StockDetailScreen';
import MarketStatus from './MarketStatus';
import {WatchlistManager} from './WatchlistManager';
import TopMoversScreen from './TopMoversScreen';

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
const CACHE_DURATION = 2 * 60 * 1000;

let memoryCache: {data: StockData[], timestamp: number} | null = null;

const App = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [showTopMovers, setShowTopMovers] = useState(false);

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

  const fetchAndCacheData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      
      const results = await fetchDataInBatches();
      setData(results);
      setLastUpdated(new Date());
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
      await WatchlistManager.initialize();
      setWatchlist(WatchlistManager.getWatchlist());
      await fetchAndCacheData();
    };

    initializeData();
    
    const unsubscribe = WatchlistManager.subscribe(setWatchlist);
    return unsubscribe;
  }, []);

  const toggleWatchlist = async (symbol: string) => {
    if (WatchlistManager.isInWatchlist(symbol)) {
      await WatchlistManager.removeFromWatchlist(symbol);
    } else {
      await WatchlistManager.addToWatchlist(symbol);
    }
  };

  const renderItem = ({ item, index }: { item: StockData; index: number }) => {
    const isInWatchlist = WatchlistManager.isInWatchlist(item.symbol);
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {
          setSelectedStock(item);
          setSelectedIndex(index);
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.symbolContainer}>
            <View style={styles.symbolRow}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <TouchableOpacity 
                onPress={() => toggleWatchlist(item.symbol)}
                style={styles.heartButton}
              >
                <Text style={[styles.heart, {color: isInWatchlist ? '#FF6B6B' : '#DDD'}]}>
                  {isInWatchlist ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.companyName}>NSE</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
            <View style={[styles.changeContainer, { backgroundColor: item.isPositive ? '#E8F5E8' : '#FFEBEE' }]}>
              <Text style={[styles.change, { color: item.isPositive ? '#2E7D32' : '#C62828' }]}>
                {item.isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={{ color: '#5F6368', marginTop: 16 }}>Loading stock data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.error}>Unable to fetch stock data</Text>
        <Text style={{ color: '#5F6368', marginTop: 8, textAlign: 'center' }}>Please check your internet connection and try again</Text>
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

  if (showTopMovers) {
    return (
      <TopMoversScreen
        data={data}
        onStockPress={(stock, index) => {
          setSelectedStock(stock);
          setSelectedIndex(index);
          setShowTopMovers(false);
        }}
        onBack={() => setShowTopMovers(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Nifty 50</Text>
        <Text style={styles.subtitle}>National Stock Exchange of India</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setShowWatchlistOnly(!showWatchlistOnly)}
            style={[styles.filterButton, {backgroundColor: showWatchlistOnly ? '#1976D2' : '#E0E0E0'}]}
          >
            <Text style={[styles.filterText, {color: showWatchlistOnly ? '#fff' : '#5F6368'}]}>
              {showWatchlistOnly ? '♥ Watchlist' : 'All Stocks'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowTopMovers(true)}
            style={styles.filterButton}
          >
            <Text style={styles.filterText}>📊 Top Movers</Text>
          </TouchableOpacity>
        </View>
        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Updated {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </View>
      <MarketStatus />
      <FlatList
        data={showWatchlistOnly ? data.filter(item => watchlist.includes(item.symbol)) : data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1976D2"
            colors={['#1976D2']}
          />
        }
        ListEmptyComponent={
          showWatchlistOnly ? (
            <View style={styles.emptyWatchlist}>
              <Text style={styles.emptyText}>No stocks in watchlist</Text>
              <Text style={styles.emptySubtext}>Tap ♡ to add stocks to your watchlist</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#5F6368',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 12,
    color: '#5F6368',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
  error: {
    color: '#D93025',
    fontSize: 16,
    textAlign: 'center',
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartButton: {
    marginLeft: 8,
    padding: 4,
  },
  heart: {
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5F6368',
  },
  emptyWatchlist: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#202124',
    fontSize: 18,
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#5F6368',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;