import { parse } from 'csv-parse/sync';
import yahooFinance from 'yahoo-finance2';
import { BaseStockData, getStockWithDefaults } from '@/types/stock';
import { r2Client, R2_BUCKET_NAME } from '../r2Client';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

yahooFinance.suppressNotices(['ripHistorical', 'yahooSurvey']);

interface TaiwanStock {
  StockName: string;
  YahooFinanceSymbol?: string;
  YearStartPrice?: string;
}

interface StockLookup {
  [key: string]: TaiwanStock;
}

async function createStockLookup(): Promise<StockLookup> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'taiwan_stocks.json',
    });
    const response = await r2Client.send(command);
    const taiwanStocksData = await response.Body?.transformToString();
    return JSON.parse(taiwanStocksData || '{}') as StockLookup;
  } catch (error) {
    console.error('讀取或解析 R2 中的 taiwan_stocks.json 時發生錯誤:', error);
    return {};
  }
}

export async function fetchAndSaveStocks(): Promise<BaseStockData[]> {
  const SHEET_ID = '1JF1nsYrA-4b5qZgLL_QBs6w0skxRStNF1IiqN06FLnk';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`無法獲取 CSV：${res.status} ${res.statusText}`);
    }

    let data = await res.text();
    data = data.split('\n').slice(1).join('\n');

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    const filteredRecords = records.filter(
      (record) =>
        record['報告日期'] &&
        record['報告動能觀點'] &&
        record['報告日期'].trim() !== '' &&
        record['報告動能觀點'].trim() !== ''
    );

    // 取得當前年份後兩位數字
    const currentYear = new Date().getFullYear().toString().slice(-2); // "25"
    const nextYear = (new Date().getFullYear() + 1).toString().slice(-2); // "26"

    // 獲取 Yahoo Finance 符號和年初價
    const stockLookup = await createStockLookup();
    const updatedRecords = filteredRecords.map((record): BaseStockData => {
      const stockInfo = stockLookup[record['股票代號']];
      return getStockWithDefaults({
        stockCode: record['股票代號'],
        stockName: record['股票名稱'],
        industry: record['產業'],
        yearStartPrice: stockInfo?.YearStartPrice,
        currentPrice: record['現價'],
        YTD: record['YTD'],
        targetPrice: record['目標價'],
        potentialGrowth: record['潛在漲幅'],
        currentYearEPS: record[`${currentYear}EPS(F)`],
        nextYearEPS: record[`${nextYear}EPS(F)`],
        YoY: record['EPS-YoY'],
        currentYearPE: record['目前PE'],
        TPE: record['目標PE'],
        marketCap: record['市值'],
        reportDate: record['報告日期'],
        broker: record['券商'],
        reportMomentumView: record['報告動能觀點'],
        YahooFinanceSymbol: stockInfo?.YahooFinanceSymbol,
      });
    });

    // 保存到 R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'stocksData.json',
      Body: JSON.stringify(updatedRecords, null, 2),
      ContentType: 'application/json',
    });

    await r2Client.send(command);

    console.log(`成功保存 ${updatedRecords.length} 條股票數據到 R2`);
    return updatedRecords;
  } catch (error) {
    console.error('獲取、解析 CSV 數據或保存到 R2 時發生錯誤:', error);
    throw error;
  }
}

interface DebugResult {
  rawData: Record<string, string>;
  processedData: BaseStockData;
}

export async function debugFetchStocks(): Promise<DebugResult> {
  const SHEET_ID = '1JF1nsYrA-4b5qZgLL_QBs6w0skxRStNF1IiqN06FLnk';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  try {
    // 1. 從 Google Sheets 獲取數據
    console.log('步驟1: 開始從 Google Sheets 獲取數據...');
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`無法獲取 CSV：${res.status} ${res.statusText}`);
    }

    // 2. 解析 CSV 數據
    console.log('步驟2: 開始解析 CSV 數據...');
    let data = await res.text();
    data = data.split('\n').slice(1).join('\n');
    // console.log('原始 CSV 數據:', data);

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    const rawData = records[0];
    console.log('解析後的原始數據:', rawData);

    // 3. 從 R2 獲取股票資訊
    console.log('步驟3: 嘗試從 R2 獲取股票資訊...');
    let stockLookup: StockLookup = {};
    try {
      stockLookup = await createStockLookup();
      console.log('成功從 R2 獲取股票資訊');
    } catch (error) {
      console.log('從 R2 獲取股票資訊失敗，使用空對象繼續:', error);
    }

    // 4. 過濾數據
    console.log('步驟4: 過濾數據...');
    const filteredRecords = records.filter(
      (record) =>
        record['報告日期'] &&
        record['報告動能觀點'] &&
        record['報告日期'].trim() !== '' &&
        record['報告動能觀點'].trim() !== ''
    );

    // 5. 轉換數據格式
    console.log('步驟5: 轉換數據格式...');
    const firstRecord = filteredRecords[0];
    const stockInfo = stockLookup[firstRecord['股票代號']];

    // 取得當前年份後兩位數字
    const currentYear = new Date().getFullYear().toString().slice(-2); // "25"
    const nextYear = (new Date().getFullYear() + 1).toString().slice(-2); // "26"

    const processedData = getStockWithDefaults({
      stockCode: firstRecord['股票代號'],
      stockName: firstRecord['股票名稱'],
      industry: firstRecord['產業'],
      yearStartPrice: stockInfo?.YearStartPrice || '',
      currentPrice: firstRecord['現價'],
      YTD: firstRecord['YTD'],
      targetPrice: firstRecord['目標價'],
      potentialGrowth: firstRecord['潛在漲幅'],
      currentYearEPS: firstRecord[`${currentYear}EPS(F)`],
      nextYearEPS: firstRecord[`${nextYear}EPS(F)`],
      YoY: firstRecord['EPS-YoY'],
      currentYearPE: firstRecord['目前PE'],
      TPE: firstRecord['目標PE'],
      marketCap: firstRecord['市值'],
      reportDate: firstRecord['報告日期'],
      broker: firstRecord['券商'],
      reportMomentumView: firstRecord['報告動能觀點'],
      YahooFinanceSymbol: stockInfo?.YahooFinanceSymbol || '',
    });

    console.log('最終處理後的數據:', processedData);
    return {
      rawData,
      processedData,
    };
  } catch (error) {
    console.error('數據處理過程中發生錯誤:', error);
    throw error;
  }
}
