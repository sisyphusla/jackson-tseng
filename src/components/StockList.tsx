'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BaseStockData } from '@/types/stock';
import { StockCard } from '@/components/StockCard';

export default function StockList({
  initialStocks,
}: {
  initialStocks: BaseStockData[];
}) {
  const [visibleStocks, setVisibleStocks] = useState<BaseStockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreStocks = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    const currentLength = visibleStocks.length;
    const nextBatch = initialStocks.slice(currentLength, currentLength + 30);

    setVisibleStocks((prevStocks) => [...prevStocks, ...nextBatch]);
    setIsLoading(false);
  }, [initialStocks, visibleStocks, isLoading]);

  useEffect(() => {
    if (visibleStocks.length === 0) {
      loadMoreStocks();
    }
  }, [loadMoreStocks, visibleStocks.length]);

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
      {isLoading && <div>Loading more stocks...</div>}
    </div>
  );
}
