import { NextResponse } from 'next/server';
import { fetchStocks } from '@/lib/api/fetchStocks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
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
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching stocks' },
      { status: 500 }
    );
  }
}