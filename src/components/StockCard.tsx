import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface StockCardProps {
  stockCode: string;
  stockName: string;
  industry: string;
  currentPrice: string;
  yearToDateReturn: string;
  targetPrice: string;
  reportDate: string;
  analyst: string;
  reportMomentum: string[];
  eps24F: string;
  pe24F: string;
  potentialGrowth: string;
}

export function StockCard(props: StockCardProps) {
  const {
    stockCode,
    stockName,
    industry,
    analyst,
    currentPrice,
    eps24F,
    pe24F,
    reportDate,
    potentialGrowth,
  } = props;
  const getColorClass = (value: string, isGrowth = false) => {
    const numValue = parseFloat(value.replace('%', ''));
    if (isNaN(numValue)) return '';

    if (isGrowth) {
      if (numValue > 0) {
        if (numValue > 20) return 'text-pink-600 font-bold';
        if (numValue > 15) return 'text-pink-500 font-bold';
        if (numValue > 10) return 'text-pink-400 font-bold';
        if (numValue > 5) return 'text-pink-300 font-bold';
        return 'text-pink-200 font-bold';
      } else if (numValue < 0) {
        if (numValue < -20) return 'text-green-800';
        if (numValue < -15) return 'text-green-700';
        if (numValue < -10) return 'text-green-600';
        if (numValue < -5) return 'text-green-500';
        return 'text-green-400 font-bold';
      }
    }

    return '';
  };
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
          <span className="text-sm w-1/2 text-left">EPS24(F): {eps24F}</span>
          <span className="text-sm w-1/2 text-left">24PE(F): {pe24F}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-xs text-gray-500 w-1/2 text-left">
            報告日期: {reportDate}
          </span>
          <span className="text-xs text-gray-500 w-1/2 text-left">
            券商: {analyst}
          </span>
        </div>
        <div className="mt-4">
          <Link href={`/${stockCode}/report`} passHref>
            <Button variant="outline" className="w-full">
              報告動能觀點
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
