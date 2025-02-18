import type { Metadata } from "next";
import React from "react";
// components
import Layout from "./components/layout";

export const metadata: Metadata = {
  title: "Text to Video",
  description: "Bring your scripts to life using our TV (Text to Video) app",
  keywords: ["video generation", "ai", "ai video generation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
