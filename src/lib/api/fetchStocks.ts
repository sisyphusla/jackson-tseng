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
  reportMomentum: string[]; // 改为字符串数组
}

type RawStockRecord = Record<string, string>;

export async function fetchStocks(): Promise<Stock[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
    }
    let data = await res.text();

    // 移除第一行
    data = data.split('\n').slice(1).join('\n');

    console.log(
      'Processed CSV data (first 1000 characters):',
      data.slice(0, 1000)
    );

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
      skip_records_with_empty_values: true,
      encoding: 'utf8',
    }) as RawStockRecord[];

    console.log(`Parsed ${records.length} records from CSV`);
    console.log(
      'First 3 records:',
      JSON.stringify(records.slice(0, 3), null, 2)
    );

    const stocks = records
      .map((record: RawStockRecord, index: number) => {
        // 檢查所有必要的字段
        const requiredFields = [
          '股票代號',
          '股票名稱',
          '報告日期',
          '報告動能觀點',
        ];
        const missingFields = requiredFields.filter((field) => !record[field]);

        if (missingFields.length > 0) {
          console.log(
            `Record ${index}: Missing fields: ${missingFields.join(
              ', '
            )}. Record:`,
            JSON.stringify(record, null, 2)
          );
          return null;
        }

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
      })
      .filter((stock): stock is Stock => !!stock);

    console.log(`Processed ${stocks.length} valid stocks`);
    if (stocks.length > 0) {
      console.log('First stock:', JSON.stringify(stocks[0], null, 2));
    }
    console.log(
      'Stock codes:',
      stocks.map((s) => s.stockCode)
    );

    return stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
}

export async function fetchStockReport(stockCode: string): Promise<Stock> {
  const stocks = await fetchStocks();
  console.log(`Searching for stock code: ${stockCode}`);
  const stock = stocks.find((s) => s.stockCode === stockCode);
  if (!stock) {
    console.log(
      'Available stock codes:',
      stocks.map((s) => s.stockCode)
    );
    throw new Error(`Stock with code ${stockCode} not found`);
  }
  return stock;
}
