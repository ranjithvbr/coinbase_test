import React, { useState, useEffect, useRef } from "react";
import OrderBook from "./OrderBook";
import Chart from "./Chart";
import "./App.css";


const options = [
  { value: "BTC-USD", label: "BTC-USD" },
  { value: "ETH-USD", label: "ETH-USD" },
  { value: "LTC-USD", label: "LTC-USD" },
  { value: "BCH-USD", label: "BCH-USD" },
];

const App = () => {
  const [pair, setPair] = useState("Select");
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [bestBid, setBestBid] = useState({ price: 0, quantity: 0 });
  const [bestAsk, setBestAsk] = useState({ price: 0, quantity: 0 });
  const [loading, setLoading] = useState(true);

  const streamerObj = useRef({});
  const buf = useRef([[], []]);

  useEffect(() => {
    if (pair !== "Select") {
      loadWSSDataAndDisplayCanvas(pair);
      const intervalId = setInterval(() => {
        loadOrderBook(pair);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [pair]);

  const optionClick = (option) => {
    if (pair !== "Select") {
      buf.current = [[], []];
      setBids([]);
      setAsks([]);
      setBestBid({ price: 0, quantity: 0 });
      setBestAsk({ price: 0, quantity: 0 });
      unsubscribe();
    }
    setLoading(true);
    setPair(option);
  };

  const loadWSSDataAndDisplayCanvas = (pair) => {
    const unMappedPair = pair?.replace("_", "-");
    buf.current = [[], []];
    const streamer = new WebSocket("wss://ws-feed.pro.coinbase.com");

    streamerObj.current = { streamer, pair: unMappedPair };

    streamer.onopen = () => {
      const subRequest = {
        type: "subscribe",
        channels: [
          {
            name: "ticker",
            product_ids: [unMappedPair],
          },
        ],
      };
      streamer.send(JSON.stringify(subRequest));
    };

    streamer.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setLoading(false);
      if (data.type === "error") {
        unsubscribe();
      }

      if (data.type === "ticker") {
        const topBid = data.best_bid;
        const topAsk = data.best_ask;
        const timestamp = Date.parse(data.time);
        if (topBid) {
          buf.current[0].push({
            x: timestamp,
            y: topBid,
          });
          if (Number(topBid) > bestBid.price || bestBid.price === 0) {
            setBestBid((prevBestBid) => {
              return {
                price: Math.max(prevBestBid.price, topBid),
                quantity: Math.max(prevBestBid.quantity, data.best_bid_size),
              };
            });
          }
        }
        if (topAsk) {
          buf.current[1].push({
            x: timestamp,
            y: topAsk,
          });
          if (Number(topAsk) < bestAsk.price || bestAsk.price === 0) {
            setBestAsk((prevBestAsk) => {
              return {
                price: Math.max(prevBestAsk.price, topAsk),
                quantity: Math.max(prevBestAsk.quantity, data.best_ask_size),
              };
            });
          }
        }
      }
    };
  };

  const loadOrderBook = async (pair) => {
    try {
      const response = await fetch(`https://api.pro.coinbase.com/products/${pair}/book?level=2`);
      const data = await response.json();
      setBids(data.bids || []);
      setAsks(data.asks || []);
    } catch (error) {
      console.error("Error fetching order book:", error);
    }
  };

  const unsubscribe = () => {
    const unsubscribeRequest = {
      type: "unsubscribe",
      channels: [
        {
          name: "ticker",
          product_ids: [streamerObj.current.pair],
        },
      ],
    };

    streamerObj.current.streamer.send(JSON.stringify(unsubscribeRequest));
    streamerObj.current.streamer.close();

    console.log("WSS connections closed");
  };

  return (
    <div className="container">
      <div className="canvas-container">
        <div className="custom-select">
          <select value={pair} onChange={(e) => optionClick(e.target.value)}>
            <option key={"Select"} value={"Select"}>
              {"Select Pair"}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {pair !== "Select" && (
          <div className="detail-container">
            <div>
              <div className="detail-header detail-header-bid">Best Bid</div>
              <div className="detail-content">
                <div className="detail-price-left">
                  <div>{bestBid.price}</div>
                  <span>Bid Price</span>
                </div>
                <div className="detail-price-right">
                  <div>{bestBid.quantity}</div>
                  <span>Bid Quantity</span>
                </div>
              </div>
            </div>
            <div>
              <div className="detail-header detail-header-ask">Best Ask</div>
              <div className="detail-content">
                <div className="detail-price-left">
                  <div>{bestAsk.price}</div>
                  <span>Ask Price</span>
                </div>
                <div className="detail-price-right">
                  <div>{bestAsk.quantity}</div>
                  <span>Ask Quantity</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {pair !== "Select" ? loading ? "Loading..." : <Chart buf={buf} /> : <></>}
      </div>
      {pair !== "Select" && bids?.length > 0 && asks?.length > 0 && <OrderBook bids={bids} asks={asks} />}
    </div>
  );
};

export default App;
