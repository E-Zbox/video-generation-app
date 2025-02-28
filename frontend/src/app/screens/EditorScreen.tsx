"use client";
import React from "react";
// components
import MediaTray from "../components/Editor/MediaTray";
import Studio from "../components/Editor/Studio";
// store
import { useAppStore } from "../store";
// styles
import { MainEditor } from "../styles/Editor/index.styles";
// utils

const EditorScreen = () => {
  const { navbarHeightState } = useAppStore();

  return (
    <MainEditor $marginTop={navbarHeightState}>
      <MediaTray />
      <Studio />
    </MainEditor>
  );
};

export default EditorScreen;
