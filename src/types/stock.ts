export interface BaseStockData {
  stockCode: string;
  stockName: string;
  industry: string;
  yearStartPrice: string;
  currentPrice: string;
  YTD: string;
  targetPrice: string;
  potentialGrowth: string;
  currentYearEPS: string;
  nextYearEPS: string;
  YoY: string;
  currentYearPE: string;
  TPE: string;
  marketCap: string;
  reportDate: string;
  broker: string;
  reportMomentumView: string;
  YahooFinanceSymbol: string;
  lastUpdated?: number;
}

export function getStockWithDefaults(
  stock: Partial<BaseStockData>
): BaseStockData {
  return {
    stockCode: stock.stockCode || '',
    stockName: stock.stockName || '',
    industry: stock.industry || '',
    yearStartPrice: stock.yearStartPrice || '',
    currentPrice: stock.currentPrice || '',
    YTD: stock.YTD || '',
    targetPrice: stock.targetPrice || '',
    potentialGrowth: stock.potentialGrowth || '',
    currentYearEPS: stock.currentYearEPS || '',
    nextYearEPS: stock.nextYearEPS || '',
    YoY: stock.YoY || '',
    currentYearPE: stock.currentYearPE || '',
    TPE: stock.TPE || '',
    marketCap: stock.marketCap || '',
    reportDate: stock.reportDate || '',
    broker: stock.broker || '',
    reportMomentumView: stock.reportMomentumView || '',
    YahooFinanceSymbol: stock.YahooFinanceSymbol || '',
    lastUpdated: stock.lastUpdated,
  };
}
export type SortDirection = 'asc' | 'desc';
export type SortOption = 'reportDate' | 'potentialGrowth' | 'YTD';

export interface SortState {
  sortBy: SortOption;
  direction: SortDirection;
}
