import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Stock } from '@/lib/api/fetchStocks';
import Link from 'next/link';

export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      if (searchTerm.length < 2) {
        setStocks([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchStocks();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <Input
        type="text"
        placeholder="搜尋股票代碼或名稱"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        className="w-64"
      />
      {showResults && (searchTerm.length > 1 || stocks.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {loading && <p className="p-2">載入中...</p>}
          {!loading && stocks.length === 0 && (
            <p className="p-2">沒有找到相關股票</p>
          )}
          {stocks.slice(0, 5).map((stock, index) => (
            <Link
              key={index}
              href={`/stock/${stock.stockCode}/report`}
              onClick={() => setShowResults(false)}
            >
              <div className="p-2 hover:bg-gray-100">
                <p className="font-bold">
                  {stock.stockCode} - {stock.stockName}
                </p>
                <p className="text-sm text-gray-600">{stock.industry}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
