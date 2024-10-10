import { fetchAndSaveStocks } from './updateStockData';
import { updateRealTimePrice } from './fetchRealTimePrice';

const CSV_UPDATE_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
const REAL_TIME_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
const NON_TRADING_UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour

export async function updateStockData() {
  try {
    console.log('開始更新股票數據');
    await fetchAndSaveStocks();
    await updateRealTimePrice();
    console.log('股票數據更新完成');
  } catch (error) {
    console.error('更新過程中發生錯誤:', error);
  }
}

function isTradingHours() {
  const now = new Date();
  return (
    now.getHours() >= 9 &&
    now.getHours() < 14 &&
    now.getDay() >= 1 &&
    now.getDay() <= 5
  );
}

async function scheduledCsvUpdate() {
  await updateStockData();
  setTimeout(scheduledCsvUpdate, CSV_UPDATE_INTERVAL);
}

async function scheduledRealTimeUpdate() {
  const updateInterval = isTradingHours()
    ? REAL_TIME_UPDATE_INTERVAL
    : NON_TRADING_UPDATE_INTERVAL;

  await updateRealTimePrice();
  setTimeout(scheduledRealTimeUpdate, updateInterval);
}

export function startScheduler() {
  scheduledCsvUpdate();
  scheduledRealTimeUpdate();
}
