import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, BarChart2 } from 'lucide-react';
import { fetchStockReport } from '@/lib/api/fetchStockReport';

export default async function StockReportPage({
  params,
}: {
  params: { stockCode: string };
}) {
  const stock = await fetchStockReport(params.stockCode);

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center justify-between space-y-2">
          <CardTitle className="text-2xl font-bold w-full">
            <div className="flex justify-evenly items-center flex-wrap gap-2">
              <span>
                {stock.stockCode}
                {'   '}
                {stock.stockName}
              </span>
              <span>{stock.industry}</span>
              <span>現價：{stock.currentPrice}</span>
              <span>市值：{stock.marketValue}</span>
              <span>{stock.reportDate}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">價格</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">年初價格：</span>
                  <span className="text-lg font-bold">
                    {stock.yearStartPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">目標價：</span>
                  <span className="text-lg font-bold">{stock.targetPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">YTD：</span>
                  <span className="text-xs text-muted-foreground">
                    {stock.yearToDateReturn}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    潛在幅度：
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stock.potentialGrowth}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  EPS & P/E Ratio
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">EPS</p>
                    <p className="text-lg">24F: {stock.eps24F}</p>
                    <p className="text-lg">25F: {stock.eps25F}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">P/E Ratio</p>
                    <p className="text-lg">24F: {stock.pe24F}</p>
                    <p className="text-lg">25F: {stock.targetPE}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  年增長: {stock.yearOverYearGrowth}
                </p>
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
                    {paragraph}
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
