import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { updateYearStartPrices } from '@/lib/api/updateYearStartPrices';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
  }
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
