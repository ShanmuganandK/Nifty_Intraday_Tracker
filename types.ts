export interface YahooMeta {
  currency: string;
  symbol: string;
  regularMarketPrice: number;
  previousClose: number;
  gmtoffset: number;
  timezone: string;
  exchangeName: string;
  instrumentType: string;
  firstTradeDate: number;
  regularMarketTime: number;
  hasPrePostMarketData: boolean;
  gmtOffsetMilliseconds: number;
  currentTradingPeriod: any;
  dataGranularity: string;
  range: string;
  validRanges: string[];
}

export interface YahooResult {
  meta: YahooMeta;
  timestamp: number[];
  indicators: {
    quote: Array<{
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>;
  };
}

export interface YahooStockData {
  chart: {
    result: YahooResult[];
    error: any;
  };
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

export interface IntradayData {
  time: Date;
  price: number;
  volume: number;
}