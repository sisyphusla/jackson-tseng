import { Stock, fetchStocks } from './fetchStocks';

export async function fetchStockReport(stockCode: string): Promise<Stock> {
  const stocks = await fetchStocks();
  const stock = stocks.find(s => s.stockCode === stockCode);
  if (!stock) {
    throw new Error(`Stock with code ${stockCode} not found`);
  }
  return stock;
}