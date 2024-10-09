'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BaseStockData } from '@/types/stock';
import { StockCard } from '@/components/StockCard';
import Link from 'next/link';

export default function StockList({
  initialStocks,
}: {
  initialStocks: BaseStockData[];
}) {
  const [visibleStocks, setVisibleStocks] = useState<BaseStockData[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const loadMoreStocks = useCallback(() => {
    const currentLength = visibleStocks.length;
    const nextBatch = initialStocks.slice(currentLength, currentLength + 10);
    setVisibleStocks((prevStocks) => [...prevStocks, ...nextBatch]);
  }, [initialStocks, visibleStocks]);

  useEffect(() => {
    loadMoreStocks();

    const handleScroll = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
          loadMoreStocks();
        }
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMoreStocks]);

  return (
    <div
      ref={listRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 "
    >
      {visibleStocks.map((stock: BaseStockData) => (
        <Link
          key={stock.stockCode}
          href={`/${stock.stockCode}/report`}
          passHref
          prefetch={false}
        >
          <StockCard {...stock} />
        </Link>
      ))}
    </div>
  );
}
