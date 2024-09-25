import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Info, TrendingUp, PieChart } from 'lucide-react';
import { InfoCard } from '@/components/InfoCard';
import { fetchStockReport } from '@/lib/api/fetchStockReport';
import { fetchStocks } from '@/lib/api/fetchStocks';
import { notFound } from 'next/navigation';

export const revalidate = 3600 * 4; // 4 hours

export async function generateStaticParams() {
  const stocks = await fetchStocks();
  return stocks.map((stock) => ({
    stockCode: stock.stockCode,
  }));
}

export default async function StockReportPage({
  params,
}: {
  params: { stockCode: string };
}) {
  const stock = await fetchStockReport(params.stockCode);

  if (!stock) {
    notFound();
  }

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
    } else {
      return numValue > 0
        ? 'text-red-500 font-bold'
        : numValue < 0
        ? 'text-green-500'
        : '';
    }

    return '';
  };
  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-3.5rem)]">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center justify-between space-y-2">
          <CardTitle className="text-2xl font-bold w-full">
            <div className="flex justify-evenly items-center flex-wrap gap-2">
              <span>
                {stock.stockCode}
                {'   '}
                {stock.stockName}
              </span>
              <span>現價：{stock.currentPrice}</span>
              <span>{stock.reportDate}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-cols-fr gap-4">
            <InfoCard
              title="價格"
              icon={DollarSign}
              items={[
                [
                  { label: '年初價格：', value: stock.yearStartPrice },
                  { label: '目標價：', value: stock.targetPrice },
                ],
                [
                  {
                    label: 'YTD：',
                    value: stock.yearToDateReturn,
                    colorClass: getColorClass(stock.yearToDateReturn),
                  },
                  {
                    label: '潛在幅度：',
                    value: stock.potentialGrowth,
                    colorClass: getColorClass(stock.potentialGrowth, true),
                  },
                ],
              ]}
            />
            <InfoCard
              title="基本資訊"
              icon={Info}
              items={[
                [
                  { label: '市值：', value: stock.marketValue },
                  { label: '券商：', value: stock.analyst },
                ],
                [{ label: '產業：', value: stock.industry }],
              ]}
            />
            <InfoCard
              title="EPS"
              icon={TrendingUp}
              items={[
                [
                  { label: '24EPS(F)：', value: stock.eps24F },
                  { label: '25EPS(F)：', value: stock.eps25F },
                ],
                [
                  {
                    label: 'YoY：',
                    value: stock.yearOverYearGrowth,
                    colorClass: getColorClass(stock.yearOverYearGrowth, true),
                  },
                ],
              ]}
            />
            <InfoCard
              title="P/E Ratio"
              icon={PieChart}
              items={[
                [{ label: '24EPS(F)：', value: stock.pe24F }],
                [{ label: '(T)PE：', value: stock.targetPE }],
              ]}
            />
          </div>

          <div className="w-full mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">報告動能觀點</CardTitle>
              </CardHeader>
              <CardContent className="whitespace-pre-line leading-relaxed tracking-widest">
                {stock.reportMomentum.map((paragraph, index) => (
                  <React.Fragment key={index}>
                    {'-'} {paragraph}
                    {index < stock.reportMomentum.length - 1 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
