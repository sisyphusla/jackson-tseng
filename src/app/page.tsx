import { Suspense } from 'react';
import { fetchStocks } from '@/lib/api/fetchStocks';
import { BaseStockData } from '@/types/stock';
import dynamic from 'next/dynamic';

const StockList = dynamic(() => import('@/components/StockList'), {
  ssr: true,
  loading: () => <div>Loading...</div>,
});

export const revalidate = 14400; // 4 小時 (3600 * 4 秒)

async function getStocks(): Promise<BaseStockData[]> {
  const stocks = await fetchStocks();
  return Array.isArray(stocks) ? stocks : [];
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
