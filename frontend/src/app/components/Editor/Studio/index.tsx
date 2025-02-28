"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
// api
import { getVoiceOverTracks } from "@/api/rest/voiceover";
// components
import DarkOverlay from "../../shared/DarkOverlay";
import Scene from "./Scene";
import TrimTool from "./TrimTool";
import VoiceOver from "./VoiceOver";
// store
import {
  useAppStore,
  useEditorStore,
  useStoryboardEditorStore,
} from "@/app/store";
import { IVoiceOver } from "@/app/store/interfaces";
// styles
import {
  MainScene,
  MainSelect,
  MainStudio,
  SettingsButton,
  Option,
  Select,
  SettingsTray,
  VideoStudio,
  MainOption,
  MainLogo,
  LogoInput,
  OptionHeader,
  SceneContainer,
  SceneScroller,
  SoundPlayer,
  SoundTimer,
  ReplaceButton,
} from "@/app/styles/Editor/Studio/index.styles";
import { DivContainer } from "@/app/styles/shared/Container.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import MediaEditor from "./MediaEditor";
import SoundProgressBar from "./SoundProgressBar";
import { timeFormatter } from "@/app/utils/transformer";

const Studio = () => {
  const {
    default: {
      assets: { loaderTwoIcon },
    },
    videoEditor: {
      assets: {
        editIcon,
        purplePauseIcon,
        purplePlayIcon,
        redoIcon,
        speakIcon,
        trimIcon,
        undoIcon,
      },
    },
  } = screens;

  const { updateMessageState } = useAppStore();
  const {
    replaceBgState,
    setReplaceBgState,
    voiceoverTrackState,
    setVoiceoverTrackState,
  } = useEditorStore();
  const {
    audioRefState,
    loadingState,
    sceneState,
    selectedSceneIndex,
    trimActivatedState,
    setTrimActivatedState,
    updateSceneBackgroundUrlState,
  } = useStoryboardEditorStore();
  const { futureStates, pastStates, redo, undo } =
    useStoryboardEditorStore.temporal.getState();

  const mainSceneRef = useRef<HTMLDivElement>(null);

  const [audioCurrentTimeState, setAudioCurrentTimeState] = useState(0);
  const [audioIsPlayingState, setAudioIsPlayingState] = useState(false);
  const [showBrandLogoInputState, setShowBrandLogoInputState] = useState(false);
  const [showSelectState, setShowSelectState] = useState(false);

  const voiceoverTrackLanguages =
    Object.getOwnPropertyNames(voiceoverTrackState);

  let selectedVoiceoverTrack = {
    language: "",
    id: "",
  };

  voiceoverTrackLanguages.forEach((language) => {
    return Object.getOwnPropertyNames(voiceoverTrackState[language]).find(
      (id) => {
        const voiceover = voiceoverTrackState[language][id];

        if (voiceover.selected) {
          selectedVoiceoverTrack = { language, id };
        }
      }
    );
  });

  const toggleBrandLogoInputState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowBrandLogoInputState((prevState) => !prevState);
  };

  const toggleShowSelectState = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowSelectState((prevState) => !prevState);
  };

  const handleTrimClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    console.log({
      selectedSceneIndexIsNull: selectedSceneIndex == null,
      selectedSceneIndex,
    });
    if (selectedSceneIndex == null) {
      updateMessageState({
        message: "Select a scene to continue",
        success: false,
        timeoutInMilliseconds: 5000,
      });

      return;
    }

    if (trimActivatedState) {
      setTrimActivatedState(false);
    } else {
      setTrimActivatedState(true);
    }
  };

  const handleSoundPlayerClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (audioIsPlayingState) {
      audioRefState?.pause();
    } else {
      audioRefState?.play();
    }
  };

  const handleReplaceBackgroundClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (selectedSceneIndex == null) {
      updateMessageState({
        message: "Select a scene to continue",
        success: false,
        timeoutInMilliseconds: 5000,
      });
      return;
    }
    if (!replaceBgState.activated) {
      setReplaceBgState({ activated: true, transientValue: "", type: "video" });
    } else {
      // let's replace value of selected index
      const { transientValue, type } = replaceBgState;

      updateSceneBackgroundUrlState(
        selectedSceneIndex,
        0,
        transientValue,
        type
      );

      setReplaceBgState({
        activated: false,
        transientValue: "",
        type: "video",
      });
    }
  };

  const handleUndoClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (pastStates.length == 0) return;

    undo();
  };

  const handleRedoClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (futureStates.length == 0) return;

    redo();
  };

  useEffect(() => {
    getVoiceOverTracks()
      .then((res) => {
        const { data, error, success } = res;

        if (success) {
          setVoiceoverTrackState(
            data
              .filter((item) => item.category !== "premium")
              .map((voiceover) => ({ ...voiceover, selected: false }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (audioRefState) {
      const pauseEventListener = (e: Event) => {
        setAudioIsPlayingState(false);
      };

      audioRefState.addEventListener("pause", pauseEventListener);

      const playEventListener = (e: Event) => {
        setAudioIsPlayingState(true);
      };

      audioRefState.addEventListener("play", playEventListener);

      const timeupdateEventListener = (e: Event) => {
        setAudioCurrentTimeState(audioRefState?.currentTime || 0);
      };

      audioRefState?.addEventListener("timeupdate", timeupdateEventListener);

      return () => {
        audioRefState.removeEventListener("pause", pauseEventListener);
        audioRefState.removeEventListener("play", playEventListener);
        audioRefState?.removeEventListener(
          "timeupdate",
          timeupdateEventListener
        );
      };
    }
  }, [audioRefState]);

  useEffect(() => {
    if (mainSceneRef.current) {
      mainSceneRef.current.scrollTo({
        behavior: "smooth",
        top: trimActivatedState ? mainSceneRef.current.clientHeight : 0,
      });
    }
  }, [trimActivatedState]);

  return (
    <MainStudio>
      <VideoStudio>
        <SettingsTray>
          <SettingsButton
            onClick={handleUndoClick}
            disabled={pastStates.length <= 4}
          >
            <CustomImage src={undoIcon.src} $size="32px" />
            UNDO
          </SettingsButton>
          <SettingsButton
            onClick={handleRedoClick}
            disabled={futureStates.length == 0}
          >
            REDO
            <CustomImage src={redoIcon.src} $size="32px" />
          </SettingsButton>
          <SettingsButton
            $selected={trimActivatedState}
            onClick={handleTrimClick}
          >
            <CustomImage src={trimIcon.src} $size="24px" />
            Trim Video
          </SettingsButton>
          <MainLogo>
            <SettingsButton onClick={toggleBrandLogoInputState}>
              <CustomImage
                src={
                  "https://imgs.search.brave.com/D4mrpIvRcRXo331X0bw8n9iKnwJYSdeIlR9_hHFw7t0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvYW5pbWF0aW9u/LXBpY3R1cmVzLTFs/YTczdnFrY2h1c3g2/OTMuanBn"
                }
                $size="32px"
              />
              Brand Logo
            </SettingsButton>
            {showBrandLogoInputState ? <LogoInput /> : <></>}
          </MainLogo>
          <SettingsButton>
            <CustomImage src={editIcon.src} $size="24px" />
            Edit Text
          </SettingsButton>
          <MainSelect>
            <Select
              $selected={selectedVoiceoverTrack.language.length > 0}
              onClick={toggleShowSelectState}
            >
              <CustomImage src={speakIcon.src} $size="24px" />
              {selectedVoiceoverTrack.language.length > 0
                ? voiceoverTrackState[selectedVoiceoverTrack.language][
                    selectedVoiceoverTrack.id
                  ].name
                : "AI Voices"}
            </Select>
            {showSelectState ? (
              <MainOption>
                <DivContainer
                  key={`${Math.random()}-${Date.now()}`}
                  $alignItems="flex-start"
                  $width="100%"
                >
                  {voiceoverTrackLanguages.map((language) => {
                    const ids = Object.getOwnPropertyNames(
                      voiceoverTrackState[language]
                    );

                    return (
                      <Fragment key={language}>
                        <OptionHeader>{language}</OptionHeader>
                        {ids.map((id) => (
                          <VoiceOver
                            key={id}
                            {...voiceoverTrackState[language][id]}
                          />
                        ))}
                      </Fragment>
                    );
                  })}
                </DivContainer>
              </MainOption>
            ) : (
              <></>
            )}
          </MainSelect>
          <ReplaceButton onClick={handleReplaceBackgroundClick}>
            {replaceBgState.activated ? "Save " : "Replace Bg"}
          </ReplaceButton>
        </SettingsTray>
        {selectedSceneIndex !== null ? <MediaEditor /> : <></>}
      </VideoStudio>
      <MainScene ref={mainSceneRef}>
        <DivContainer $alignItems="flex-start" $width="100%">
          {/* scrolls vertically and horizontally to either display Scenes or TrimTool */}
          <DivContainer
            $flexDirection="row"
            $alignItems="center"
            $flexWrap="nowrap"
            $justifyContent="flex-start"
            // $height="100%"
            $width="100%"
          >
            <SoundPlayer>
              <CustomImage
                src={
                  audioIsPlayingState ? purplePauseIcon.src : purplePlayIcon.src
                }
                $hover={true}
                $size="50px"
                onClick={handleSoundPlayerClick}
              />
              <SoundTimer>
                <p>{timeFormatter(audioCurrentTimeState)}</p>
                <p>/</p>
                <p>{timeFormatter(audioRefState?.duration || 0)}</p>
              </SoundTimer>
            </SoundPlayer>
            <SceneScroller>
              <SceneContainer>
                {sceneState.map((scene, index) => (
                  <Scene key={index} index={index} />
                ))}
                <SoundProgressBar />
              </SceneContainer>
            </SceneScroller>
          </DivContainer>
          {selectedSceneIndex !== null &&
          sceneState[selectedSceneIndex].background.src[0].type == "video" ? (
            <TrimTool />
          ) : (
            <></>
          )}
        </DivContainer>
      </MainScene>
      {loadingState ? (
        <DarkOverlay>
          <CustomImage src={loaderTwoIcon.src} alt="loader-icon" $size="80px" />
          :<></>
        </DarkOverlay>
      ) : (
        <></>
      )}
    </MainStudio>
  );
};

export default Studio;
