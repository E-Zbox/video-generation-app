"use client";
import React, { useEffect, useRef, useState } from "react";
// api
import { IVoiceOverTrack } from "@/api/interfaces/voiceover";
// store
import { useEditorStore, useStoryboardEditorStore } from "@/app/store";
// styles
import { VoiceOption } from "@/app/styles/Editor/Studio/VoiceOver.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";

interface IProps extends IVoiceOverTrack {}

const VoiceOver = (props: IProps) => {
  const { id, gender, language, name, sample } = props;
  const voiceoverId = String(id);

  const {
    default: {
      assets: { loaderTwoIcon },
    },
    videoEditor: {
      assets: { bluePauseIcon, bluePlayIcon },
    },
  } = screens;

  const {
    pauseVoiceoverTrackState,
    playVoiceoverTrackState,
    selectVoiceoverTrackState,
    selectedVoiceOverTrackState,
    voiceoverTrackState,
  } = useEditorStore();
  const { voiceoverAudioRefState } = useStoryboardEditorStore();

  const [isReadyState, setIsReadyState] = useState(true);

  const voiceoverState = voiceoverTrackState[language][voiceoverId];

  const handleLoadedMetadata = () => {
    setIsReadyState(true);
  };

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    e.stopPropagation();
    if (isReadyState) {
      selectVoiceoverTrackState(language, voiceoverId);
    }
  };

  const handlePlay = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    if (voiceoverAudioRefState) {
      // check if voiceoverAudioRef is already loading an audio
      voiceoverAudioRefState.load();
      voiceoverAudioRefState.src = sample;
      playVoiceoverTrackState(language, voiceoverId);
    }
  };

  useEffect(() => {
    if (
      voiceoverAudioRefState &&
      selectedVoiceOverTrackState.language == language &&
      selectedVoiceOverTrackState.id == voiceoverId
    ) {
      // check if audio of previously selected audio is still loading

      if (voiceoverState.playing) {
        voiceoverAudioRefState.play();
      } else {
        voiceoverAudioRefState.pause();
      }
    }
  }, [selectedVoiceOverTrackState, voiceoverState]);

  useEffect(() => {
    if (
      selectedVoiceOverTrackState.language == language &&
      voiceoverAudioRefState &&
      selectedVoiceOverTrackState.id == voiceoverId
    ) {
      const endedEventListener = (e: Event) => {
        pauseVoiceoverTrackState(language, voiceoverId);
      };

      voiceoverAudioRefState.addEventListener("ended", endedEventListener);

      return () => {
        voiceoverAudioRefState.removeEventListener("ended", endedEventListener);
      };
    }
  }, [selectedVoiceOverTrackState, voiceoverAudioRefState]);

  return (
    <VoiceOption
      $isMale={gender.toLowerCase() == "male"}
      $selected={voiceoverState.selected}
      onClick={handleClick}
    >
      <div>
        {isReadyState ? (
          <CustomImage
            src={voiceoverState.playing ? bluePauseIcon.src : bluePlayIcon.src}
            $size="14px"
            onClick={handlePlay}
          />
        ) : (
          <CustomImage src={loaderTwoIcon.src} $size="32px" />
        )}
        {name}
      </div>
      <span>{gender}</span>
    </VoiceOption>
  );
};

export default VoiceOver;
