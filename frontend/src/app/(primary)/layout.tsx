"use client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
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
  const { ffmpegState, setFFmpegState, messageState } = useAppStore();

  const errorIds = Object.getOwnPropertyNames(messageState);

  useEffect(() => {
    setFFmpegState(new FFmpeg());
  }, []);

  useEffect(() => {
    if (ffmpegState) {
      console.log("about to load ffmpegState");
      console.log(new Date());
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

      ffmpegState
        .load({
          coreURL: `${baseURL}/ffmpeg-core.js`,
          wasmURL: `${baseURL}/ffmpeg-core.wasm`,
          workerURL: `${baseURL}/ffmpeg-worker.js`,
        })
        .then((res) => {
          console.log("load ffmpeg response");
          console.log({ res });
          console.log(new Date());
        })
        .catch((err) => {
          console.log("FFmpegState load error");
          console.log(err);
        });
    }
  }, [ffmpegState]);

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
