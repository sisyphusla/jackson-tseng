import { Stock, fetchStocks } from './fetchStocks';

export async function fetchStockReport(
  stockCode: string
): Promise<Stock | null> {
  const stocks = await fetchStocks();
  const stock = stocks.find((s) => s.stockCode === stockCode);
  if (!stock) {
    console.log(`Stock with code ${stockCode} not found`);
    return null;
  }
  return stock;
}
