import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { fetchAndSaveStocks } from '@/lib/api/updateStockData';

export async function POST(request: NextRequest) {
  // 獲取請求頭中的 x-api-key
  const apiKey = request.headers.get('x-api-key');

  // 檢查 API 密鑰是否有效
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }

  try {
    await fetchAndSaveStocks();

    return NextResponse.json({
      message: '股票數據已完整更新',
    });
  } catch (error) {
    console.error('更新股票數據時發生錯誤:', error);
    return NextResponse.json(
      { error: '更新股票數據時發生錯誤' },
      { status: 500 }
    );
  }
}
