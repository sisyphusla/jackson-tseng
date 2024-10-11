import { parse } from 'csv-parse/sync';
import yahooFinance from 'yahoo-finance2';
import { BaseStockData, getStockWithDefaults } from '@/types/stock';
import { r2Client, R2_BUCKET_NAME } from '../r2Client';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

yahooFinance.suppressNotices(['ripHistorical', 'yahooSurvey']);

interface TaiwanStock {
  StockName: string;
  YahooFinanceSymbol: string;
  YearStartPrice: string;
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
    // 移除第一行
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
