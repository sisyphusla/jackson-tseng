import fs from 'fs/promises';
import path from 'path';
import yahooFinance from 'yahoo-finance2';
import axios from 'axios';

// 設置全局配置
yahooFinance.setGlobalConfig({
  noticesAsWarnings: true,
} as any);

// 抑制特定警告
yahooFinance.suppressNotices(['ripHistorical']);

interface TaiwanStock {
  StockName: string;
  YahooFinanceSymbol: string;
  YearStartPrice?: string;
  LastUpdated?: string;
}

interface StockLookup {
  [key: string]: TaiwanStock;
}

interface TradingDayCache {
  [year: number]: string;
}

const CACHE_FILE = path.join(process.cwd(), 'trading_days_cache.json');

function handleError(error: any, context: string) {
  console.error(`錯誤發生在 ${context}:`);
  if (axios.isAxiosError(error)) {
    // Axios 錯誤
    if (error.response) {
      console.error(`  狀態碼: ${error.response.status}`);
      console.error(`  錯誤信息: ${error.response.data.error || '未知錯誤'}`);
    } else if (error.request) {
      console.error('  無法發送請求，可能是網絡問題');
    } else {
      console.error(`  錯誤信息: ${error.message}`);
    }
  } else if (error instanceof Error) {
    console.error(`  錯誤類型: ${error.name}`);
    console.error(`  錯誤信息: ${error.message}`);
  } else {
    console.error(`  未知錯誤: ${error}`);
  }
}

async function loadCache(): Promise<TradingDayCache> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveCache(cache: TradingDayCache): Promise<void> {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function findFirstTradingDay(year: number): Promise<Date> {
  const cache = await loadCache();
  if (cache[year]) {
    console.log(`使用緩存的第一個交易日: ${cache[year]}`);
    return new Date(cache[year]);
  }

  console.log(`查找 ${year} 年的第一個交易日...`);
  const marketSymbol = '^TWII';
  const potentialDates = [2, 3, 4, 5];

  for (const day of potentialDates) {
    const currentDate = new Date(year, 0, day);
    try {
      const result = await yahooFinance.chart(marketSymbol, {
        period1: currentDate,
        period2: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
        interval: '1d',
      });
      if (result.quotes && result.quotes.length > 0) {
        const firstTradingDay = new Date(result.quotes[0].date);
        cache[year] = firstTradingDay.toISOString();
        await saveCache(cache);
        console.log(`找到第一個交易日: ${firstTradingDay.toISOString()}`);
        return firstTradingDay;
      }
    } catch (error) {
      handleError(error, `查找 ${year}年1月${day}日交易數據`);
    }
  }
  throw new Error(`無法找到 ${year}年的第一個交易日`);
}

async function getStockPrice(
  symbol: string,
  startDate: Date,
  endDate: Date,
  isNAStock: boolean = false
): Promise<string> {
  const period1 = Math.floor(startDate.getTime() / 1000);
  const period2 = isNAStock
    ? Math.floor(new Date().getTime() / 1000) // 如果是 N/A 股票，使用今天的日期
    : Math.floor(endDate.getTime() / 1000);

  const queries = ['query1', 'query2'];

  for (const query of queries) {
    const url = `https://${query}.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=1d`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.chart.result && data.chart.result[0].indicators.quote[0].open) {
        const openPrices = data.chart.result[0].indicators.quote[0].open;
        for (let i = 0; i < openPrices.length; i++) {
          if (openPrices[i] !== null) {
            return openPrices[i].toFixed(2);
          }
        }
      }

      console.log(
        `無法從 ${query} 獲取 ${symbol} 的有效開盤價格，嘗試下一個查詢。`
      );
    } catch (error) {
      handleError(error, `使用 ${query} 獲取 ${symbol} 價格`);
    }
  }

  // 如果 Yahoo Finance API 失敗，嘗試使用 yahooFinance.chart
  try {
    console.log(`嘗試使用 yahooFinance.chart 獲取 ${symbol} 價格`);
    return await getStockPriceUsingYahooFinance(
      symbol,
      startDate,
      isNAStock ? new Date() : endDate
    );
  } catch (error) {
    handleError(error, `使用 yahooFinance.chart 獲取 ${symbol} 價格`);
  }

  return '#N/A';
}

async function getStockPriceUsingYahooFinance(
  symbol: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  try {
    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d',
    });
    if (result.quotes && result.quotes.length > 0 && result.quotes[0].open) {
      return result.quotes[0].open.toFixed(2);
    }
  } catch (error) {
    handleError(error, `使用 yahooFinance.chart 獲取 ${symbol} 價格`);
  }
  return '#N/A';
}

async function getYearStartPrices(
  symbols: string[],
  stockLookup: StockLookup
): Promise<Map<string, string>> {
  const year = new Date().getFullYear();
  console.log(`獲取 ${year} 年的股票價格...`);
  const startDate = await findFirstTradingDay(year);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  const priceMap = new Map<string, string>();

  for (const symbol of symbols) {
    try {
      console.log(`正在獲取股票 ${symbol} 的價格...`);
      const isNAStock =
        Object.values(stockLookup).find(
          (stock) => stock.YahooFinanceSymbol === symbol
        )?.YearStartPrice === '#N/A';
      const price = await getStockPrice(symbol, startDate, endDate, isNAStock);
      priceMap.set(symbol, price);
      console.log(`股票 ${symbol} 的價格: ${price}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 增加延遲到1秒
    } catch (error) {
      handleError(error, `獲取股票 ${symbol} 的價格`);
      priceMap.set(symbol, '#N/A');
    }
  }

  return priceMap;
}

export async function updateYearStartPrices(): Promise<number> {
  const taiwanStocksPath = path.join(
    process.cwd(),
    'src',
    'data',
    'taiwan_stocks.json'
  );
  let updatedCount = 0;

  try {
    const taiwanStocksData = await fs.readFile(taiwanStocksPath, 'utf-8');
    const stockLookup: StockLookup = JSON.parse(taiwanStocksData);

    const symbolsToUpdate = Object.values(stockLookup)
      .filter(
        (stock) =>
          stock.YearStartPrice === '#N/A' ||
          !stock.LastUpdated ||
          new Date(stock.LastUpdated).getFullYear() !== new Date().getFullYear()
      )
      .map((stock) => stock.YahooFinanceSymbol);

    console.log(`需要更新的股票數量: ${symbolsToUpdate.length}`);

    if (symbolsToUpdate.length === 0) {
      console.log('沒有需要更新的股票');
      return 0;
    }

    const yearStartPrices = await getYearStartPrices(
      symbolsToUpdate,
      stockLookup
    );

    for (const [stockCode, stockInfo] of Object.entries(stockLookup)) {
      if (yearStartPrices.has(stockInfo.YahooFinanceSymbol)) {
        const newPrice = yearStartPrices.get(stockInfo.YahooFinanceSymbol);
        if (newPrice !== stockInfo.YearStartPrice) {
          stockInfo.YearStartPrice = newPrice;
          stockInfo.LastUpdated = new Date().toISOString();
          updatedCount++;
          console.log(`更新股票 ${stockCode}: ${newPrice}`);
        }
      }
    }

    await fs.writeFile(taiwanStocksPath, JSON.stringify(stockLookup, null, 2));

    return updatedCount;
  } catch (error) {
    handleError(error, '更新年初股價');
    throw error;
  }
}
