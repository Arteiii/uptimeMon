"use client";

import React, { useState, useEffect } from "react";
import { TableComponent } from "../../components/TableComponent";

import PingChart from "@components/PingChart";

function App() {
  const [pingData, setPingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ip = "192.168.178.73";
      const response = await fetch(`http://localhost:8000/ips/${ip}`);
      const data = await response.json();
      setPingData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="app bg-slate-200 dark:bg-slate-900 h-screen w-full p-6 transition-colors duration-500 ease-in-out">
      <div className="flex flex-col items-center h-full justify-between">
        <h1 className="text-slate-800 dark:text-slate-200">Ping</h1>
        <h2 className="text-slate-800 dark:text-slate-200">
          long term &quot;jobs&quot;
        </h2>
        {pingData && <PingChart data={pingData} />}
      </div>
    </div>
  );
}

export default App;
