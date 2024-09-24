import { StockCard } from '@/components/StockCard';
import { fetchStocks, Stock } from '@/lib/api/fetchStocks';

export default async function Home() {
  const stocks: Stock[] = await fetchStocks();

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock, index) => (
          <StockCard key={index} {...stock} />
        ))}
      </div>
    </main>
  );
}
