'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
    console.log('Loading more stocks...');
    const currentLength = visibleStocks.length;
    const nextBatch = initialStocks.slice(currentLength, currentLength + 30);

    setVisibleStocks((prevStocks) => {
      const newStocks = [...prevStocks, ...nextBatch];
      console.log(`Visible stocks count: ${newStocks.length}`);
      return newStocks;
    });

    setIsLoading(false);
  }, [initialStocks, visibleStocks, isLoading]);

  useEffect(() => {
    if (visibleStocks.length === 0) {
      loadMoreStocks();
    }
  }, [loadMoreStocks]);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleStocks.map((stock: BaseStockData, index: number) => (
        <StockCard
          key={`${stock.stockCode}-${stock.stockName}-${index}`}
          {...stock}
        />
      ))}
      {isLoading && <div>Loading more stocks...</div>}
    </div>
  );
}
