import { NextResponse } from 'next/server';
import { fetchStocks } from '@/lib/api/fetchStocks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: '需要提供查詢參數' }, { status: 400 });
  }

  try {
    const stocks = await fetchStocks();
    const filteredStocks = stocks.filter(
      (stock) =>
        stock.stockCode.toLowerCase().includes(query.toLowerCase()) ||
        stock.stockName.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json(filteredStocks);
  } catch (error) {
    console.error('搜索股票時發生錯誤:', error);
    return NextResponse.json(
      { error: '搜索股票時發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
