import { useCallback, useEffect, useState } from "react";
import { CircularProgress, useDisclosure } from "@nextui-org/react";
// Local imports
import { alertUser, fetchData } from "@/app/util";
import { API_URL } from "@/app/constants";
import { IStockInfo } from "@/app/interface";
import TopStockComponent from "@/app/components/trendingco";
import BuyModalComponent from "@/app/components/BuyStock";
//import TopStockComponent from "@/app/components/trendingco";

/**
 * trendspagelogic fetches and displays a list of the trending stocks
 * It shows a loading spinner while fetching the data and displays the stocks in a list.
 * Users can click on a stock to open a modal for buying the stock.
 *
 * @returns {JSX.Element} The rendered TrendsPageLogic component.
 */
export default function TrendsPageLogic() {
  // Destructure the useDisclosure hook to manage the buy modal state
  const { isOpen: isOpenBuyModal, onOpenChange: onOpenChangeBuyModal } =
    useDisclosure();
  // State to hold the list of trends
  const [topStocksList, setTopStocksList] = useState<IStockInfo[]>([]);
  // State to hold the selected stock information for buying
  const [selectedStockInfo, setSelectedStockInfo] = useState<IStockInfo | null>(
    null
  );
  // State to manage the loading state
  const [isLoading, setIsLoading] = useState(true);

  /**
   * fetchTopStocksList is an async function that fetches the trends list from the API.
   * It updates the state with the fetched data and handles any errors that occur during the fetch.
   */
  const fetchTopStocksList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(`${API_URL}/top_stocks`);
      const data = response.data as IStockInfo[];
      setTopStocksList(data);
    } catch (error) {
      alertUser((error as any)?.toString(), "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect hook to fetch the trends list when the component mounts
  useEffect(() => {
    fetchTopStocksList();
  }, [fetchTopStocksList]);

  return (
    <div className="flex-center-screen">
      <h1 className="text-xl mb-4">Trending Stocks</h1>
      {/* Display a loading spinner while fetching the data */}
      {isLoading && <CircularProgress className="flex-center-screen mb-4" />}
      <div>
        {/* Display the list of trends */}
        {topStocksList.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => {
              setSelectedStockInfo(stock);
              onOpenChangeBuyModal();
            }}
            className="hover:cursor-pointer"
          >
            <TopStockComponent stock={stock} />
          </div>
        ))}
      </div>

      {/* Display the buy modal if a stock is selected */}
      {selectedStockInfo && (
        <BuyModalComponent
          isOpen={isOpenBuyModal}
          onOpenChange={onOpenChangeBuyModal}
          stockInfo={selectedStockInfo}
          onBuyModalClose={() => {
            setSelectedStockInfo(null);
            fetchTopStocksList();
          }}
        />
      )}
    </div>
  );
}
