'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BaseStockData } from '@/types/stock';
import { StockCard } from '@/components/StockCard';

const ITEMS_PER_PAGE = 30;

export default function StockList({ stocks }: { stocks: BaseStockData[] }) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const loadMoreStocks = useCallback(() => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + ITEMS_PER_PAGE, stocks.length)
    );
  }, [stocks.length]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [stocks]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        loadMoreStocks();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreStocks]);

  const visibleStocks = useMemo(() => {
    return stocks.slice(0, visibleCount);
  }, [stocks, visibleCount]);

  const memoizedStockCards = useMemo(() => {
    return visibleStocks.map((stock: BaseStockData, index: number) => (
      <StockCard
        key={`${stock.stockCode}-${stock.stockName}-${index}`}
        {...stock}
      />
    ));
  }, [visibleStocks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memoizedStockCards}
      {visibleCount < stocks.length && (
        <div className="col-span-full text-center py-4">
          正在載入更多股票...
        </div>
      )}
    </div>
  );
}
