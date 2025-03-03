"use client";
import React, { useCallback, useEffect, useRef } from "react";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import { MainSoundProgressBar } from "@/app/styles/Editor/Studio/SoundProgressBar.styles";

const SoundProgressBar = () => {
  const { audioState, audioRefState, setAudioRefState } =
    useStoryboardEditorStore();

  const audioRefCallback = useCallback((node: HTMLAudioElement) => {
    setAudioRefState(node);
  }, []);

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { clientX } = e;

    const rect = e.currentTarget.getBoundingClientRect();

    // let's update time
    if (audioRefState) {
      audioRefState.currentTime =
        ((clientX - rect.left) * audioRefState.duration) / rect.width;
    }
  };

  useEffect(() => {
    if (audioRefState && progressBarRef.current) {
      const timeupdateEventListener = (e: Event) => {
        const progressBarWidth =
          (audioRefState.currentTime * 100) / audioRefState.duration;

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${progressBarWidth}%`;
        }
      };

      audioRefState.addEventListener("timeupdate", timeupdateEventListener);

      return () => {
        audioRefState.removeEventListener(
          "timeupdate",
          timeupdateEventListener
        );
      };
    }
  }, [audioRefState, progressBarRef]);

  return (
    <MainSoundProgressBar onClick={handleClick}>
      <audio ref={audioRefCallback} src={audioState.tts}></audio>
      <div ref={progressBarRef}></div>
    </MainSoundProgressBar>
  );
};

export default SoundProgressBar;
