import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Info, TrendingUp, PieChart } from 'lucide-react';
import { fetchStockReport } from '@/lib/api/fetchStockReport';
import { fetchStocks } from '@/lib/api/fetchStocks';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // 1 hours

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
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">價格</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        年初價格：
                      </span>
                      <span className="text-xs font-medium">
                        {stock.yearStartPrice}
                      </span>
                    </div>
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        目標價：
                      </span>
                      <span className="text-xs font-medium">
                        {stock.targetPrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        YTD：
                      </span>
                      <span
                        className={`text-xs font-medium ${getColorClass(
                          stock.yearToDateReturn
                        )}`}
                      >
                        {stock.yearToDateReturn}
                      </span>
                    </div>
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        潛在幅度：
                      </span>
                      <span
                        className={`text-xs font-medium ${getColorClass(
                          stock.potentialGrowth,
                          true
                        )}`}
                      >
                        {stock.potentialGrowth}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">基本資訊</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        市值：
                      </span>
                      <span className="text-xs ">{stock.marketValue}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        產業：
                      </span>
                      <span className="text-xs ">{stock.industry}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EPS</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        24EPS(F)：
                      </span>
                      <span className="text-xs font-medium">
                        {stock.eps24F}
                      </span>
                    </div>
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        25EPS(F)：
                      </span>
                      <span className="text-xs font-medium">
                        {stock.eps25F}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        YoY：
                      </span>
                      <span
                        className={`text-xs font-medium ${getColorClass(
                          stock.yearOverYearGrowth,
                          true
                        )}`}
                      >
                        {stock.yearOverYearGrowth}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">P/E Ratio</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        24EPS(F)：
                      </span>
                      <span className="text-xs font-medium">{stock.pe24F}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-start items-center">
                      <span className="text-xs text-muted-foreground">
                        (T)PE：
                      </span>
                      <span className="text-xs font-medium">
                        {stock.targetPE}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
