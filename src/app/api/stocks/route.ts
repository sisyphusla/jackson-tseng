import { NextResponse } from 'next/server';
import { fetchStocks } from '@/lib/api/fetchStocks';

export async function GET() {
  try {
    const stocks = await fetchStocks();
    return NextResponse.json(stocks);
  } catch {
    return NextResponse.json(
      { message: '獲取股票數據時發生錯誤' },
      { status: 500 }
    );
  }
}
