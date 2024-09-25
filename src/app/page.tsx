import { Suspense } from 'react';
import { fetchStocks, Stock } from '@/lib/api/fetchStocks';
import StockList from '@/components/StockList';

export const revalidate = 3600 * 4; // 4 hours

async function getStocks(): Promise<Stock[]> {
  const stocks = await fetchStocks();
  return stocks;
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
