import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Dimensions} from 'react-native';
import {StockData} from './types';
import SimpleChart from './SimpleChart';

interface Props {
  stock: StockData;
  onBack: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const StockDetailScreen: React.FC<Props> = ({stock, onBack, onSwipeLeft, onSwipeRight}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.symbol}>{stock.symbol}</Text>
        </View>
      
      <View style={styles.priceSection}>
        <Text style={styles.price}>₹{stock.price.toFixed(2)}</Text>
        <View style={[styles.changeContainer, {backgroundColor: stock.isPositive ? '#E8F5E8' : '#FFEBEE'}]}>
          <Text style={[styles.change, {color: stock.isPositive ? '#2E7D32' : '#C62828'}]}>
            {stock.isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartControls}>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={styles.timeButtonText}>1D</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={styles.timeButtonText}>1W</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.timeButton, styles.activeTimeButton]}>
            <Text style={[styles.timeButtonText, styles.activeTimeButtonText]}>1M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={styles.timeButtonText}>3M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={styles.timeButtonText}>1Y</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          <SimpleChart 
            stock={stock} 
            width={Dimensions.get('window').width - 64} 
            height={200} 
          />
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity onPress={onSwipeLeft} style={styles.navButton}>
            <Text style={styles.navButtonText}>← Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSwipeRight} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  symbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  priceSection: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  price: {
    fontSize: 32,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  changeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartSection: {
    flex: 1,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  chartControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeTimeButton: {
    backgroundColor: '#1976D2',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
  },
  activeTimeButtonText: {
    color: '#fff',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1976D2',
    borderRadius: 20,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default StockDetailScreen;