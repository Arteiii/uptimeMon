"use client";

import React from "react";
import { TableComponent } from "@components/TableComponent";

function App() {
  return (
    <div className="app bg-slate-200 dark:bg-slate-900 h-screen w-full p-6 transition-colors duration-500 ease-in-out">
      <div className="flex flex-col items-center h-full justify-between">
        <TableComponent />
      </div>
    </div>
  );
}

export default App;
