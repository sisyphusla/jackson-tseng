import { NextResponse } from 'next/server';
import { debugFetchStocks } from '@/lib/api/updateStockData';

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: '你想幹嘛' }, { status: 403 });
  }

  const host = request.headers.get('host');

  if (host !== 'localhost:3000') {
    return NextResponse.json(
      { error: '只允許從 localhost:3000 訪問' },
      { status: 403 }
    );
  }

  try {
    const result = await debugFetchStocks();
    return NextResponse.json({
      data: {
        rawData: result.rawData,
        processedData: result.processedData,
      },
    });
  } catch (error) {
    console.error('測試時發生錯誤:', error);
    return NextResponse.json({ error: '測試時發生錯誤' }, { status: 500 });
  }
}
