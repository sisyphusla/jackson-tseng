import { parse } from 'csv-parse/sync';

const SHEET_ID = '1JF1nsYrA-4b5qZgLL_QBs6w0skxRStNF1IiqN06FLnk';
const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export interface Stock {
  stockCode: string;
  stockName: string;
  industry: string;
  yearStartPrice: string;
  currentPrice: string;
  yearToDateReturn: string;
  targetPrice: string;
  potentialGrowth: string;
  eps24F: string;
  eps25F: string;
  yearOverYearGrowth: string;
  pe24F: string;
  targetPE: string;
  marketValue: string;
  reportDate: string;
  analyst: string;
  reportMomentum: string[];
}

type RawStockRecord = Record<string, string>;

let cachedStocks: Stock[] | null = null;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 小時
let lastFetchTime = 0;

export async function fetchStocks(): Promise<Stock[]> {
  const now = Date.now();
  if (cachedStocks && now - lastFetchTime < CACHE_DURATION) {
    return cachedStocks;
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 14400 }, // 重新驗證時間設置為4小時 (14400秒)
    });

    if (!res.ok) {
      throw new Error(`無法獲取 CSV：${res.status} ${res.statusText}`);
    }

    let data = await res.text();
    // 移除第一行
    data = data.split('\n').slice(1).join('\n');

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
      skip_records_with_empty_values: true,
      encoding: 'utf8',
    }) as RawStockRecord[];

    cachedStocks = records
      .filter((record: RawStockRecord) => {
        // 只有當報告日期和報告動能觀點都有資料時才處理
        return record['報告日期'] && record['報告動能觀點'];
      })
      .map((record: RawStockRecord) => {
        return {
          stockCode: record['股票代號'] || '',
          stockName: record['股票名稱'] || '',
          industry: record['產業'] || '',
          yearStartPrice: record['年初價'] || '',
          currentPrice: record['現價'] || '',
          yearToDateReturn: record['YTD'] || '',
          targetPrice: record['目標價'] || '',
          potentialGrowth: record['潛在幅度'] || '',
          eps24F: record['24EPS(F)'] || '',
          eps25F: record['25EPS(F)'] || '',
          yearOverYearGrowth: record['YoY'] || '',
          pe24F: record['24PE(F)'] || '',
          targetPE: record['(T)PE'] || '',
          marketValue: record['市值'] || '',
          reportDate: record['報告日期'],
          analyst: record['券商'] || '',
          reportMomentum: record['報告動能觀點']
            .split('\n')
            .filter((p) => p.trim() !== ''),
        };
      });

    lastFetchTime = now;
    return cachedStocks;
  } catch (error) {
    console.error('獲取股票數據時發生錯誤:', error);
    return cachedStocks || []; // 如果發生錯誤，返回緩存的數據（如果有的話）
  }
}

export async function fetchStockReport(
  stockCode: string
): Promise<Stock | null> {
  const stocks = await fetchStocks();

  const stock = stocks.find((s) => s.stockCode === stockCode);
  if (!stock) {
    console.log(
      '可用的股票代碼:',
      stocks.map((s) => s.stockCode)
    );
    return null;
  }
  return stock;
}
