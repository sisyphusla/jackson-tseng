export interface BaseStockData {
  stockCode: string;
  stockName: string;
  industry: string;
  yearStartPrice: string;
  currentPrice: string;
  YTD: string;
  targetPrice: string;
  potentialGrowth: string;
  EPS24F: string;
  EPS25F: string;
  YoY: string;
  PE24F: string;
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
    yearStartPrice: stock.yearStartPrice || 'N/A',
    currentPrice: stock.currentPrice || 'N/A',
    YTD: stock.YTD || 'N/A',
    targetPrice: stock.targetPrice || 'N/A',
    potentialGrowth: stock.potentialGrowth || 'N/A',
    EPS24F: stock.EPS24F || 'N/A',
    EPS25F: stock.EPS25F || 'N/A',
    YoY: stock.YoY || 'N/A',
    PE24F: stock.PE24F || 'N/A',
    TPE: stock.TPE || 'N/A',
    marketCap: stock.marketCap || 'N/A',
    reportDate: stock.reportDate || '',
    broker: stock.broker || '',
    reportMomentumView: stock.reportMomentumView || '',
    YahooFinanceSymbol: stock.YahooFinanceSymbol || '',
    lastUpdated: stock.lastUpdated,
  };
}
