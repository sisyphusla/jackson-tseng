import { NextResponse } from 'next/server';
import { updateRealTimePrice } from '@/lib/api/fetchRealTimePrice';

export async function GET() {
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
