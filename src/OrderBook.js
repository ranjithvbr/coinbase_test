import React from "react";
import "./App.css";

export default function OrderBook({ bids = [], asks = [] }) {
  return (
    <div className="order-book">
      <h3 className="order-book-title">Order Book</h3>
      <div className="bids">
        <h3 className="order-book-title">Bids</h3>
        <table>
          <thead>
            <tr>
              <th className="header-margin">Price (USD)</th>
              <th>Market Size</th>
            </tr>
          </thead>
          <tbody>
            {bids.slice(0, 15).map((bid, index) => (
              <tr key={index}>
                <td>{bid[0]}</td>
                <td>{bid[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="asks">
        <h3 className="order-book-title">Asks</h3>
        <table>
          <thead>
            <tr>
              <th className="header-margin">Price (USD)</th>
              <th>Market Size</th>
            </tr>
          </thead>
          <tbody>
            {asks.slice(0, 15).map((ask, index) => (
              <tr key={index}>
                <td>{ask[0]}</td>
                <td>{ask[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
