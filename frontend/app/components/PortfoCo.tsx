import { Button, Card, CardBody } from "@nextui-org/react";
import { FiPlus, FiMinus } from "react-icons/fi";
// Local
import { IEnhancedStock } from "@/app/interface";

export default function PortfolioStockCard({
  enhanced_stock,
  onSellButtonPress = undefined,
  onBuyButtonPress = undefined,
}: {
  enhanced_stock: IEnhancedStock;
  onSellButtonPress?: (enhancedStock: IEnhancedStock) => void;
  onBuyButtonPress?: (enhancedStock: IEnhancedStock) => void;
}) {
  const totalValue = (
    enhanced_stock.current_price * enhanced_stock.quantity
  ).toFixed(2);

  return (
    <Card className="mb-4 w-full">
      <CardBody>
        <div className="flex justify-between items-center w-full gap-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'rgb(3, 215, 165)' }}>{enhanced_stock.name}</h3>
            <p className="text-sm font-thin">
              {enhanced_stock.ticker} ({enhanced_stock.quantity} shares)
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p
              className={`${
                enhanced_stock.profit_loss_percent >= 0
                  ? "text-teal"
                  : "text-red-500"
              }`}
            >
              ${totalValue} ({(enhanced_stock.current_price - enhanced_stock.buy_price).toFixed(2)})
            </p>
            <p
              className={`text-sm ${
                enhanced_stock.profit_loss_percent >= 0
                  ? "text-teal"
                  : "text-red-500"
              }`}
            >{`${enhanced_stock.profit_loss_percent >= 0 ? "+" : "-"} ${
              enhanced_stock.profit_loss_percent
            }%`}</p>
          </div>
          <div className="flex gap-2">
            {onBuyButtonPress && (
              <Button
                size="sm"
                style={{ backgroundColor: 'rgb(3, 215, 165)', color: 'white' }}
                onPress={() => onBuyButtonPress(enhanced_stock)}
              >
                <FiPlus size={16} />
                Buy
              </Button>
            )}
            {onSellButtonPress && (
              <Button
                size="sm"
                color="danger"
                onPress={() => onSellButtonPress(enhanced_stock)}
              >
                <FiMinus size={16} />
                Sell
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}