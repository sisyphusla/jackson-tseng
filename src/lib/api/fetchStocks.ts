import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { BaseStockData, getStockWithDefaults } from '@/types/stock';

let stocksCache: BaseStockData[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘緩存
const STALE_DURATION = 30 * 1000; // 30 秒後視為過期

const s3Client = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function fetchStocks(
  stockCode?: string
): Promise<BaseStockData[] | BaseStockData | null> {
  const now = Date.now();

  // 如果緩存不存在或已完全過期，從 R2 重新讀取
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
    const getCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'stocksData.json',
    });

    const response = await s3Client.send(getCommand);
    const stocksData = await response.Body!.transformToString();
    stocksCache = JSON.parse(stocksData).map((stock: Partial<BaseStockData>) =>
      getStockWithDefaults(stock)
    );
    lastFetchTime = Date.now();
  } catch (error) {
    console.error('讀取股票數據時發生錯誤:', error);
    if (!stocksCache) stocksCache = [];
  }
}
