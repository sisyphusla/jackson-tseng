import { NextResponse } from 'next/server';
import { fetchAndSaveStocks } from '@/lib/api/updateStockData';

export async function POST() {
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
