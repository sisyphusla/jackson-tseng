import { fetchStocks, Stock } from '@/lib/api/fetchStocks';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<Stock[]>> {
  const stocks = await fetchStocks();
  return NextResponse.json(stocks);
}

export const revalidate = 3600 * 4; // 4 hours
