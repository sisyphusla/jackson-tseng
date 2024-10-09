import fs from 'fs/promises';
import path from 'path';

export interface Stock {
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
  YahooFinanceSymbol?: string;
  lastUpdated?: number;
}

let stocksCache: Stock[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘緩存
let lastFetchTime = 0;

export async function fetchStocks(
  stockCode?: string
): Promise<Stock[] | Stock | null> {
  const now = Date.now();
  if (!stocksCache || now - lastFetchTime > CACHE_DURATION) {
    try {
      const dataPath = path.join(
        process.cwd(),
        'src',
        'data',
        'stocksData.json'
      );
      const stocksData = await fs.readFile(dataPath, 'utf-8');
      stocksCache = JSON.parse(stocksData) as Stock[];
      lastFetchTime = now;
    } catch (error) {
      console.error('讀取股票數據時發生錯誤:', error);
      return stockCode ? null : [];
    }
  }

  if (stockCode) {
    return stocksCache!.find((s) => s.stockCode === stockCode) || null;
  }

  return stocksCache!;
}
