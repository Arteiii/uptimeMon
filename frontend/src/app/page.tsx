"use client";

import React from "react";
import { TableComponent } from "@components/TableComponent";

function App() {
  return (
    <div className="app bg-slate-200 dark:bg-slate-900 h-screen w-full p-6 transition-colors duration-500 ease-in-out">
      <div className="flex flex-col items-center h-full justify-between">
        <h1 className="text-slate-800 dark:text-slate-200">Hello World</h1>
        <TableComponent />
      </div>
    </div>
  );
}

export default App;
