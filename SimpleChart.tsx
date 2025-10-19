import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Svg, {Polyline, Line, Text as SvgText} from 'react-native-svg';
import {StockData} from './types';

interface Props {
  stock: StockData;
  width?: number;
  height?: number;
}

const SimpleChart: React.FC<Props> = ({stock, width = 300, height = 200}) => {
  // Generate mock historical data based on current price
  const generateMockData = () => {
    const points = 30;
    const data = [];
    const basePrice = stock.price;
    const volatility = basePrice * 0.02; // 2% volatility
    
    for (let i = 0; i < points; i++) {
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendChange = (stock.changePercent / 100) * basePrice * (i / points);
      const price = basePrice - trendChange + randomChange;
      data.push(Math.max(price, basePrice * 0.95)); // Minimum 5% below current
    }
    
    return data;
  };

  const data = generateMockData();
  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice || 1;

  // Convert data to SVG points
  const points = data.map((price, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((price - minPrice) / priceRange) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = stock.isPositive ? '#4CAF50' : '#F44336';
  const fillColor = stock.isPositive ? '#E8F5E8' : '#FFEBEE';

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Grid lines */}
        <Line x1="0" y1={height/4} x2={width} y2={height/4} stroke="#E0E0E0" strokeWidth="1" />
        <Line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#E0E0E0" strokeWidth="1" />
        <Line x1="0" y1={3*height/4} x2={width} y2={3*height/4} stroke="#E0E0E0" strokeWidth="1" />
        
        {/* Price line */}
        <Polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
        />
        
        {/* Price labels */}
        <SvgText x="5" y="15" fontSize="12" fill="#666">₹{maxPrice.toFixed(0)}</SvgText>
        <SvgText x="5" y={height-5} fontSize="12" fill="#666">₹{minPrice.toFixed(0)}</SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  svg: {
    backgroundColor: '#FAFAFA',
  },
});

export default SimpleChart;