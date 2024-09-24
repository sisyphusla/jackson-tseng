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
  reportMomentum: string;
}

// ... 其他代碼保持不變 ...

export async function fetchStocks(): Promise<Stock[]> {
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.text();
  const rows = data.split('\n').slice(2); // 跳過標題行
  
  const stocks = rows.map(row => {
    const columns = row.split(',');
    if (columns.length < 17) {
      console.warn('行數據不完整:', row);
      return null;
    }
    
    const [
      stockCode,
      stockName,
      industry,
      yearStartPrice,
      currentPrice,
      yearToDateReturn,
      targetPrice,
      potentialGrowth,
      eps24F,
      eps25F,
      yearOverYearGrowth,
      pe24F,
      targetPE,
      marketValue,
      reportDate,
      analyst,
      reportMomentum
    ] = columns;

    // 如果 reportDate 或 reportMomentum 為空，則跳過這個股票
    if (!reportDate.trim() || !reportMomentum.trim()) {
      return null;
    }

    return { 
      stockCode: stockCode?.trim() || '',
      stockName: stockName?.trim() || '',
      industry: industry?.trim() || '',
      yearStartPrice: yearStartPrice?.trim() || '',
      currentPrice: currentPrice?.trim() || '',
      yearToDateReturn: yearToDateReturn?.trim() || '',
      targetPrice: targetPrice?.trim() || '',
      potentialGrowth: potentialGrowth?.trim() || '',
      eps24F: eps24F?.trim() || '',
      eps25F: eps25F?.trim() || '',
      yearOverYearGrowth: yearOverYearGrowth?.trim() || '',
      pe24F: pe24F?.trim() || '',
      targetPE: targetPE?.trim() || '',
      marketValue: marketValue?.trim() || '',
      reportDate: reportDate.trim(),
      analyst: analyst?.trim() || '',
      reportMomentum: reportMomentum.trim()
    };
  }).filter((stock): stock is Stock => !!stock);

  // 根據 reportDate 排序
  stocks.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());

  return stocks;
}