let watchlist: string[] = [];
let subscribers: ((watchlist: string[]) => void)[] = [];

export const WatchlistManager = {
  async initialize() {
    // Initialize with empty watchlist for now
    watchlist = [];
  },

  getWatchlist(): string[] {
    return [...watchlist];
  },

  isInWatchlist(symbol: string): boolean {
    return watchlist.includes(symbol);
  },

  async addToWatchlist(symbol: string) {
    if (!watchlist.includes(symbol)) {
      watchlist.push(symbol);
      this.notifySubscribers();
    }
  },

  async removeFromWatchlist(symbol: string) {
    watchlist = watchlist.filter(s => s !== symbol);
    this.notifySubscribers();
  },

  subscribe(callback: (watchlist: string[]) => void) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  },

  notifySubscribers() {
    subscribers.forEach(callback => callback([...watchlist]));
  }
};