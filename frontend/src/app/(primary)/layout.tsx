"use client";
import React, { useEffect } from "react";
// components
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
// import Footer from "../components/footer";
// store
import { useAppStore } from "../store";
// styles
import { MainApp } from "@/app/styles/App.styles";
import { PositionContainer } from "../styles/shared/Container.styles";

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { errorState } = useAppStore();

  const errorIds = Object.getOwnPropertyNames(errorState);

  return (
    <>
      <MainApp>
        <Navbar />
        {children}
        {errorIds.length > 0 ? (
          <PositionContainer
            $height="100%"
            $padding="20px 0px"
            $position="fixed"
            $width="100%"
          >
            {errorIds.map((id) => (
              <Modal key={id} id={id} />
            ))}
          </PositionContainer>
        ) : (
          <></>
        )}
      </MainApp>
    </>
  );
}
