'use client';

import { BaseStockData } from '@/types/stock';
import { StockCard } from '@/components/StockCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StockList({
  initialStocks,
}: {
  initialStocks: BaseStockData[];
}) {
  const { data: stocks } = useSWR<BaseStockData[]>('/api/stocks', fetcher, {
    fallbackData: initialStocks,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stocks?.map((stock: BaseStockData, index: number) => (
        <StockCard key={stock.stockCode || index} {...stock} />
      ))}
    </div>
  );
}
