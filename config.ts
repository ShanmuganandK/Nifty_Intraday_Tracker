// App Configuration - Easily adjustable settings
export const CONFIG = {
  // Data fetching settings
  BATCH_SIZE: 10,
  DELAY_BETWEEN_BATCHES: 500, // milliseconds
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  
  // Chart settings
  CHART_INTERVAL: '15m', // 1m, 5m, 15m, 30m, 1h, 1d
  
  // Market hours (IST)
  MARKET_OPEN_HOUR: 9,
  MARKET_OPEN_MINUTE: 15,
  MARKET_CLOSE_HOUR: 15,
  MARKET_CLOSE_MINUTE: 30,
  
  // Performance settings
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT: 10000, // 10 seconds
  
  // Feature flags (for future use)
  FEATURES: {
    WATCHLIST: true,
    PRICE_ALERTS: false,
    BACKGROUND_REFRESH: false,
    ADS_ENABLED: false,
  }
};