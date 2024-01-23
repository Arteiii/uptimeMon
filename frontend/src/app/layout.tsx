"use client";

import { Inter } from "next/font/google";
import { ThemeProvider, Button } from "@material-tailwind/react";

import "./globals.css";
import { Footer } from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });
export { ThemeProvider, Button };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
