"use client";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
// components
// import Loader from "../Loader";
// styles
import GlobalStyles from "@/app/styles/Global.styles";
// utils
import { devices, theme } from "@/app/utils/data";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [setLoading]);

  return (
    <ThemeProvider theme={{ ...theme, devices }}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            // crossOrigin
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;800&family=Open+Sans:wght@600;700&family=Poppins:wght@100;200;300;400;500;600;700&family=Source+Sans+3:wght@400;600&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Source Sans Pro"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Inika"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
