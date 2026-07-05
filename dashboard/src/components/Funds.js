import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config";
import GeneralContext from "./GeneralContext";

const Funds = () => {
  const [funds, setFunds] = useState(100000.00);
  const [usedMargin, setUsedMargin] = useState(0.00);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("ADD"); // "ADD" or "WITHDRAW"
  const [amount, setAmount] = useState("");
  const [modalError, setModalError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { showSuccessToast } = useContext(GeneralContext);

  const fetchFundsData = () => {
    setLoading(true);
    axios.get(`${API_URL}/user/funds`)
      .then((res) => {
        setFunds(res.data.funds);
        setUsedMargin(res.data.usedMargin);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching funds:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFundsData();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setAmount("");
    setModalError("");
    setShowModal(true);
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setModalError("Please enter a valid positive amount.");
      return;
    }

    if (modalType === "WITHDRAW" && amountNum > funds) {
      setModalError("Insufficient balance for withdrawal.");
      return;
    }

    setActionLoading(true);
    const endpoint = modalType === "ADD" ? "/user/funds/add" : "/user/funds/withdraw";
    
    axios.post(`${API_URL}${endpoint}`, { amount: amountNum })
      .then((res) => {
        setActionLoading(false);
        setShowModal(false);
        setFunds(res.data.funds);
        const actionText = modalType === "ADD" ? "added to" : "withdrawn from";
        showSuccessToast(`₹${amountNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} successfully ${actionText} your account!`, "Funds Updated");
      })
      .catch((err) => {
        setActionLoading(false);
        setModalError(err.response?.data || "An error occurred. Please try again.");
      });
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h4 style={{ fontWeight: "300", color: "#888" }}>Loading funds data...</h4>
      </div>
    );
  }

  return (
    <>
      <div className="funds" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "0.9rem" }}>Instant, zero-cost fund transfers with UPI </p>
        <div>
          <button className="btn btn-green" onClick={() => openModal("ADD")} style={{ cursor: "pointer" }}>Add funds</button>
          <button className="btn btn-blue" onClick={() => openModal("WITHDRAW")} style={{ cursor: "pointer" }}>Withdraw</button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p style={{ fontSize: "1.3rem", fontWeight: "600", color: "var(--text-color)" }}>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored" style={{ color: "#4caf50", fontWeight: "bold" }}>
                {funds.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp" style={{ fontWeight: "bold" }}>
                {usedMargin.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp" style={{ fontWeight: "bold" }}>
                {funds.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <hr style={{ borderColor: "#eee" }} />
            <div className="data">
              <p>Opening Balance</p>
              <p>{funds.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr style={{ borderColor: "#eee" }} />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity" style={{ border: "1px solid #ddd", padding: "40px", borderRadius: "4px", textAlign: "center" }}>
            <p style={{ margin: "0 0 15px 0" }}>You don't have a commodity account</p>
            <button className="btn btn-blue" style={{ cursor: "pointer" }}>Open Account</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "var(--background-color, #fff)",
            color: "var(--text-color, #333)",
            padding: "30px",
            borderRadius: "6px",
            width: "360px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            border: "1px solid #ddd",
          }}>
            <h4 style={{ margin: "0 0 15px 0", fontWeight: "600" }}>
              {modalType === "ADD" ? "Add Funds to Account" : "Withdraw Funds"}
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#888", margin: "0 0 20px 0" }}>
              {modalType === "ADD" 
                ? "Simulate a UPI / NetBanking payment to increase your margin balance." 
                : "Transfer funds back to your linked bank account."
              }
            </p>
            <form onSubmit={handleActionSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "5px" }}>
                  Amount (INR)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 5000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "1.1rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  autoFocus
                  required
                />
              </div>
              {modalError && (
                <p style={{ color: "#d9534f", fontSize: "0.85rem", margin: "0 0 15px 0", fontWeight: "500" }}>
                  {modalError}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                  style={{ backgroundColor: "#888", cursor: "pointer" }}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={modalType === "ADD" ? "btn btn-green" : "btn btn-blue"}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : modalType === "ADD" ? "Add Funds" : "Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;