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

export async function fetchStocks(): Promise<Stock[]> {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'stocksData.json');
    const stocksData = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(stocksData) as Stock[];
  } catch (error) {
    console.error('讀取股票數據時發生錯誤:', error);
    return [];
  }
}

export async function fetchStockReport(
  stockCode: string
): Promise<Stock | null> {
  const stocks = await fetchStocks();
  return stocks.find((s) => s.stockCode === stockCode) || null;
}
