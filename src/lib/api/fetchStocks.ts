import fs from 'fs/promises';
import path from 'path';
import { BaseStockData, getStockWithDefaults } from '@/types/stock';

let stocksCache: BaseStockData[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘緩存
let lastFetchTime = 0;

export async function fetchStocks(
  stockCode?: string
): Promise<BaseStockData[] | BaseStockData | null> {
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
      stocksCache = JSON.parse(stocksData).map(
        (stock: Partial<BaseStockData>) => getStockWithDefaults(stock)
      );
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
