import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BaseStockData, getStockWithDefaults } from '@/types/stock';
import { getColorClass } from '@/lib/utils';

export function StockCard(props: BaseStockData) {
  const stock = getStockWithDefaults(props);
  const {
    stockCode,
    stockName,
    industry,
    broker,
    currentPrice,
    EPS24F,
    PE24F,
    reportDate,
    potentialGrowth,
    YTD,
  } = stock;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      console.log(`Navigating to /${stockCode}/report`);
      window.location.href = `/${stockCode}/report`;
    },
    [stockCode]
  );

  return (
    <Card className="w-full m-2 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg font-bold">
          {stockCode} {stockName}
        </CardTitle>
        <span className="text-lg font-semibold">現價: {currentPrice}</span>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 pt-3">
        <div className="flex justify-between mb-3">
          <span className="text-sm w-1/2 text-left">
            潛在幅度:{' '}
            <span className={getColorClass(potentialGrowth, true)}>
              {potentialGrowth}
            </span>
          </span>
          <span className="text-sm w-1/2 text-left">產業: {industry}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-sm w-1/2 text-left">EPS24(F): {EPS24F}</span>
          <span className="text-sm w-1/2 text-left">24PE(F): {PE24F}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-sm w-1/2 text-left">
            YTD: <span className={getColorClass(YTD, true)}>{YTD}</span>
          </span>
          <span className="text-sm w-1/2 text-left">券商: {broker}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-xs text-gray-500 w-full text-left">
            報告日期: {reportDate}
          </span>
        </div>
        <div className="mt-4">
          <a href={`/${stockCode}/report`} onClick={handleClick}>
            <Button variant="outline" className="w-full">
              報告動能觀點
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
