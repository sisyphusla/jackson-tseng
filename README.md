# Jackson 產業觀點

這是一個使用 Next.js 14 開發的台股研究報告整合平台，提供券商研究報告的動能觀點和即時股價資訊。

![專案截圖](/public/pic.webp)
![專案截圖2](/public/pic2.webp)

## 功能特點

- 🔄 即時股價更新（每 30 分鐘）
- 📊 多維度股票資訊展示（EPS、PE、YTD、產業分類等）
- 🔍 即時股票搜尋功能
- 📱 響應式設計，支援各種裝置
- ⚡ 高效能的資料快取機制
- 🔒 API 安全驗證

## 線上展示

- 網站：[Jackson 產業觀點](https://jackson-tseng.vercel.app)

## 使用技術

### 前端

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### 後端 & 基礎設施

- Cloudflare R2 (資料儲存)
- Vercel (部署平台)
- Yahoo Finance API (股價資料)
- GitHub Actions (自動化工作流程)

## 本地開發

1. Clone 專案

```bash
git clone https://github.com/sisyphusla/jackson-tseng.git

```

2. 安裝套件

```bash
pnpm install
```

3. 設置環境變數

```bash
cp .env.local
```

必要的環境變數：

```env
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ACCOUNT_ID=your_account_id
R2_BUCKET_NAME=your_bucket_name
X_API_KEY=your_api_key
```

4. 運行本地伺服器

```bash
pnpm dev
```

現在可以在 http://localhost:3000 訪問網站

## GitHub Actions

- `fetch-real-time-price.yml`: 更新即時股價
- `update-stocks.yml`: 更新股票基本資料

## API 端點

| 端點                         | 方法 | 描述             |
| ---------------------------- | ---- | ---------------- |
| `/api/stocks`                | GET  | 獲取所有股票資料 |
| `/api/search`                | GET  | 搜尋股票         |
| `/api/updateRealTimePrice`   | POST | 更新即時股價     |
| `/api/updateStocks`          | POST | 更新股票基本資料 |
| `/api/updateYearStartPrices` | POST | 更新年初股價     |

## 專案結構

```
src/
├── app/ # Next.js 頁面和 API 路由
│   ├── api/ # API 端點
│   ├── [stockCode]/ # 動態路由
│   └── page.tsx # 首頁
├── components/ # React 組件
│   ├── ui/ # shadcn/ui 組件
│
├── lib/ # 工具函數和 API 客戶端
├── types/ # TypeScript 類型定義
└── data/ # 靜態數據
```

## License

[MIT](https://github.com/sisyphusla/jackson-tseng/blob/main/LICENSE)

## 致謝

- 感謝 [Jackson 產業觀點](https://x.com/szfkuka) 無私分享的資料
