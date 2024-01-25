"use client";

import React, { useState, useEffect } from "react";
import PingChart from "@components/PingChart";
import { AddIPForm } from "@components/AddIPForm";

function App() {
  const [pingData, setPingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const durationInHours = 3 * 24; // 3 days in hours

      const response = await fetch(
        `http://192.168.178.58:8000/ips/all/${durationInHours}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const firstDocument = data[0];

        const pingChartData = {
          ip_info: firstDocument.ip_info,
          pings: firstDocument.pings,
        };

        setPingData(pingChartData);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app bg-slate-200 dark:bg-slate-900 h-screen w-full p-6 transition-colors duration-500 ease-in-out">
      <div className="flex flex-col items-start h-full justify-between">
        <AddIPForm />

        <div className="flex-grow">
          {pingData && <PingChart pingData={pingData} />}
        </div>
      </div>
    </div>
  );
}

export default App;
