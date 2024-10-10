import fs from 'fs/promises';
import path from 'path';
import { BaseStockData, getStockWithDefaults } from '@/types/stock';

let stocksCache: BaseStockData[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘緩存
const STALE_DURATION = 30 * 1000; // 30 秒後視為過期

export async function fetchStocks(
  stockCode?: string
): Promise<BaseStockData[] | BaseStockData | null> {
  const now = Date.now();

  // 如果緩存不存在或已完全過期，從文件重新讀取
  if (!stocksCache || now - lastFetchTime > CACHE_DURATION) {
    await refreshCache();
  } else if (now - lastFetchTime > STALE_DURATION) {
    // 如果數據過期但未完全過期，異步刷新緩存
    refreshCache().catch(console.error);
  }

  if (stockCode) {
    return stocksCache!.find((s) => s.stockCode === stockCode) || null;
  }

  return stocksCache!;
}

async function refreshCache() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'stocksData.json');
    const stocksData = await fs.readFile(dataPath, 'utf-8');
    stocksCache = JSON.parse(stocksData).map((stock: Partial<BaseStockData>) =>
      getStockWithDefaults(stock)
    );
    lastFetchTime = Date.now();
  } catch (error) {
    console.error('讀取股票數據時發生錯誤:', error);
    if (!stocksCache) stocksCache = [];
  }
}
