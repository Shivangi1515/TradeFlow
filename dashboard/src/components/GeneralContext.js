import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

import BuyActionWindow from "./BuyActionWindow";
import Toast from "./Toast";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  allHoldings: [],
  fetchHoldings: () => {},
  showSuccessToast: (message, title) => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [allHoldings, setAllHoldings] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", title: "" });

  const fetchHoldings = () => {
    axios.get(`${API_URL}/allHoldings`).then((res) => {
      setAllHoldings(res.data);
    });
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  const showSuccessToast = (message, title) => {
    setToast({ show: true, message, title });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        allHoldings,
        fetchHoldings,
        showSuccessToast,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      <Toast show={toast.show} message={toast.message} title={toast.title} />
    </GeneralContext.Provider>
  );
};

export default GeneralContext;