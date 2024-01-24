"use client";


import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const PingChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.pings) {
      const timestamps = data.pings.map((ping) => ping.timestamp);
      const responseTimes = data.pings.map(
        (ping) => ping.additional_data.response_time
      );

      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: timestamps,
          datasets: [
            {
              label: "Response Time",
              data: responseTimes,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointRadius: 5,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "minute",
                tooltipFormat: "ll HH:mm",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Response Time (ms)",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: data.ip_info.name,
              font: {
                size: 16,
              },
            },
            subtitle: {
              display: true,
              text: data.ip_info.note,
              font: {
                size: 14,
              },
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <canvas ref={chartRef} style={{ maxWidth: "600px", margin: "auto" }} />
  );
};

export default PingChart;
