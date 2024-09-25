import { parse } from 'csv-parse/sync';
import yearStartPrices from '@/yearStartPrices.json';

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
const typedYearStartPrices: Record<string, unknown> = yearStartPrices;

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
      next: { revalidate: 3600 * 4 }, // 重新驗證時間設置為4小時
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
        return (
          record['報告日期'] &&
          record['報告動能觀點'] &&
          record['報告日期'].trim() !== '' &&
          record['報告動能觀點'].trim() !== ''
        );
      })
      .map((record: RawStockRecord) => {
        const stockCode = record['股票代號'] || '';
        const currentPrice = parseFloat(record['現價']);
        // 使用 JSON 數據獲取年初價格
        const yearStartPriceStr = typedYearStartPrices[stockCode];
        const yearStartPrice =
          typeof yearStartPriceStr === 'string'
            ? parseFloat(yearStartPriceStr)
            : 0;

        const yearToDateReturn = yearStartPrice
          ? (((currentPrice - yearStartPrice) / yearStartPrice) * 100).toFixed(
              2
            )
          : '0';
        return {
          stockCode: record['股票代號'] || '',
          stockName: record['股票名稱'] || '',
          industry: record['產業'] || '',
          yearStartPrice: yearStartPrice.toString(),
          currentPrice: currentPrice.toString(),
          yearToDateReturn,
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

//import { google } from 'googleapis';
// import { JWT } from 'google-auth-library';

// const SHEET_ID = '1JF1nsYrA-4b5qZgLL_QBs6w0skxRStNF1IiqN06FLnk';
// const SHEET_NAME = '股票名單';
// const RANGE = `${SHEET_NAME}!A:Q`;

// export interface Stock {
//   stockCode: string;
//   stockName: string;
//   industry: string;
//   yearStartPrice: string;
//   currentPrice: string;
//   yearToDateReturn: string;
//   targetPrice: string;
//   potentialGrowth: string;
//   eps24F: string;
//   eps25F: string;
//   yearOverYearGrowth: string;
//   pe24F: string;
//   targetPE: string;
//   marketValue: string;
//   reportDate: string;
//   analyst: string;
//   reportMomentum: string[];
// }

// async function getAuthClient(): Promise<JWT> {
//   try {
//     if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
//       throw new Error('缺少必要的環境變量');
//     }
//     const auth = new google.auth.JWT({
//       email: process.env.GOOGLE_CLIENT_EMAIL,
//       key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//       scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//     });
//     await auth.authorize();
//     return auth;
//   } catch (error) {
//     console.error('授權失敗:', error);
//     throw error;
//   }
// }

// export async function fetchStocks(): Promise<Stock[]> {
//   try {
//     const auth = await getAuthClient();
//     const sheets = google.sheets({ version: 'v4', auth });
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SHEET_ID,
//       range: RANGE,
//     });

//     const rows = response.data.values;
//     if (!rows || rows.length < 3) {
//       console.log('Not enough data found in the sheet');
//       return [];
//     }

//     const stocks = rows.slice(2).map((row): Stock => {
//       return {
//         stockCode: row[0] || '',
//         stockName: row[1] || '',
//         industry: row[2] || '',
//         yearStartPrice: row[3] || '',
//         currentPrice: row[4] || '',
//         yearToDateReturn: row[5] || '',
//         targetPrice: row[6] || '',
//         potentialGrowth: row[7] || '',
//         eps24F: row[8] || '',
//         eps25F: row[9] || '',
//         yearOverYearGrowth: row[10] || '',
//         pe24F: row[11] || '',
//         targetPE: row[12] || '',
//         marketValue: row[13] || '',
//         reportDate: row[14] || '',
//         analyst: row[15] || '',
//         reportMomentum: row[16]
//           ? row[16].split('\n').filter((p: string) => p.trim() !== '')
//           : [],
//       };
//     });

//     // console.log('Sample stock:', stocks[0]);
//     // console.log('Sample stock:', stocks[1]);

//     return stocks;
//   } catch (error) {
//     console.error('獲取股票數據時發生錯誤:', error);
//     if (error instanceof Error) {
//       console.error('錯誤訊息:', error.message);
//       console.error('錯誤堆疊:', error.stack);
//     }
//     if (typeof error === 'object' && error !== null && 'response' in error) {
//       console.error('API 響應:', (error as any).response?.data);
//     }
//     return [];
//   }
// }
