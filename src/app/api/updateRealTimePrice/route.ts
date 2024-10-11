import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { updateRealTimePrice } from '@/lib/api/fetchRealTimePrice';

export async function POST(request: NextRequest) {
  // 獲取請求頭中的 x-api-key
  const apiKey = request.headers.get('x-api-key');

  // 檢查 API 密鑰是否有效
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }

  try {
    const updatedStocks = await updateRealTimePrice();
    return NextResponse.json({
      message: '實時股價已更新',
      stockCount: updatedStocks.length,
    });
  } catch (error) {
    console.error('更新實時股價時發生錯誤:', error);
    return NextResponse.json(
      { error: '更新實時股價時發生錯誤' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
