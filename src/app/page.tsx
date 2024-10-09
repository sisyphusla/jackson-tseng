import { Suspense } from 'react';
import { fetchStocks } from '@/lib/api/fetchStocks';
import { BaseStockData } from '@/types/stock';
import StockList from '@/components/StockList';

export const revalidate = 3600 * 4; // 4 hours

async function getStocks(): Promise<BaseStockData[]> {
  const stocks = await fetchStocks();
  if (Array.isArray(stocks)) {
    return stocks;
  } else {
    console.error('Unexpected return type from fetchStocks');
    return [];
  }
}

export default async function Home() {
  const initialStocks = await getStocks();

  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <StockList initialStocks={initialStocks} />
      </Suspense>
    </main>
  );
}
