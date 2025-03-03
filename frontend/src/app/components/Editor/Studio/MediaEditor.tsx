"use client";
import React, { useEffect, useRef, useState } from "react";
// components
import TextEditor from "./TextEditor";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import {
  MainMediaEditor,
  PlayButton,
} from "@/app/styles/Editor/Studio/MediaEditor.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";

const MediaEditor = () => {
  const {
    videoGeneration: {
      assets: {
        videoJS: { play, pause },
      },
    },
  } = screens;

  const {
    textEditorActivatedState,
    selectedSceneIndex,
    sceneState,
    trimmedBackgroundVideoState,
  } = useStoryboardEditorStore();

  if (selectedSceneIndex == null) {
    return <MainMediaEditor></MainMediaEditor>;
  }

  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoIsPlayingState, setVideoIsPlayingState] = useState(false);

  const scene = sceneState[selectedSceneIndex];

  const {
    background: {
      src: [src],
    },
    sub_scenes,
    time,
  } = scene;

  const isVideo = src.type;
  const path =
    trimmedBackgroundVideoState[`${selectedSceneIndex}-${src.url}`]?.video ||
    src.url;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (videoRef.current) {
      if (videoIsPlayingState) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const pauseEventListener = (e: Event) => {
        setVideoIsPlayingState(false);
      };

      videoRef.current.addEventListener("pause", pauseEventListener);

      const playEventListener = (e: Event) => {
        setVideoIsPlayingState(true);
      };

      videoRef.current.addEventListener("play", playEventListener);

      return () => {
        videoRef.current?.removeEventListener("pause", pauseEventListener);
        videoRef.current?.removeEventListener("play", playEventListener);
      };
    }
  }, [videoRef]);

  useEffect(() => {
    setVideoIsPlayingState(false);
  }, [selectedSceneIndex]);

  return (
    <MainMediaEditor>
      {textEditorActivatedState ? (
        <TextEditor />
      ) : isVideo ? (
        <>
          <PlayButton
            $icon={videoIsPlayingState ? pause : play}
            onClick={handleClick}
          />
          <video ref={videoRef} src={path} controls />
        </>
      ) : (
        <CustomImage $size="100%" />
      )}
    </MainMediaEditor>
  );
};

export default MediaEditor;
