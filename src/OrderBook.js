import React, { useState } from "react";
import "./App.css";

const options = [
  { label: 0.1, value: 0.1 },
  { label: 0.5, value: 0.5 },
  { label: 1, value: 1 },
];

export default function OrderBook({ bids = [], asks = [] }) {
  const [aggregation, setAggregation] = useState(0.1);

  const handleAggregationChange = (e) => {
    setAggregation(parseFloat(e.target.value));
  };

  const filteredBids = bids.filter(bid => bid[0] % aggregation === 0);
  const filteredAsks = asks.filter(ask => ask[0] % aggregation === 0);

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
            {filteredBids.slice(0, 10).map((bid, index) => (
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
            {filteredAsks.slice(0, 10).map((ask, index) => (
              <tr key={index}>
                <td>{ask[0]}</td>
                <td>{ask[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="select-aggregation">
        <h4>Aggrecation</h4>
        <select value={aggregation} onChange={handleAggregationChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
