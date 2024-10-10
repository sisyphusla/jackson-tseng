// import { NextResponse } from 'next/server';
// import { startScheduler } from '@/lib/api/smartUpdateScheduler';

// let schedulerStarted = false;

// export async function POST() {
//   if (!schedulerStarted) {
//     startScheduler();
//     schedulerStarted = true;
//     return NextResponse.json({ message: '調度器已啟動' });
//   }
//   return NextResponse.json({ message: '調度器已在運行中' });
// }
