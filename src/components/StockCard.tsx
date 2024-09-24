import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface StockCardProps {
  stockCode: string;
  stockName: string;
  industry: string;
  currentPrice: string;
  yearToDateReturn: string;
  targetPrice: string;
  reportDate: string;
  analyst: string;
  reportMomentum: string;
  marketValue: string;
  eps24F: string;
  pe24F: string;
}

export function StockCard(props: StockCardProps) {
  const { 
    stockCode, 
    stockName, 
    industry, 
    currentPrice, 
    marketValue,
    eps24F,
    pe24F,
    reportDate
  } = props;

  return (
    <Card className="w-full m-2 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg font-bold">{stockCode} {stockName}</CardTitle>
        <span className="text-lg font-semibold">現價: {currentPrice}</span>
      </CardHeader>
      <Separator/>
      <CardContent className="p-4 pt-3">
        <div className="flex justify-between mb-3">
          <span className="text-sm w-1/2 text-left">市值: {marketValue}</span>
          <span className="text-sm w-1/2 text-right">產業: {industry}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-sm w-1/2 text-left">EPS24(F): {eps24F}</span>
          <span className="text-sm w-1/2 text-right">24PE(F): {pe24F}</span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">報告日期: {reportDate}</p>
          <Link href={`/stock/${stockCode}/report`} passHref>
            <Button variant="outline" className="w-full">
              報告動能觀點
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}