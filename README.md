# Nifty 50 Stock Tracker

A comprehensive mobile application for Android that provides real-time stock data and intraday charts for the Nifty 50 index, designed specifically for Indian day traders and investors.

## Description

This application is built for day traders and investors in India who need professional-grade stock monitoring tools in a clean, mobile-friendly interface. It combines real-time data with technical analysis features without the complexity of full trading platforms.

## Features

### Core Features
*   **Real-time stock data** for all 50 Nifty stocks with live price updates
*   **Intraday charts** with 15-minute intervals for detailed price analysis
*   **Previous day close reference** - Orange dashed line showing yesterday's closing price
*   **Volume analysis** - Trading volume bars below price charts
*   **Market status indicator** - Live market open/closed status with countdown timer
*   **Clean, dark theme interface** optimized for mobile trading
*   **Pull-to-refresh** functionality for manual data updates
*   **Tap-to-chart navigation** - Tap any stock to view detailed intraday chart
*   **Swipe navigation** between stocks in chart view

### Technical Features
*   **Batched API calls** with rate limiting to prevent API throttling
*   **In-memory caching** with 2-minute expiration for optimal performance
*   **Network security configuration** for reliable HTTPS connections
*   **Production-ready APK** builds with proper signing and optimization
*   **Error handling** with graceful fallbacks and user feedback

## Installation

### For End Users (Recommended)
1. Download the latest APK from releases
2. Enable "Install from unknown sources" in Android settings
3. Install the APK - works offline without any setup

### For Developers

#### Prerequisites
*   Node.js 18+ and npm
*   React Native CLI
*   Android Studio with Android SDK
*   Java Development Kit (JDK) 11+

#### Development Setup
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/nifty50-tracker.git
    cd Nifty50Tracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start Metro bundler:
    ```bash
    npx react-native start
    ```

4.  Run on Android (development):
    ```bash
    npx react-native run-android
    ```

#### Production Build
1.  Build release APK:
    ```bash
    cd android && gradlew assembleRelease
    ```

2.  APK location:
    ```
    android/app/build/outputs/apk/release/app-release.apk
    ```

## Usage Guide

### Main Screen
*   **Stock List** - Shows all 50 Nifty stocks with current prices
*   **Green/Red indicators** - Positive/negative price changes
*   **Market Status** - Live indicator showing market open/closed with countdown
*   **Pull down** to refresh data manually

### Chart Screen
*   **Tap any stock** from main list to open detailed chart
*   **Orange dashed line** - Previous day's closing price
*   **Green line** - Current day's price movement (15-min intervals)
*   **Gray bars** - Trading volume for each 15-minute period
*   **Swipe left/right** to navigate between different stocks
*   **Back button** to return to main stock list

### Market Hours
*   **Trading Hours**: 9:15 AM - 3:30 PM (Monday to Friday)
*   **Pre-Market**: Before 9:15 AM on weekdays
*   **After Hours**: After 3:30 PM on weekdays
*   **Weekend**: Market closed indicator

## Technical Architecture

### Data Sources
*   **Yahoo Finance API** - Real-time stock prices and intraday data
*   **15-minute intervals** for intraday charts during market hours (9:15 AM - 3:30 PM IST)
*   **NSE symbols** with `.NS` suffix for all Nifty 50 stocks
*   **No API key required** - Uses Yahoo's public endpoints

### Performance Optimizations
*   **Batch processing** - Fetches 10 stocks per batch with 500ms delays
*   **Smart caching** - 2-minute cache duration with memory fallback
*   **Rate limiting** - Prevents API throttling and ensures reliability
*   **Hermes engine** - Enabled for faster JavaScript execution

### Market Data Coverage
*   All 50 Nifty stocks including major sectors:
    - Banking: HDFCBANK, ICICIBANK, SBIN, AXISBANK, KOTAKBANK
    - IT: TCS, INFY, HCLTECH, WIPRO, TECHM
    - Energy: RELIANCE, ONGC, BPCL, NTPC, POWERGRID
    - Auto: MARUTI, M&M, BAJAJ-AUTO, HEROMOTOCO, TATAMOTORS
    - Pharma: SUNPHARMA, DRREDDY, CIPLA, DIVISLAB
    - FMCG: HINDUNILVR, ITC, BRITANNIA, NESTLEIND, TATACONSUM

## Built With

*   **React Native 0.81** - Cross-platform mobile framework
*   **TypeScript** - Type-safe JavaScript development
*   **React Native SVG** - Chart rendering and graphics
*   **Yahoo Finance API** - Real-time market data
*   **Hermes** - JavaScript engine for performance
*   **Android Gradle Plugin** - Build system and APK generation

## Version History

### v2.0.0 (Latest)
*   ✅ Intraday charts with 15-minute intervals
*   ✅ Previous day close reference line
*   ✅ Volume analysis bars
*   ✅ Market status indicator with countdown
*   ✅ Tap-to-chart navigation
*   ✅ Swipe navigation between stocks
*   ✅ Production APK builds

### v1.0.0
*   ✅ Real-time Nifty 50 stock prices
*   ✅ Pull-to-refresh functionality
*   ✅ Dark theme interface
*   ✅ Basic error handling

## Troubleshooting

### Common Issues
1. **Blank screen on physical device**: Make sure you're installing the release APK, not debug APK
2. **Network errors**: Check internet connection and ensure HTTPS is allowed
3. **Charts not loading**: Verify market hours - charts show data only during trading sessions
4. **App crashes**: Uninstall old version before installing updated APK

### Build Issues
1. **Metro connection errors**: Use `adb reverse tcp:8081 tcp:8081` for physical devices
2. **Gradle build failures**: Run `cd android && gradlew clean` before building
3. **SVG rendering issues**: Ensure react-native-svg is properly linked

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
*   New features (watchlists, alerts, more chart types)
*   Bug fixes and performance improvements
*   UI/UX enhancements
*   Additional market data integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for informational purposes only. Stock prices are delayed and should not be used for actual trading decisions. Always consult with financial advisors and use official trading platforms for investment activities.