import yahooFinance from 'yahoo-finance2';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { BaseStockData } from '@/types/stock';

const UPDATE_THRESHOLD = 20 * 60 * 1000; // 20 min
const BATCH_SIZE = 50; // 每批次處理的股票數量

const s3Client = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function updateRealTimePrice() {
  try {
    // 從 R2 讀取股票數據
    const getCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'stocksData.json',
    });

    const response = await s3Client.send(getCommand);
    const stocksData = JSON.parse(
      await response.Body!.transformToString()
    ) as BaseStockData[];

    const currentTime = Date.now();
    const stocksToUpdate = stocksData.filter(
      (stock) =>
        !stock.lastUpdated || currentTime - stock.lastUpdated > UPDATE_THRESHOLD
    );

    if (stocksToUpdate.length === 0) {
      console.log('All stocks are up to date. No updates needed.');
      return stocksData;
    }

    for (let i = 0; i < stocksToUpdate.length; i += BATCH_SIZE) {
      const batch = stocksToUpdate.slice(i, i + BATCH_SIZE);
      const symbols = batch
        .map((stock) => stock.YahooFinanceSymbol)
        .filter(Boolean);

      try {
        const quotes = await yahooFinance.quote(symbols);
        const currentYear = new Date().getFullYear().toString().slice(-2);

        batch.forEach((stock) => {
          if (stock.YahooFinanceSymbol) {
            const quote = quotes.find(
              (q) => q.symbol === stock.YahooFinanceSymbol
            );
            if (quote) {
              const currentPrice = quote.regularMarketPrice || 0;
              const yearStartPrice = parseFloat(stock.yearStartPrice || '0');
              const targetPrice = parseFloat(stock.targetPrice || '0');
              const currentYearEPS = parseFloat(stock.currentYearEPS || '0');

              stock.currentPrice = currentPrice.toFixed(2);
              stock.YTD =
                yearStartPrice > 0
                  ? (
                      ((currentPrice - yearStartPrice) / yearStartPrice) *
                      100
                    ).toFixed(2) + '%'
                  : '';
              stock.potentialGrowth =
                currentPrice > 0
                  ? (
                      ((targetPrice - currentPrice) / currentPrice) *
                      100
                    ).toFixed(2) + '%'
                  : '';
              stock.marketCap = quote.marketCap
                ? formatMarketCap(quote.marketCap)
                : '';

              stock.currentYearPE =
                currentYearEPS > 0
                  ? (currentPrice / currentYearEPS).toFixed(2) + 'x'
                  : '';
              stock.TPE =
                targetPrice > 0 && currentYearEPS > 0
                  ? (targetPrice / currentYearEPS).toFixed(2) + 'x'
                  : '';

              stock.lastUpdated = currentTime;
            }
          }
        });

        // 每批次處理後添加延遲
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`更新批次 (${i}-${i + BATCH_SIZE}) 時發生錯誤:`, error);
      }
    }

    // 將更新後的數據寫回 R2
    const putCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'stocksData.json',
      Body: JSON.stringify(stocksData),
      ContentType: 'application/json',
    });
    await s3Client.send(putCommand);

    console.log(`股票數據更新完成，更新了 ${stocksToUpdate.length} 筆記錄`);
    console.log('前五筆更新後的記錄:');
    stocksData.slice(0, 5).forEach((stock, index) => {
      console.log(
        `${index + 1}. ${stock.stockCode} - ${stock.stockName}: 現價 ${
          stock.currentPrice
        }, ` +
          `年初至今 ${stock.YTD}, 潛在成長 ${stock.potentialGrowth}, 市值 ${stock.marketCap}, ` +
          `本益比(預估) ${stock.currentYearPE}, 目標本益比 ${stock.TPE}`
      );
    });

    return stocksData;
  } catch (error) {
    console.error('更新股票數據時發生錯誤:', error);
    throw error;
  }
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return (marketCap / 1e12).toFixed(2) + '兆';
  } else if (marketCap >= 1e8) {
    return (marketCap / 1e8).toFixed(2) + '億';
  } else if (marketCap >= 1e4) {
    return (marketCap / 1e4).toFixed(2) + '萬';
  } else {
    return marketCap.toFixed(2);
  }
}

export { updateRealTimePrice };
