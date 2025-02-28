"use client";
import React, { useEffect, useRef, useState } from "react";
// api
import { IVoiceOverTrack } from "@/api/interfaces/voiceover";
// store
import { useEditorStore } from "@/app/store";
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
    voiceoverTrackState,
  } = useEditorStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isReadyState, setIsReadyState] = useState(false);

  const voiceoverState = voiceoverTrackState[language][voiceoverId];

  const handleLoadedMetadata = () => {
    setIsReadyState(true);
  };

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    if (isReadyState) {
      selectVoiceoverTrackState(language, voiceoverId);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (voiceoverState.playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [voiceoverState]);

  useEffect(() => {
    if (audioRef.current) {
      const endedEventListener = (e: Event) => {
        pauseVoiceoverTrackState(language, voiceoverId);
      };

      audioRef.current.addEventListener("ended", endedEventListener);
    }
  }, [audioRef]);

  return (
    <VoiceOption
      $isMale={gender.toLowerCase() == "male"}
      $selected={voiceoverState.selected}
      onClick={handleClick}
    >
      <audio
        src={sample}
        ref={audioRef}
        onLoad={handleLoadedMetadata}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div>
        {isReadyState ? (
          <CustomImage
            src={voiceoverState.playing ? bluePauseIcon.src : bluePlayIcon.src}
            $size="14px"
            onClick={(e) => {
              e.stopPropagation();
              if (isReadyState) {
                playVoiceoverTrackState(language, voiceoverId);
              }
            }}
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
