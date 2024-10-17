'use client';

import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import StockList from '@/components/StockList';
import { BaseStockData, SortState, SortOption } from '@/types/stock';
import { ArrowUp, ArrowDown } from 'lucide-react';

const sortOptions = [
  { value: 'reportDate', label: '報告日期' },
  { value: 'potentialGrowth', label: '潛在幅度' },
  { value: 'YTD', label: 'YTD' },
] as const;

const parsePercentage = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};

const sortStocks = (
  stocks: BaseStockData[],
  { sortBy, direction }: SortState
): BaseStockData[] => {
  return [...stocks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'reportDate') {
      comparison =
        new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime();
    } else if (sortBy === 'potentialGrowth' || sortBy === 'YTD') {
      comparison = parsePercentage(b[sortBy]) - parsePercentage(a[sortBy]);
    }
    return direction === 'asc' ? comparison : -comparison;
  });
};

export default function SortableStockList({
  initialStocks,
  initialSortState,
}: {
  initialStocks: BaseStockData[];
  initialSortState: SortState;
}) {
  const [sortState, setSortState] = useState<SortState>(initialSortState);

  const sortedStocks = useMemo(
    () => sortStocks(initialStocks, sortState),
    [initialStocks, sortState]
  );

  const handleSortChange = (newSortBy: SortOption) => {
    setSortState((prevState) => ({
      sortBy: newSortBy,
      direction:
        prevState.sortBy === newSortBy && prevState.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const toggleSortDirection = () => {
    setSortState((prev) => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-end space-x-2">
        <Select
          onValueChange={(value) => handleSortChange(value as SortOption)}
          value={sortState.sortBy}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="選擇排序方式" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center justify-between w-full">
                  {option.label}
                  {sortState.sortBy === option.value && (
                    <span className="ml-2">
                      {sortState.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={toggleSortDirection} variant="outline" size="icon">
          {sortState.direction === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <StockList stocks={sortedStocks} />
    </div>
  );
}
