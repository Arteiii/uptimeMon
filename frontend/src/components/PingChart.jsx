"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function PingChart({ pingData }) {
  const formattedData = pingData.pings.map((ping) => ({
    name: ping.timestamp,
    duration: ping.additional_data.response_time,
  }));

  return (
    <div className="rounded-md border p-4 mb-4 bg-gray-100">
      <h2 className="text-xl font-semibold mb-2 text-blue-700">
        {pingData.ip_info.name}
      </h2>
      <p className="text-gray-600 mb-2">
        IP Address: {pingData.ip_info.ip_address}
      </p>
      <p className="text-gray-600 mb-4">
        Hostname: {pingData.ip_info.host_name}
      </p>

      <LineChart
        width={800}
        height={400}
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="duration"
          stroke="#2a69ac" // Adjusted line color
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
}
