import { NextResponse } from 'next/server';
import { fetchAndSaveStocks } from '@/lib/api/updateStockData';

export async function GET() {
  try {
    const updatedStocks = await fetchAndSaveStocks();
    return NextResponse.json({
      message: '股票基本數據已更新',
      stockCount: updatedStocks.length,
    });
  } catch (error) {
    console.error('更新股票數據時發生錯誤:', error);
    return NextResponse.json(
      { error: '更新股票數據時發生錯誤' },
      { status: 500 }
    );
  }
}
