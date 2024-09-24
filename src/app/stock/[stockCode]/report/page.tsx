import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, DollarSign, TrendingUp, Activity, BarChart2, PieChart, LineChart, Briefcase } from "lucide-react"
import { fetchStockReport } from "@/lib/api/fetchStockReport"

export default async function StockReportPage({ params }: { params: { stockCode: string } }) {
  const stock = await fetchStockReport(params.stockCode)

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{stock.stockCode} {stock.stockName} 詳細資訊</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 左側欄 */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">現價</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stock.currentPrice}</div>
                  <p className="text-xs text-muted-foreground">
                    YTD: {stock.yearToDateReturn}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">目標價</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stock.targetPrice}</div>
                  <p className="text-xs text-muted-foreground">
                    潛在漲幅: {((Number(stock.targetPrice) / Number(stock.currentPrice) - 1) * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">產業分析</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">{stock.industry}</div>
                  <p className="text-xs text-muted-foreground">
                    市值: {stock.marketValue}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 中間欄 */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">EPS預測</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">EPS24(F): {stock.eps24F}</div>
                  <p className="text-xs text-muted-foreground">
                    24PE(F): {stock.pe24F}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">報告動能</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">{stock.reportMomentum}</div>
                  <p className="text-xs text-muted-foreground">
                    報告日期: {stock.reportDate}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">分析師觀點</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">{stock.analyst}</div>
                </CardContent>
              </Card>
            </div>

            {/* 右側欄 */}
            <div className="lg:col-span-1 md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>股票詳細資訊</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>項目</TableHead>
                        <TableHead>數值</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(stock).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}