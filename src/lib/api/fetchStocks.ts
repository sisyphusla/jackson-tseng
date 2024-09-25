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

const CACHE_EXPIRY = 30 * 60 * 1000; // 30分鐘

export async function fetchStocks(): Promise<Stock[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 14400 }, // 重新驗證時間設置為4小時 (14400秒)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
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

    const stocks = records
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

    return stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
}

export async function fetchStockReport(
  stockCode: string
): Promise<Stock | null> {
  const stocks = await fetchStocks();

  const stock = stocks.find((s) => s.stockCode === stockCode);
  if (!stock) {
    console.log(
      'Available stock codes:',
      stocks.map((s) => s.stockCode)
    );
    return null;
  }
  return stock;
}
