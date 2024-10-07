"use client";

import { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { useAsyncList } from "@react-stately/data";
import { IStockInfo } from "../interface";
import { fetchStockDataFromSymbol, alertUser } from "../util";
import BuyModalComponent from "../components/BuyStock";
import { API_URL, DEFAULT_ICON_SIZE } from "../constants";

export default function StockSearchSection() {
  const [selectedStockInfo, setSelectedStockInfo] = useState<IStockInfo | null>(
    null
  );
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const stockList = useAsyncList<any>({
    async load({ signal, filterText }) {
      if (!filterText) return { items: [] };
  
      const response = await fetch(`${API_URL}/search?query=${filterText}`, {
        signal,
      });
      const data = await response.json();
  
      if (!response.ok) {
        alertUser(data.error || `Error: ${response.statusText}`, "error");
        return { items: [] };
      }
  
      return {
        items: data.symbol
          ? [{ symbol: data.symbol, name: data.name }]
          : [],
      };
    },
  });

  const handleSelectionChange = async (item: any) => {
    if (item) {
      try {
        const stockInfo = await fetchStockDataFromSymbol(item.toString());
        setSelectedStockInfo(stockInfo);
        setIsBuyModalOpen(true);
      } catch (error) {
        alertUser(error?.toString(), "error");
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardBody className="p-6 bg-gradient-to-r from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900">
          <h2 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">
            Search for a Stock Ticker
          </h2>
          <Autocomplete
            placeholder="Enter stock ticker..."
            startContent={<FaSearch size={DEFAULT_ICON_SIZE} />}
            type="search"
            variant="bordered"
            inputValue={stockList.filterText}
            onInputChange={stockList.setFilterText}
            isLoading={stockList.isLoading}
            items={stockList.items}
            onSelectionChange={handleSelectionChange}
            className="text-lg bg-white dark:bg-gray-800 rounded-md shadow-md w-full"
          >
            {(item) => (
              <AutocompleteItem key={item.symbol} textValue={item.symbol}>
                <div className="flex flex-col">
                  <span className="font-semibold">{item.symbol}</span>
                  <span className="text-xs text-gray-500">{item.name}</span>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </CardBody>
      </Card>

      {selectedStockInfo && (
        <BuyModalComponent
          isOpen={isBuyModalOpen}
          onOpenChange={setIsBuyModalOpen}
          stockInfo={selectedStockInfo}
          onBuyModalClose={() => {
            setSelectedStockInfo(null);
          }}
        />
      )}
    </div>
  );
}
