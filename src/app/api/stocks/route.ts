import { NextResponse } from 'next/server';
import { fetchStocks } from '@/lib/api/fetchStocks';

export async function GET() {
  try {
    const stocks = await fetchStocks();
    const response = NextResponse.json(stocks);
    response.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate'
    );
    return response;
  } catch {
    return NextResponse.json(
      { message: '獲取股票數據時發生錯誤' },
      { status: 500 }
    );
  }
}
