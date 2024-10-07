import { useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { FiCheck, FiPlus, FiMinus } from "react-icons/fi";

// Local imports
import { IEnhancedStock } from "@/app/interface";
import { alertUser, fetchData } from "../util";
import { API_URL } from "../constants";
import PortfolioStockCard from "../components/PortfoCo";
import SellModalComponent from "../components/SellStock";
import BuyModalComponent from "../components/BuyStock";

export default function PortfolioSection() {
  const { isOpen: isOpenSellModal, onOpen: onOpenSellModal, onOpenChange: onOpenChangeSellModal } = useDisclosure();
  const { isOpen: isOpenBuyModal, onOpen: onOpenBuyModal, onOpenChange: onOpenChangeBuyModal } = useDisclosure();

  const [enhancedStockList, setEnhancedStockList] = useState<IEnhancedStock[]>([]);
  const [selectedStockForSale, setSelectedStockForSale] = useState<IEnhancedStock | null>(null);
  const [selectedStockForBuy, setSelectedStockForBuy] = useState<IEnhancedStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPortfolioCallback = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(`${API_URL}/portfolio`);
      setEnhancedStockList(response.portfolio || []);
    } catch (error) {
      alertUser((error as string)?.toString(), "error");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchPortfolioCallback();
  }, [fetchPortfolioCallback]);

  return (
    <div className="flex-center-screen bg-background text-foreground">
      <h1 className="text-2xl mb-4 font-bold" style={{ color: 'rgb(3, 215, 165)' }}>Your Portfolio</h1>
      {isLoading && <CircularProgress className="flex-center-screen mb-4" />}

      <div className="w-full max-w-4xl">
        {enhancedStockList.map((enhanced_stock, idx) => (
          <PortfolioStockCard
            key={idx}
            enhanced_stock={enhanced_stock}
            onSellButtonPress={(selectedEnhancedStock) => {
              setSelectedStockForSale(selectedEnhancedStock);
              onOpenSellModal();
            }}
            onBuyButtonPress={(selectedEnhancedStock) => {
              setSelectedStockForBuy(selectedEnhancedStock);
              onOpenBuyModal();
            }}
          />
        ))}
      </div>

      {selectedStockForSale && (
        <SellModalComponent
          isOpen={isOpenSellModal}
          onOpenChange={onOpenChangeSellModal}
          onSellModalClose={() => {
            setSelectedStockForSale(null);
            fetchPortfolioCallback();
          }}
          enhancedStock={selectedStockForSale}
        />
      )}

      {selectedStockForBuy && (
        <BuyModalComponent
          isOpen={isOpenBuyModal}
          onOpenChange={onOpenChangeBuyModal}
          onBuyModalClose={() => {
            setSelectedStockForBuy(null);
            fetchPortfolioCallback();
          }}
          stockInfo={selectedStockForBuy}
        />
      )}
    </div>
  );
}