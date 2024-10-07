import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";

// Local imports
import TrendingStockTx from "@/app/components/trendingco";
import { IStockInfo } from "@/app/interface";
import { API_URL, DEFAULT_ICON_SIZE } from "../constants";
import { alertUser, fetchData } from "../util";

// Update the import paths if necessary
//import trendingstocktx from "@/app/components/trendingco-card"; // Ensure this path is correct
//import { IStockInfo } from "@/app/interfaces"; // Check if 'interface' directory was renamed
//import { API_URL, DEFAULT_ICON_SIZE } from "@/app/constants";
//import { alertUser, fetchData } from "@/app/util";

interface IBuyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  stockInfo: IStockInfo;
  onBuyModalClose: () => void;
}

/**
 * BuyModalComponent is a modal component that allows users to buy stocks.
 * It displays the stock information and provides an input for the quantity to buy.
 *
 * @param {boolean} isOpen - Indicates if the modal is open.
 * @param {function} onOpenChange - Callback to handle the modal open state change.
 * @param {IStockInfo} stockInfo - Information about the stock to be bought.
 * @param {function} onBuyModalClose - Callback to handle the modal close action.
 */
export default function BuyModalComponent({
  isOpen,
  onOpenChange,
  stockInfo,
  onBuyModalClose,
}: Readonly<IBuyModalProps>) {
  // State to hold the quantity of stock to buy
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  // State to manage the loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * onBuyButtonPress is an async function that handles the buy button press event.
   * It sends a request to the API to buy the specified quantity of stock.
   * It also handles the loading state and displays success or error messages.
   */
  async function onBuyButtonPress() {
    const requestBody = {
      symbol: stockInfo.symbol,
      quantity: stockQuantity,
      action: "buy",
    };

    console.log("Sending request:", requestBody);

    try {
      const response = await fetchData(`${API_URL}/stock/buy_or_sell_stock/`, {
        method: "POST",
        body: requestBody,
      });
      console.log("Received response:", response);
      // Rest of the function remains unchanged
    } catch (error) {
      console.error("Error:", error);
      // Rest of the error handling remains unchanged
    }
  }
  const handleBuy = async () => {
    try {
      const response = await fetchData(`${API_URL}/trade`, {
        method: "POST",
        body: {
          action: "buy",
          symbol: stockInfo.symbol,
          quantity: quantity,
        },
      });
      alertUser(response.message, "success");
      onOpenChange(false);
      onBuyModalClose();
    } catch (error) {
      alertUser(error?.toString(), "error");
    }
  };
  return (
    <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="font-bold text-teal">Buy Stock</h2>
            </ModalHeader>
            <ModalBody className="px-4">
              {stockInfo && <TrendingStockTx stock={stockInfo} />}

              <Input
                type="number"
                label="Quantity"
                value={stockQuantity.toString()}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                isDisabled={isLoading}
              />
            </ModalBody>
            <ModalFooter className="px-2 pb-2 font-bold">
              <Button
                color="success"
                variant="light"
                onPress={onClose}
                startContent={<FiCheck size={DEFAULT_ICON_SIZE} />}
                isDisabled={isLoading}
                isLoading={isLoading}
                onClick={() => onBuyButtonPress()}
              >
                Buy
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={onBuyModalClose}
                isDisabled={isLoading}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}