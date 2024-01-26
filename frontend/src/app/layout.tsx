"use client";

import { Inter } from "next/font/google";
import {
  ThemeProvider as TailwindThemeProvider,
  Button,
} from "@material-tailwind/react";

import "@styles/globals.css";
import { Footer } from "@components/Footer";
import { StickyNavbar } from "@components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TailwindThemeProvider>
      <html lang="en">
        <body className={inter.className}>
          <StickyNavbar />
          {children}
          <Footer /> 
        </body>
      </html>
    </TailwindThemeProvider>
  );
}
