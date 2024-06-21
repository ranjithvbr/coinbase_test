import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import streamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-adapter-moment';
import "./App.css";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, TimeScale, Tooltip, Legend, streamingPlugin);

const ChartComponent = React.memo(({ buf }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [buf]);

  return (
    <Line
      ref={chartRef}
      data={{
        datasets: [
          {
            label: 'Bid',
            borderColor: '#019fcf',
            backgroundColor: '#019fcf',
            data: buf.current[0],
          },
          {
            label: 'Ask',
            borderColor: '#fcb146',
            backgroundColor: '#fcb146',
            data: buf.current[1],
          },
        ],
      }}
      options={{
        plugins: {
          streaming: {
            duration: 300000,
            onRefresh: (chart) => {
              Array.prototype.push.apply(chart.data.datasets[0].data, buf.current[0]);
              Array.prototype.push.apply(chart.data.datasets[1].data, buf.current[1]);
              buf.current = [[], []];
            },
          },
        },
        scales: {
          x: {
            type: 'realtime',
          },
        },
      }}
    />
  );
});

export default ChartComponent;
