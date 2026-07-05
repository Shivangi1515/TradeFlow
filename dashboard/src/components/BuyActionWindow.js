import React, { useState, useContext } from "react";

import axios from "axios";
import { API_URL } from "../config";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    axios.post(`${API_URL}/newOrder`, {
      name: uid,
      qty: Number(stockQuantity),
      price: Number(stockPrice),
      mode: "BUY",
    }).then(() => {
      generalContext.fetchHoldings();
      generalContext.showSuccessToast(`Bought ${stockQuantity} shares of ${uid} at ₹${stockPrice}`, "Order Placed Successfully");
    }).catch((err) => {
      console.error("Error placing buy order:", err);
      alert("Failed to place buy order. Please try again.");
    });

    generalContext.closeBuyWindow();
  };

  const handleSellClick = () => {
    const holding = generalContext.allHoldings.find((h) => h.name === uid);
    const availableQty = holding ? holding.qty : 0;

    if (Number(stockQuantity) > availableQty) {
      alert(`You do not have enough holdings of ${uid} to sell. Available: ${availableQty}`);
      return;
    }

    axios.post(`${API_URL}/newOrder`, {
      name: uid,
      qty: Number(stockQuantity),
      price: Number(stockPrice),
      mode: "SELL",
    }).then(() => {
      generalContext.fetchHoldings();
      generalContext.showSuccessToast(`Sold ${stockQuantity} shares of ${uid} at ₹${stockPrice}`, "Order Placed Successfully");
    }).catch((err) => {
      console.error("Error placing sell order:", err);
      alert(err.response?.data || "Failed to place sell order. Please try again.");
    });

    generalContext.closeBuyWindow();
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-orange" onClick={handleSellClick} style={{ backgroundColor: "#ff5722" }}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;