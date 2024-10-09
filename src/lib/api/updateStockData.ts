import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import yahooFinance from 'yahoo-finance2';

yahooFinance.suppressNotices(['ripHistorical', 'yahooSurvey']);

interface StockData {
  stockCode: string;
  stockName: string;
  industry: string;
  yearStartPrice: string;
  currentPrice: string;
  YTD: string;
  targetPrice: string;
  potentialGrowth: string;
  EPS24F: string;
  EPS25F: string;
  YoY: string;
  PE24F: string;
  TPE: string;
  marketCap: string;
  reportDate: string;
  broker: string;
  reportMomentumView: string;
  YahooFinanceSymbol?: string;
  [key: string]: string | undefined;
}

interface TaiwanStock {
  StockName: string;
  YahooFinanceSymbol: string;
  YearStartPrice: string;
}

interface StockLookup {
  [key: string]: TaiwanStock;
}

async function createStockLookup(): Promise<StockLookup> {
  const taiwanStocksPath = path.join(
    process.cwd(),
    'src',
    'data',
    'taiwan_stocks.json'
  );
  try {
    const taiwanStocksData = await fs.readFile(taiwanStocksPath, 'utf-8');
    return JSON.parse(taiwanStocksData) as StockLookup;
  } catch (error) {
    console.error('讀取或解析 taiwan_stocks.json 時發生錯誤:', error);
    return {};
  }
}

export async function fetchAndSaveStocks(): Promise<StockData[]> {
  const SHEET_ID = '1JF1nsYrA-4b5qZgLL_QBs6w0skxRStNF1IiqN06FLnk';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`無法獲取 CSV：${res.status} ${res.statusText}`);
    }

    let data = await res.text();
    // 移除第一行
    data = data.split('\n').slice(1).join('\n');

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as any[];

    const filteredRecords = records.filter(
      (record) =>
        record['報告日期'] &&
        record['報告動能觀點'] &&
        record['報告日期'].trim() !== '' &&
        record['報告動能觀點'].trim() !== ''
    );

    // 獲取 Yahoo Finance 符號和年初價
    const stockLookup = await createStockLookup();
    const updatedRecords = filteredRecords.map((record): StockData => {
      const stockInfo = stockLookup[record['股票代號']];
      return {
        stockCode: record['股票代號'],
        stockName: record['股票名稱'],
        industry: record['產業'],
        yearStartPrice: stockInfo?.YearStartPrice,
        currentPrice: record['現價'],
        YTD: record['YTD'],
        targetPrice: record['目標價'],
        potentialGrowth: record['潛在幅度'],
        EPS24F: record['24EPS(F)'],
        EPS25F: record['25EPS(F)'],
        YoY: record['YoY'],
        PE24F: record['24PE(F)'],
        TPE: record['(T)PE'],
        marketCap: record['市值'],
        reportDate: record['報告日期'],
        broker: record['券商'],
        reportMomentumView: record['報告動能觀點'],
        YahooFinanceSymbol: stockInfo?.YahooFinanceSymbol,
      };
    });

    // 保存到 JSON 文件
    const dataDir = path.join(process.cwd(), 'src', 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      path.join(dataDir, 'stocksData.json'),
      JSON.stringify(updatedRecords, null, 2)
    );

    console.log(`成功保存 ${updatedRecords.length} 條股票數據`);
    return updatedRecords;
  } catch (error) {
    console.error('獲取或解析 CSV 數據時發生錯誤:', error);
    throw error;
  }
}
