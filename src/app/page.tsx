import { Suspense } from 'react';
import { fetchStocks } from '@/lib/api/fetchStocks';
import { BaseStockData, SortState, SortOption } from '@/types/stock';
import SortableStockList from '@/components/SortableStockList';

export const revalidate = 3600 * 1; // 1 hour

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
  const initialSortState: SortState = {
    sortBy: 'reportDate',
    direction: 'asc',
  };

  const initialStocks = await getStocks();

  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>載入中...</div>}>
        <SortableStockList
          initialStocks={initialStocks}
          initialSortState={initialSortState}
        />
      </Suspense>
    </main>
  );
}
