'use client';
// import { useState } from 'react';

export default function DebugPage() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [data, setData] = useState<any>(null);
  // const [error, setError] = useState<string>('');
  // const [logs, setLogs] = useState<string[]>([]);
  // const [rawData, setRawData] = useState<any>(null);
  // const [processedData, setProcessedData] = useState<any>(null);

  const handleTest = async () => {
    // setIsLoading(true);
    // setError('');
    // setLogs([]);
    // setRawData(null);
    // setProcessedData(null);

    // try {
    //   const res = await fetch('/api/debug');
    //   const result = await res.json();

    //   if (!res.ok) {
    //     throw new Error(result.error || '測試失敗');
    //   }

    //   if (result.data) {
    //     setLogs([
    //       '步驟1: 從 Google Sheets 獲取數據完成',
    //       '步驟2: 開始解析 CSV 數據...',
    //     ]);
    //     setRawData(result.data.rawData);
    //     setProcessedData(result.data.processedData);
    //     setData(result.data.processedData);
    //   }
    // } catch (error) {
    //   console.error('測試時發生錯誤:', error);
    //   setError(error instanceof Error ? error.message : '未知錯誤');
    // } finally {
    //   setIsLoading(false);
    // }
    alert('你想幹嘛');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">資料流程測試頁面</h1>

      <button
        onClick={handleTest}
        // disabled={isLoading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {/* {isLoading ? '資料處理中...' : '開始測試'} */}
        開始測試
      </button>

      {/* {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {logs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">處理日誌：</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
            {logs.join('\n')}
          </pre>
        </div>
      )}

      {rawData && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">解析前的原始數據：</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      )}

      {processedData && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">解析後的數據：</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
            {JSON.stringify(processedData, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
}
