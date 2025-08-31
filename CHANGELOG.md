# Changelog

All notable changes to the Nifty 50 Stock Tracker project will be documented in this file.

## [2.0.0] - 2024-12-19

### Added
- **Intraday Charts**: 15-minute interval price charts for detailed analysis
- **Previous Day Close Line**: Orange dashed reference line showing yesterday's closing price
- **Volume Analysis**: Trading volume bars displayed below price charts
- **Market Status Indicator**: Live market open/closed status with countdown timer
- **Chart Navigation**: Tap any stock to open detailed chart view
- **Swipe Navigation**: Swipe left/right between stocks in chart view
- **Production APK Build**: Proper signing and release configuration
- **Network Security Config**: HTTPS support for physical devices

### Enhanced
- **Chart Data**: 15-minute intervals during market hours (9:15 AM - 3:30 PM IST)
- **Price Scaling**: Charts now include previous close in price range calculation
- **User Interface**: Improved navigation between list and chart views
- **Performance**: Optimized chart rendering with SVG components

### Technical Improvements
- Added `react-native-svg` for chart rendering
- Enhanced TypeScript interfaces for intraday data
- Improved error handling for chart data fetching
- Better memory management for chart components

## [1.0.0] - 2024-12-18

### Added
- **Real-time Stock Data**: Live prices for all 50 Nifty stocks
- **Stock List View**: Clean interface showing price, change, and percentage
- **Pull-to-Refresh**: Manual data refresh functionality
- **Dark Theme**: Mobile-optimized dark interface
- **Batch API Calls**: Efficient data fetching with rate limiting
- **In-Memory Caching**: 2-minute cache duration for performance
- **Error Handling**: Graceful fallbacks and user feedback
- **Loading States**: Activity indicators during data fetch

### Technical Features
- Yahoo Finance API integration
- NSE symbol support with `.NS` suffix
- Batched requests (10 stocks per batch, 500ms delays)
- Memory cache fallback system
- React Native 0.81 with TypeScript
- Hermes JavaScript engine enabled

### Initial Release
- Android APK support
- Production-ready build configuration
- Network permissions and security setup
- Basic project structure and documentation