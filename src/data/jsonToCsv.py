import json
import csv
import os

def json_to_csv(json_file_path, csv_file_path):
    # 讀取 JSON 文件
    with open(json_file_path, 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
    
    # 準備 CSV 數據
    csv_data = [['股票代號', '股票名稱', 'YahooFinanceSymbol', 'YearStartPrice']]
    
    # 處理每個股票項目
    for stock_code, stock_info in data.items():
        csv_data.append([
            stock_code,
            stock_info['StockName'],
            stock_info['YahooFinanceSymbol'],
            stock_info.get('YearStartPrice', '')  # 使用 get 方法來處理可能缺失的 YearStartPrice
        ])
    
    # 寫入 CSV 文件
    with open(csv_file_path, 'w', newline='', encoding='utf-8-sig') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerows(csv_data)

    print(f"CSV file has been created at: {csv_file_path}")

# 設定文件路徑
current_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(current_dir, 'taiwan_stocks.json')
csv_file_path = os.path.join(current_dir, 'taiwan_stocks.csv')

# 執行轉換
json_to_csv(json_file_path, csv_file_path)