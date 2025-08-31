import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Svg, {Path, Line, Text as SvgText} from 'react-native-svg';
import {IntradayData} from './types';

interface Props {
  data: IntradayData[];
  previousClose: number;
}

const {width: screenWidth} = Dimensions.get('window');
const chartWidth = screenWidth - 40;
const chartHeight = 250;
const volumeHeight = 80;

const LineChart: React.FC<Props> = ({data, previousClose}) => {
  if (!data || data.length === 0) {
    return <View style={styles.container} />;
  }

  const prices = data.map(d => d.price);
  const volumes = data.map(d => d.volume);
  const minPrice = Math.min(...prices, previousClose);
  const maxPrice = Math.max(...prices, previousClose);
  const priceRange = maxPrice - minPrice;
  const maxVolume = Math.max(...volumes);

  const getX = (index: number) => (index / (data.length - 1)) * chartWidth;
  const getY = (price: number) => chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  const pathData = data
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.price);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    })
    .join(' ');

  const previousCloseY = getY(previousClose);
  const getVolumeHeight = (volume: number) => (volume / maxVolume) * volumeHeight;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight + volumeHeight + 60}>
        {/* Previous day close line */}
        <Line
          x1="0"
          y1={previousCloseY}
          x2={chartWidth}
          y2={previousCloseY}
          stroke="#FFA500"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* Price line */}
        <Path
          d={pathData}
          stroke="#4CAF50"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Y-axis labels */}
        <SvgText
          x="5"
          y="15"
          fontSize="12"
          fill="#666"
        >
          ₹{maxPrice.toFixed(0)}
        </SvgText>
        
        <SvgText
          x="5"
          y={chartHeight - 5}
          fontSize="12"
          fill="#666"
        >
          ₹{minPrice.toFixed(0)}
        </SvgText>

        {/* Time labels */}
        <SvgText
          x="10"
          y={chartHeight + 20}
          fontSize="10"
          fill="#666"
        >
          9:15 AM
        </SvgText>
        
        <SvgText
          x={chartWidth - 40}
          y={chartHeight + 20}
          fontSize="10"
          fill="#666"
        >
          3:30 PM
        </SvgText>

        {/* Volume bars */}
        {data.map((point, index) => {
          const x = getX(index);
          const barHeight = getVolumeHeight(point.volume);
          const barY = chartHeight + 40;
          return (
            <Line
              key={index}
              x1={x}
              y1={barY}
              x2={x}
              y2={barY + barHeight}
              stroke="#666"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Volume label */}
        <SvgText
          x="5"
          y={chartHeight + 55}
          fontSize="10"
          fill="#666"
        >
          Volume
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LineChart;