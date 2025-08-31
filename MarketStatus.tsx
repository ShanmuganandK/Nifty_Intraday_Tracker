import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MarketStatus: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Market hours: 9:15 AM (555 minutes) to 3:30 PM (930 minutes)
      const marketOpen = 9 * 60 + 15; // 555
      const marketClose = 15 * 60 + 30; // 930
      
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
      
      if (!isWeekday) {
        setStatus('Market Closed - Weekend');
        setCountdown('');
        return;
      }
      
      if (currentTime >= marketOpen && currentTime <= marketClose) {
        setStatus('Market Open');
        const minutesToClose = marketClose - currentTime;
        const hours = Math.floor(minutesToClose / 60);
        const minutes = minutesToClose % 60;
        setCountdown(`Closes in ${hours}h ${minutes}m`);
      } else if (currentTime < marketOpen) {
        setStatus('Pre-Market');
        const minutesToOpen = marketOpen - currentTime;
        const hours = Math.floor(minutesToOpen / 60);
        const minutes = minutesToOpen % 60;
        setCountdown(`Opens in ${hours}h ${minutes}m`);
      } else {
        setStatus('After Hours');
        const minutesToNextOpen = (24 * 60) - currentTime + marketOpen;
        const hours = Math.floor(minutesToNextOpen / 60);
        setCountdown(`Opens in ${hours}h`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status === 'Market Open') return '#4CAF50';
    if (status === 'Pre-Market') return '#FFA500';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, {backgroundColor: getStatusColor()}]} />
      <Text style={styles.status}>{status}</Text>
      {countdown ? <Text style={styles.countdown}>{countdown}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  status: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  countdown: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default MarketStatus;