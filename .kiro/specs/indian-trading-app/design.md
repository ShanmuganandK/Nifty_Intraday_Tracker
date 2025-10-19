# Design Document

## Overview

The Indian Market Information App will be built as an enhanced version of the existing Nifty 50 Stock Tracker, focusing on providing comprehensive market data, analysis tools, and educational content while maintaining a free, ad-supported model. The app will primarily use Yahoo Finance API as the core data source, supplemented by additional free and low-cost APIs for enhanced functionality.

## Data Sources Research

### Primary Data Source: Yahoo Finance API
**Current Usage:** Already implemented in the existing app
- **Endpoint:** `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}`
- **Coverage:** NSE (.NS), BSE (.BO) stocks, major indices
- **Data Available:** OHLCV, basic company info, historical data
- **Cost:** Free (with rate limiting considerations)
- **Reliability:** High, but no official support

### Secondary Data Sources (Research Findings)

#### 1. Financial News and Market Updates
**Option A: RSS Feeds (Free)**
- Economic Times RSS: `https://economictimes.indiatimes.com/rssfeedstopstories.cms`
- Moneycontrol RSS: `https://www.moneycontrol.com/rss/results.xml`
- Business Standard RSS: `https://www.business-standard.com/rss/markets-106.rss`
- **Implementation:** Parse RSS feeds for market news
- **Cost:** Free
- **Update Frequency:** Real-time to hourly

**Option B: News APIs**
- NewsAPI.org (limited free tier): Financial news filtering
- Alpha Vantage News API: Market news with sentiment
- **Cost:** $0-50/month depending on usage

#### 2. Enhanced Fundamental Data
**Option A: Alpha Vantage API**
- **Endpoint:** `https://www.alphavantage.co/query`
- **Data:** Company fundamentals, earnings, financial ratios
- **Coverage:** Limited Indian stocks
- **Cost:** Free tier (5 API calls/minute), Premium $49.99/month
- **Pros:** Comprehensive fundamental data
- **Cons:** Limited Indian market coverage

**Option B: Financial Modeling Prep API**
- **Coverage:** Some Indian stocks
- **Data:** Financial statements, ratios, company profiles
- **Cost:** Free tier (250 calls/day), Premium $14/month
- **Pros:** Good coverage of fundamentals
- **Cons:** Limited Indian market focus

**Option C: Scraping Approach (Legal Considerations)**
- Screener.in: Public financial data (with proper attribution)
- MoneyControl: Basic company information
- **Implementation:** Web scraping with caching
- **Legal:** Must comply with robots.txt and terms of service
- **Reliability:** Medium (subject to website changes)

#### 3. Mutual Fund Data
**Option A: AMFI (Association of Mutual Funds in India)**
- **Source:** Official NAV data from AMFI website
- **Data:** Daily NAV, fund information
- **Cost:** Free (public data)
- **Implementation:** Parse AMFI data files
- **Reliability:** High (official source)

**Option B: MFApi.in**
- **Endpoint:** `https://api.mfapi.in/`
- **Data:** Mutual fund NAV, scheme information
- **Cost:** Free
- **Coverage:** Comprehensive Indian mutual funds
- **Reliability:** Good (community maintained)

#### 4. Market Indices and Sector Data
**Option A: NSE Official APIs**
- **Availability:** Limited public access
- **Data:** Official index data, sector performance
- **Cost:** Varies (mostly paid for real-time)
- **Implementation:** Complex registration process

**Option B: Investing.com API**
- **Coverage:** Indian indices, sector data
- **Cost:** Paid tiers available
- **Data:** Index values, sector performance

#### 5. Economic Indicators
**Option A: Reserve Bank of India (RBI) Data**
- **Source:** RBI official website and data releases
- **Data:** Interest rates, inflation, economic indicators
- **Cost:** Free (public data)
- **Implementation:** Parse RBI data releases

**Option B: Trading Economics API**
- **Coverage:** Indian economic indicators
- **Cost:** Free tier available, premium plans
- **Data:** GDP, inflation, interest rates

## Architecture

### Data Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources Layer                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Yahoo Finance  │   RSS Feeds     │    Additional APIs      │
│  (Primary)      │   (News)        │   (Fundamentals/MF)     │
│  - Stock prices │   - ET RSS      │   - Alpha Vantage       │
│  - Historical   │   - MC RSS      │   - AMFI Data           │
│  - Basic info   │   - BS RSS      │   - MFApi.in            │
└─────────────────┴─────────────────┴─────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Data Aggregation Layer                      │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Stock Data     │   News Data     │   Enhanced Data         │
│  Manager        │   Aggregator    │   Manager               │
│  - Price feeds  │   - RSS parser  │   - Fundamentals        │
│  - Caching      │   - News filter │   - MF data             │
│  - Rate limit   │   - Sentiment   │   - Economic data       │
└─────────────────┴─────────────────┴─────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│   UI Components │  Business Logic │    Local Storage        │
│   - Stock lists │  - Calculations │    - Watchlists         │
│   - Charts      │  - Alerts       │    - Preferences        │
│   - News feed   │  - Analytics    │    - Cache              │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Component Architecture

#### Core Components

1. **Enhanced Market Data Provider**
   - Primary: Yahoo Finance API client
   - Secondary: RSS feed parsers
   - Tertiary: Additional API integrations
   - Caching layer with intelligent refresh

2. **News Aggregation Engine**
   - RSS feed parser for multiple sources
   - News categorization and filtering
   - Sentiment analysis (basic keyword-based)
   - Push notification system

3. **Advanced Chart Engine**
   - Enhanced technical indicators
   - Multiple timeframe support
   - Drawing tools and annotations
   - Export and sharing capabilities

4. **Virtual Portfolio Manager**
   - Simulated trading engine
   - Performance tracking and analytics
   - Risk assessment tools
   - Leaderboard system

5. **Educational Content System**
   - Static content management
   - Interactive calculators
   - Tutorial system
   - Progress tracking

6. **Advertisement Integration**
   - Google AdMob integration
   - Strategic ad placement
   - Performance tracking
   - Revenue optimization

## Components and Interfaces

### Data Provider Interface
```typescript
interface IDataProvider {
  getStockPrice(symbol: string): Promise<StockData>;
  getHistoricalData(symbol: string, period: string): Promise<HistoricalData[]>;
  getMarketNews(): Promise<NewsItem[]>;
  getMutualFundData(schemeCode: string): Promise<MutualFundData>;
}
```

### Enhanced Stock Data Model
```typescript
interface EnhancedStockData extends StockData {
  marketCap?: number;
  peRatio?: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  fundamentals?: FundamentalData;
  news?: NewsItem[];
}
```

### News Data Model
```typescript
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  category: 'market' | 'company' | 'economy' | 'policy';
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedStocks?: string[];
}
```

## Data Models

### Virtual Portfolio Model
```typescript
interface VirtualPortfolio {
  id: string;
  name: string;
  initialAmount: number;
  currentValue: number;
  positions: VirtualPosition[];
  transactions: VirtualTransaction[];
  createdAt: Date;
  performance: PortfolioPerformance;
}

interface VirtualPosition {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}
```

### Enhanced Watchlist Model
```typescript
interface EnhancedWatchlist {
  id: string;
  name: string;
  stocks: WatchlistItem[];
  alerts: PriceAlert[];
  createdAt: Date;
  lastModified: Date;
}

interface WatchlistItem {
  symbol: string;
  addedAt: Date;
  targetPrice?: number;
  stopLoss?: number;
  notes?: string;
}
```

## Error Handling

### Data Source Fallback Strategy
1. **Primary Failure (Yahoo Finance):** Use cached data + show warning
2. **Secondary Failure (RSS/News):** Show cached news + disable real-time updates
3. **Complete Failure:** Offline mode with educational content only

### Rate Limiting Strategy
1. **Yahoo Finance:** Batch requests, respect rate limits
2. **RSS Feeds:** Cache for 15-30 minutes
3. **Additional APIs:** Implement exponential backoff

## Testing Strategy

### Data Integration Testing
1. **API Response Validation:** Test all data source responses
2. **Fallback Testing:** Simulate API failures
3. **Performance Testing:** Test with high user load
4. **Data Accuracy Testing:** Validate data consistency across sources

### User Experience Testing
1. **Offline Mode Testing:** Ensure app works without internet
2. **Ad Integration Testing:** Verify ads don't disrupt user experience
3. **Performance Testing:** Test on low-end Android devices
4. **Battery Usage Testing:** Optimize for battery efficiency

## Implementation Phases

### Phase 1A: Enhanced Data Sources (Weeks 1-2)
- Integrate RSS news feeds
- Add more stock symbols (Nifty 100, 200)
- Implement basic mutual fund data via MFApi.in
- Enhanced caching system

### Phase 1B: Advanced Features (Weeks 3-4)
- Virtual portfolio system
- Advanced charting with technical indicators
- Price alerts and notifications
- Educational content system

### Phase 1C: Monetization & Polish (Weeks 5-6)
- Google AdMob integration
- Performance optimization
- UI/UX improvements
- Beta testing and feedback

### Phase 2 Planning: Premium Features
- Real trading integration (future)
- Advanced fundamental data
- Premium ad-free version
- Social features and community

## Revenue Model

### Advertisement Strategy
1. **Banner Ads:** Bottom of stock lists, non-intrusive placement
2. **Interstitial Ads:** Between major screen transitions
3. **Native Ads:** Integrated within news feed
4. **Video Ads:** Optional rewards for premium features

### Projected Revenue Streams
1. **Primary:** Google AdMob revenue
2. **Secondary:** Affiliate links to brokers/investment platforms
3. **Future:** Premium subscription for advanced features
4. **Future:** White-label licensing to financial institutions

## Technical Considerations

### Performance Optimization
- Implement efficient data caching
- Use React Native performance best practices
- Optimize image and asset loading
- Implement lazy loading for large datasets

### Security Considerations
- Secure API key management
- Data encryption for sensitive information
- Secure communication protocols
- Privacy-compliant data handling

### Scalability Planning
- Modular architecture for easy feature addition
- Efficient database design for user data
- CDN integration for static content
- Load balancing considerations for future growth