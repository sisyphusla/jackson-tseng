// src/app/page.tsx

import { Suspense } from 'react';
import { fetchStocks } from '@/lib/api/fetchStocks';
import {
  BaseStockData,
  SortState,
  SortOption,
  SortDirection,
} from '@/types/stock';
import SortableStockList from '@/components/SortableStockList';
import { cookies } from 'next/headers';

export const revalidate = 3600 * 1; // 1 hour

const validSortOptions: SortOption[] = ['reportDate', 'potentialGrowth', 'YTD'];

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
  const cookieStore = cookies();
  const sortPreference = cookieStore.get('stockSortPreference')
    ?.value as SortOption;
  const directionPreference = cookieStore.get('stockSortDirection')
    ?.value as SortDirection;

  const initialSortState: SortState = {
    sortBy: validSortOptions.includes(sortPreference)
      ? sortPreference
      : 'reportDate',
    direction: directionPreference === 'desc' ? 'desc' : 'asc',
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
