import yahooFinance from 'yahoo-finance2';
import fs from 'fs/promises';
import path from 'path';

interface StockData {
  stockCode: string;
  stockName: string;
  YahooFinanceSymbol: string;
  currentPrice?: string;
  yearStartPrice?: string;
  YTD?: string;
  targetPrice?: string;
  potentialGrowth?: string;
  marketCap?: string;
  EPS24F?: string;
  PE24F?: string;
  TPE?: string;
  lastUpdated?: number;
  [key: string]: string | number | undefined;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache duration
const BATCH_SIZE = 50; // Number of stocks per batch

async function updateRealTimePrice() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'stocksData.json');
    let stocksData = JSON.parse(
      await fs.readFile(dataPath, 'utf-8')
    ) as StockData[];

    const currentTime = Date.now();
    const stocksToUpdate = stocksData.filter(
      (stock) =>
        !stock.lastUpdated || currentTime - stock.lastUpdated > CACHE_DURATION
    );

    for (let i = 0; i < stocksToUpdate.length; i += BATCH_SIZE) {
      const batch = stocksToUpdate.slice(i, i + BATCH_SIZE);
      const symbols = batch
        .map((stock) => stock.YahooFinanceSymbol)
        .filter(Boolean);

      try {
        const quotes = await yahooFinance.quote(symbols);

        batch.forEach((stock) => {
          if (stock.YahooFinanceSymbol) {
            const quote = quotes.find(
              (q) => q.symbol === stock.YahooFinanceSymbol
            );
            if (quote) {
              const currentPrice = quote.regularMarketPrice || 0;
              const yearStartPrice = parseFloat(stock.yearStartPrice || '0');
              const targetPrice = parseFloat(stock.targetPrice || '0');
              const eps24F = parseFloat(stock['EPS24F'] || '0');

              stock.currentPrice = currentPrice.toFixed(2);
              stock.YTD =
                yearStartPrice > 0
                  ? (
                      ((currentPrice - yearStartPrice) / yearStartPrice) *
                      100
                    ).toFixed(2) + '%'
                  : 'N/A';
              stock.potentialGrowth =
                currentPrice > 0
                  ? (
                      ((targetPrice - currentPrice) / currentPrice) *
                      100
                    ).toFixed(2) + '%'
                  : 'N/A';
              stock.marketCap = quote.marketCap
                ? formatMarketCap(quote.marketCap)
                : 'N/A';

              // Calculate PE24F
              stock['PE24F'] =
                eps24F > 0 ? (currentPrice / eps24F).toFixed(2) + 'x' : 'N/A';

              // Calculate TPE
              stock['TPE'] =
                targetPrice > 0 && eps24F > 0
                  ? (targetPrice / eps24F).toFixed(2) + 'x'
                  : 'N/A';

              stock.lastUpdated = currentTime;
            }
          }
        });

        // Add delay after each batch
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error updating batch (${i}-${i + BATCH_SIZE}):`, error);
      }
    }

    await fs.writeFile(dataPath, JSON.stringify(stocksData, null, 2));

    console.log('Stock data update completed');
    console.log('First five updated records:');
    stocksData.slice(0, 5).forEach((stock, index) => {
      console.log(
        `${index + 1}. ${stock.stockCode} - ${stock.stockName}: Current Price ${
          stock.currentPrice
        }, YTD ${stock.YTD}, ` +
          `Potential Growth ${stock.potentialGrowth}, Market Cap ${stock.marketCap}, PE24F ${stock['PE24F']}, TPE ${stock['TPE']}`
      );
    });

    return stocksData;
  } catch (error) {
    console.error('Error updating stock data:', error);
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
