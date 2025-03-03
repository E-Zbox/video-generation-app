"use client";
import React, { useEffect, useState } from "react";
// components
import DarkOverlay from "../../shared/DarkOverlay";
// screens
import { IVideoMeta } from "@/app/screens/interface";
// store
import { useEditorStore } from "@/app/store";
// styles
import { MainMedia } from "@/app/styles/Editor/MediaTray/UploadMedia.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { timeFormatter } from "@/app/utils/transformer";

interface IProps {
  index: number;
  path: string;
}

const AIGeneratedScene = (props: IProps) => {
  const { index, path } = props;

  const {
    default: {
      assets: { loaderTwoIcon },
    },
  } = screens;

  const {
    selectedAiGeneratedSceneIndex,
    setSelectedAiGeneratedScenes,
    replaceBgState,
    setReplaceBgState,
    thumbnailState,
    videoMetadataState,
  } = useEditorStore();

  const [loadingState, setLoadingState] = useState(true);
  const [metadataState, setMetadataState] = useState<IVideoMeta>({
    duration: 0,
    name: "",
    initialDuration: 0,
    videoHeight: 0,
    videoWidth: 0,
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!replaceBgState.activated) {
      return;
    }

    if (index === selectedAiGeneratedSceneIndex) {
      setSelectedAiGeneratedScenes(null);
      setReplaceBgState({ activated: true, transientValue: "", type: "video" });
    } else {
      setSelectedAiGeneratedScenes(index);
      setReplaceBgState({
        activated: true,
        transientValue: path,
        type: "video",
      });
    }
  };

  useEffect(() => {
    if (thumbnailState[path] && metadataState.duration > 0) {
      setLoadingState(false);
    }
  }, [thumbnailState, metadataState]);

  useEffect(() => {
    if (videoMetadataState[path]) {
      setMetadataState(videoMetadataState[path]);
    }
  }, [videoMetadataState]);

  return (
    <MainMedia
      $bgImg={thumbnailState[path]}
      $selected={
        !loadingState &&
        replaceBgState.activated &&
        index === selectedAiGeneratedSceneIndex
      }
      onClick={handleClick}
    >
      {loadingState ? (
        <DarkOverlay>
          <CustomImage src={loaderTwoIcon.src} $size={"80px"} />
        </DarkOverlay>
      ) : metadataState.duration ? (
        <span>{timeFormatter(metadataState.initialDuration)}</span>
      ) : (
        <></>
      )}
    </MainMedia>
  );
};

export default AIGeneratedScene;
