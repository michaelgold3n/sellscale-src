import React, { useEffect, useState } from 'react';
import { Card, CardBody } from "@nextui-org/react";

interface ITopStock {
    symbol: string;
    name: string;
    currentPrice: number;
}

const TopStockComponent: React.FC = () => {
    const [topStocks, setTopStocks] = useState<ITopStock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopStocks = async () => {
            try {
                const response = await fetch('http://localhost:5000/top_stocks');
                if (!response.ok) {
                    throw new Error('Failed to fetch top stocks');
                }
                const data = await response.json();
                // Use a Map to ensure unique stocks by symbol
                const uniqueStocksMap = new Map();
                data.data.forEach((stock: ITopStock) => {
                    uniqueStocksMap.set(stock.symbol, stock);
                });
                setTopStocks(Array.from(uniqueStocksMap.values()));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopStocks();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {topStocks.map(stock => (
                <Card key={stock.symbol} className="mb-4">
                    <CardBody>
                        <h3>{stock.name} ({stock.symbol})</h3>
                        <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default TopStockComponent;