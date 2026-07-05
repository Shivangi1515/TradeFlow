import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    axios.get(`${API_URL}/allOrders`)
      .then((res) => {
        setAllOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleGetStarted = () => {
    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h4 style={{ fontWeight: "300", color: "#888" }}>Loading orders...</h4>
      </div>
    );
  }

  return (
    <div className="orders">
      {allOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <button className="btn btn-blue" onClick={handleGetStarted} style={{ cursor: "pointer", marginTop: "10px" }}>
            Get started
          </button>
        </div>
      ) : (
        <>
          <h3 className="title">Orders ({allOrders.length})</h3>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order, index) => {
                  const dateObj = new Date(order.date);
                  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  return (
                    <tr key={index}>
                      <td>{order.name}</td>
                      <td>{order.qty}</td>
                      <td>{order.price.toFixed(2)}</td>
                      <td className={order.mode === "BUY" ? "profit" : "loss"} style={{ fontWeight: "bold" }}>
                        {order.mode}
                      </td>
                      <td style={{ color: "#888" }}>{formattedTime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;