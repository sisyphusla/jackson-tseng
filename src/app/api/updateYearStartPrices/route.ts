import { NextResponse } from 'next/server';
import { updateYearStartPrices } from '@/lib/api/updateYearStartPrices';

export async function GET() {
  try {
    const updatedCount = await updateYearStartPrices();
    return NextResponse.json({
      message: '年初股價已更新',
      updatedCount,
    });
  } catch (error) {
    console.error('更新年初股價時發生錯誤:', error);
    return NextResponse.json(
      { error: '更新年初股價時發生錯誤' },
      { status: 500 }
    );
  }
}
