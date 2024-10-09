import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { BaseStockData } from '@/types/stock';
import Link from 'next/link';
import useSWR from 'swr';
import { Search } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: stocks, error } = useSWR<BaseStockData[]>(
    searchTerm.length > 1
      ? `/api/search?query=${encodeURIComponent(searchTerm)}`
      : null,
    fetcher,
    { dedupingInterval: 5000 }
  );

  const loading = !stocks && !error && searchTerm.length > 1;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setIsSearchVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        const input = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    setIsSearchVisible(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="sm:hidden">
        <button onClick={toggleSearch} className="p-2">
          <Search size={20} />
        </button>
      </div>
      <div
        className={`${
          isSearchVisible ? 'block' : 'hidden'
        } sm:block absolute right-0 top-full sm:relative sm:top-auto sm:right-auto`}
      >
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
        {showResults &&
          (searchTerm.length > 1 || (stocks && stocks.length > 0)) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {loading && <p className="p-2">載入中...</p>}
              {error && <p className="p-2">發生錯誤，請稍後再試</p>}
              {!loading && stocks && stocks.length === 0 && (
                <p className="p-2">沒有找到相關股票</p>
              )}
              {stocks &&
                stocks.slice(0, 5).map((stock, index) => (
                  <Link
                    key={index}
                    href={`/${stock.stockCode}/report`}
                    onClick={clearSearch}
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
    </div>
  );
}
