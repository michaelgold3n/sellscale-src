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
import { IEnhancedStock } from "@/app/interface";
import { API_URL, DEFAULT_ICON_SIZE } from "../constants";
import { alertUser, fetchData } from "../util";
import PortfolioStockCard from "./PortfoCo";

interface ISellModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  enhancedStock: IEnhancedStock;
  onSellModalClose: () => void;
}

/**
 * SellModalComponent is a modal component that allows users to sell stocks.
 * It displays the stock information and provides an input for the quantity to sell.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {function} props.onOpenChange - Callback to handle the modal open state change.
 * @param {IEnhancedStock} props.enhancedStock - Information about the stock to be sold.
 * @param {function} props.onSellModalClose - Callback to handle the modal close action.
 * @returns {JSX.Element} The rendered SellModalComponent.
 */
export default function SellModalComponent({
  isOpen,
  onOpenChange,
  enhancedStock,
  onSellModalClose,
}: Readonly<ISellModalProps>) {
  // State to hold the quantity of stock to sell
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  // State to manage the loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * onSellButtonPress is an async function that handles the sell button press event.
   * It sends a request to the API to sell the specified quantity of stock.
   * It also handles the loading state and displays success or error messages.
   */
  async function onSellButtonPress() {
    // Validate the stock quantity
    if (stockQuantity <= 0 || stockQuantity > enhancedStock.quantity) {
      alertUser("Invalid quantity", "error");
      onSellModalClose();
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchData(`${API_URL}/stock/buy_or_sell_stock/`, {
        method: "POST",
        body: {
          symbol: enhancedStock.ticker,
          quantity: stockQuantity,
          action: "sell",
        },
      });
      alertUser(
        `${stockQuantity} shares of ${enhancedStock.ticker} stock sold successfully`,
        "success"
      );
    } catch (error) {
      alertUser(error?.toString() ?? "Error, please try again", "error");
    } finally {
      setIsLoading(false);
      onSellModalClose();
    }
  }
  const handleSell = async () => {
    try {
      const response = await fetchData(`${API_URL}/trade`, {
        method: "POST",
        body: {
          action: "sell",
          symbol: enhancedStock.ticker,
          quantity: quantity,
        },
      });
      alertUser(response.message, "success");
      onOpenChange(false);
      onSellModalClose();
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
              <h2 className="font-bold text-teal">Sell Stock</h2>
            </ModalHeader>
            <ModalBody className="px-4">
              {/* Display the stock information */}
              {enhancedStock && (
                <PortfolioStockCard enhanced_stock={enhancedStock} />
              )}

              {/* Input for the quantity of stock to sell */}
              <Input
                type="number"
                label="Quantity"
                value={stockQuantity.toString()}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                min={1}
                max={enhancedStock.quantity}
                isDisabled={isLoading}
              />
            </ModalBody>
            <ModalFooter className="px-2 pb-2 font-bold">
              {/* Button to confirm the sell action */}
              <Button
                color="success"
                variant="light"
                onPress={onClose}
                startContent={<FiCheck size={DEFAULT_ICON_SIZE} />}
                isDisabled={isLoading}
                isLoading={isLoading}
                onClick={() => onSellButtonPress()}
              >
                Sell
              </Button>
              {/* Button to close the modal */}
              <Button
                color="danger"
                variant="light"
                onPress={onSellModalClose}
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