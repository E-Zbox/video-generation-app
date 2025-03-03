"use client";
import { useRouter } from "next/navigation";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// api
import {
  generateVideo,
  getDownloadableVideo,
  monitorVideoStatus,
} from "@/api/rest/ai-generation";
import { getVoiceOverTracks } from "@/api/rest/voiceover";
import { emitEvents, onEvents } from "@/api/socket";
// components
import DarkOverlay from "../../shared/DarkOverlay";
import EditTagTool from "./Scene/EditTagTool";
import MediaEditor from "./MediaEditor";
import SoundProgressBar from "./SoundProgressBar";
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
  MainVoiceOver,
  MainStudio,
  SettingsButton,
  Option,
  Select,
  SettingsTray,
  VideoStudio,
  VoiceOverScroller,
  MainLogo,
  LogoInput,
  OptionHeader,
  SceneContainer,
  SceneScroller,
  SoundPlayer,
  SoundTimer,
  ReplaceButton,
  PictoryButton,
  VoiceOverTitle,
} from "@/app/styles/Editor/Studio/index.styles";
import {
  DivContainer,
  PositionContainer,
} from "@/app/styles/shared/Container.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { timeFormatter } from "@/app/utils/transformer";
import { StatusButton } from "@/app/styles/Editor/MediaTray/AIGeneratedVideo.styles";
import {
  IScene,
  IStringResponse,
  IVideoGenerationResponse,
} from "@/api/interfaces/video";

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
    videoGeneration: {
      assets: { aiIcon },
    },
  } = screens;

  const {
    brandLogoURLState,
    setBrandLogoURLState,
    minimumVideoDurationState,
    socketState,
    updateMessageState,
  } = useAppStore();
  const {
    generatingNewScenes,
    setGeneratingNewScenes,
    generatedVideoState,
    replaceBgState,
    setReplaceBgState,
    voiceoverTrackState,
    setVoiceoverTrackState,
    selectedVoiceOverTrackState,
    updatedGeneratedVideoState,
    tabMenuState,
    deleteLastTabMenuState,
    updateTabMenuState,
    videoMetadataState,
  } = useEditorStore();
  const {
    audioRefState,
    detectedChangeInTextLine,
    editTagToolActivatedState,
    loadingState,
    setLoadingState,
    audioState,
    outputState,
    sceneState,
    setStoryboardState,
    selectedSceneIndex,
    setEditTagToolActivatedState,
    textEditorActivatedState,
    toggleTextEditorActivatedState,
    setCachedSSMLTagState,
    setSelectedTextLineTagState,
    trimActivatedState,
    setTrimActivatedState,
    updateSceneBackgroundUrlState,
    setVoiceoverAudioRefState,
  } = useStoryboardEditorStore();
  const { futureStates, pastStates, redo, undo } =
    useStoryboardEditorStore.temporal.getState();

  const voiceoverRefCallback = useCallback((node: HTMLAudioElement) => {
    setVoiceoverAudioRefState(node);
  }, []);

  const brandLogoRef = useRef<HTMLImageElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const mainSceneRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [audioCurrentTimeState, setAudioCurrentTimeState] = useState(0);
  const [audioIsPlayingState, setAudioIsPlayingState] = useState(false);
  const [logoInputPosition, setLogoInputPosition] = useState({
    xPosition: 0,
    yPosition: 0,
  });
  const [formState, setFormState] = useState({ input_logo: brandLogoURLState });
  const [jobIdState, setJobIdState] = useState("");
  const [loadedBrandLogoImageState, setLoadedBrandLogoImageState] =
    useState(true);
  const [showBrandLogoInputState, setShowBrandLogoInputState] = useState(false);
  const [showSelectState, setShowSelectState] = useState(false);
  const [statusLoadingState, setStatusLoadingState] = useState(false);

  const generatedVideoJobIds = Object.getOwnPropertyNames(generatedVideoState);

  // socket events
  const { join_video_generation_room, join_video_render_room } = emitEvents;
  const {
    join_video_generation_room_success,
    join_video_render_room_success,
    video_generation_success,
  } = onEvents;

  const voiceoverTrackLanguages =
    Object.getOwnPropertyNames(voiceoverTrackState);

  const toggleBrandLogoInputState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    console.log(e);

    if (showBrandLogoInputState == false) {
      const { clientX: mouseXPosition, clientY: mouseYPosition } = e;
      const { clientHeight: buttonHeight, clientWidth: buttonWidth } =
        e.currentTarget;
      const { left: buttonXPosition, top: buttonYPosition } =
        e.currentTarget.getBoundingClientRect();

      console.log(e.currentTarget.getBoundingClientRect());

      // Logo Input constructed Position relative to h:100vh; w:100vw
      const xPosition = buttonXPosition + 0.5 * buttonWidth;
      const yPosition = buttonYPosition + buttonHeight + 15; // similar to calc(100% + 15px)

      setLogoInputPosition({
        xPosition: xPosition,
        yPosition,
      });
    }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "input_logo" && value.length > 0) {
      setLoadedBrandLogoImageState(true);
    }

    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSoundPlayerClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (audioIsPlayingState) {
      audioRefState?.pause();
    } else {
      if (audioRefState?.readyState == 4) {
        audioRefState?.play();
      }
    }
  };

  const handleEditTextClick = (
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

    toggleTextEditorActivatedState();
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

  const handlePictoryButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (detectedChangeInTextLine) {
      // re-generate scenes
      setGeneratingNewScenes(true);

      setLoadingState(true);

      console.log({
        generateVideoPayload: {
          brandLogoHorizontalAlignment: "right",
          brandLogoURL: formState.input_logo,
          brandLogoVerticalAlignment: "top",
          minimumDuration: minimumVideoDurationState,
          text: sceneState
            .map((scene): string => {
              return scene.sub_scenes
                .map((sub_scene): string => {
                  return sub_scene.text_lines
                    .map((text_line) => text_line.text)
                    .join(" ");
                })
                .join("");
            })
            .join(),
          videoDescription: outputState.description,
          videoName: outputState.name,
        },
      });

      const { id, language } = selectedVoiceOverTrackState;

      const { data, error, success } = await generateVideo({
        brandLogoHorizontalAlignment: "right",
        brandLogoURL: formState.input_logo,
        brandLogoVerticalAlignment: "top",
        minimumDuration: minimumVideoDurationState,
        speaker: voiceoverTrackState[language][id].name,
        text: sceneState
          .map((scene): string => {
            return scene.sub_scenes
              .map((sub_scene): string => {
                return sub_scene.text_lines
                  .map((text_line) => text_line.text)
                  .join(" ");
              })
              .join("");
          })
          .join(),
        videoDescription: outputState.description,
        videoName: outputState.name,
      });

      setLoadingState(false);

      if (!success) {
        setGeneratingNewScenes(false);

        updateMessageState({ message: error, success });

        return;
      }

      socketState.emit(join_video_generation_room, { jobId: data });
    } else {
      // commence final video rendering
      const { audio_id: audioId, src: audioSrc, tts } = audioState;

      const {
        description: videoDescription,
        name: videoName,
        title: videoTitle,
      } = outputState;

      const scenes: IScene[] = sceneState.map((scene) => {
        const time =
          videoMetadataState[scene.background.src[0].url]?.duration ||
          scene.time;

        return {
          ...scene,
          background: {
            ...scene.background,
            // time: time,
          },
          sub_scenes: scene.sub_scenes.map((sub_scene) => ({
            ...sub_scene,
            time,
          })),
          time: time,
          subtitle: true,
          subtitles: scene.subtitles.map((subtitle, index) => ({
            ...subtitle,
            text: scene.sub_scenes[index].text_lines[index].text,
          })),
        };
      });

      console.log("Editor > index.tsx > getDownloadableVideo");
      console.log({
        audioSettings: {
          audioId: Number(audioId),
          audioSrc,
          tts: tts || "",
        },
        outputSettings: {
          videoDescription,
          videoName,
          videoTitle,
        },
        scenes: scenes,
      });

      setLoadingState(true);

      const {
        data: jobId,
        error,
        success,
      } = await getDownloadableVideo({
        audioSettings: {
          audioId: Number(audioId),
          audioSrc,
          tts: tts || "",
        },
        outputSettings: {
          videoDescription,
          videoName,
          videoTitle,
        },
        scenes: scenes,
      });

      console.log({ jobId, error, success });

      setLoadingState(false);

      if (!success) {
        updateMessageState({ message: error, success });
        return;
      }

      updatedGeneratedVideoState(jobId, {
        audioURL: "",
        processing: true,
        srtFile: "",
        status: "in-progress",
        thumbnail: "",
        txtFile: "",
        videoDuration: 0,
        videoName: videoTitle,
        videoURL: "",
        vttFile: "",
      });

      socketState.emit(join_video_render_room, { jobId });
    }
  };

  const handleStatusButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setStatusLoadingState(true);

    const { data, error, success } = await monitorVideoStatus(jobIdState);

    setStatusLoadingState(false);

    if (!success) {
      updateMessageState({ message: error, success });
      return;
    }

    if (data.status == "in-progress") {
      updateMessageState({ message: "Your video is processing!", success });
      return;
    }

    if (data.renderParams) {
      const { audio, output, scenes } = data.renderParams;

      setStoryboardState({
        audioState: audio,
        cachedSSMLTagState: null,
        detectedChangeInTextLine: false,
        editTagToolActivatedState: false,
        loadingState: false,
        outputState: output,
        sceneState: scenes,
        selectedSceneIndex: null,
        selectedTextLineTagState: null,
        textEditorActivatedState: false,
        trimActivatedState: false,
        trimmedBackgroundVideoState: {},
        trimmedThumbnailState: {},
      });

      setGeneratingNewScenes(false);
    }
  };

  useEffect(() => {
    const errorEventListener = (e: Event) => {
      updateMessageState({
        message: "Could not load brand logo",
        success: false,
      });

      setLoadedBrandLogoImageState(false);
    };

    if (brandLogoRef.current) {
      brandLogoRef.current.addEventListener("error", errorEventListener);
    }

    getVoiceOverTracks()
      .then((res) => {
        const { data, error, success } = res;

        if (success) {
          setVoiceoverTrackState(
            data
              .filter((item) => item.category !== "premium")
              .map((voiceover) => ({
                ...voiceover,
              }))
          );
        }
      })
      .catch((err) => console.log(err));

    const onJoinVideoGenerationRoomSuccessListener = ({
      data,
      error,
      success,
    }: IStringResponse) => {
      setJobIdState(data);

      updateMessageState({ message: "Your video is processing!", success });
    };

    socketState.on(
      join_video_generation_room_success,
      onJoinVideoGenerationRoomSuccessListener
    );

    const onVideoGenerationSuccessListener = (
      payload: IVideoGenerationResponse
    ) => {
      const { data, error, success } = payload;

      if (!success) {
        updateMessageState({ message: error, success: false });
        return;
      }

      const { audio, output, scenes } = data.renderParams;

      setGeneratingNewScenes(false);

      setStoryboardState({
        audioState: audio,
        cachedSSMLTagState: null,
        detectedChangeInTextLine: false,
        editTagToolActivatedState: false,
        loadingState: false,
        outputState: output,
        sceneState: scenes,
        selectedSceneIndex: null,
        selectedTextLineTagState: null,
        textEditorActivatedState: false,
        trimActivatedState: false,
        trimmedBackgroundVideoState: {},
        trimmedThumbnailState: {},
      });
    };

    socketState.on(video_generation_success, onVideoGenerationSuccessListener);

    const onJoinVideoRenderRoomSuccessListener = ({
      data,
      error,
      success,
    }: IStringResponse) => {
      console.log(join_video_render_room_success);
      console.log({ data, error, success });
      console.log(new Date());

      updateMessageState({
        message: "Your final video is processing. Please wait",
        success,
      });
    };

    socketState.on(
      join_video_render_room_success,
      onJoinVideoRenderRoomSuccessListener
    );

    // clean up function
    return () => {
      console.log("clean up getting called");
      brandLogoRef.current?.removeEventListener("error", errorEventListener);

      socketState.off(
        join_video_generation_room_success,
        onJoinVideoGenerationRoomSuccessListener
      );

      socketState.off(
        video_generation_success,
        onVideoGenerationSuccessListener
      );

      socketState.off(
        join_video_render_room_success,
        onJoinVideoRenderRoomSuccessListener
      );
    };
  }, []);

  useEffect(() => {
    if (generatedVideoJobIds.length > 0 && tabMenuState.length < 3) {
      console.log({ generatedVideoJobIds, tabMenuState });
      updateTabMenuState("AI Video");
    }
    if (generatedVideoJobIds.length == 0 && tabMenuState.length == 3) {
      deleteLastTabMenuState();
    }
  }, [generatedVideoJobIds]);

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
    if (sceneState.length == 0) {
      router.push("/");
    }
  }, [sceneState]);

  useEffect(() => {
    if (mainSceneRef.current) {
      if (trimActivatedState) {
        mainSceneRef.current.scrollTo({
          behavior: "smooth",
          top: trimActivatedState ? mainSceneRef.current.clientHeight : 0,
        });
      } else {
        mainSceneRef.current.scrollTo({
          behavior: "smooth",
          top: 0,
        });
      }
    }
  }, [trimActivatedState]);

  useEffect(() => {
    if (mainSceneRef.current) {
      console.log({ editTagToolActivatedState });
      if (editTagToolActivatedState) {
        console.log({ editTagToolActivatedState });
        console.log({
          behavior: "smooth",
          top: editTagToolActivatedState
            ? mainSceneRef.current.clientHeight * 2
            : 0,
        });
        mainSceneRef.current.scrollTo({
          behavior: "smooth",
          top: editTagToolActivatedState
            ? mainSceneRef.current.clientHeight * 2
            : 0,
        });
      } else {
        mainSceneRef.current.scrollTo({
          behavior: "smooth",
          top: 0,
        });

        setCachedSSMLTagState(null);

        setSelectedTextLineTagState(null);
      }
    }
  }, [editTagToolActivatedState]);

  useEffect(() => {
    if (!textEditorActivatedState) {
      setEditTagToolActivatedState(false);
    }
  }, [textEditorActivatedState]);

  useEffect(() => {
    if (!loadedBrandLogoImageState && !showBrandLogoInputState) {
      setShowBrandLogoInputState(true);
    }
  }, [loadedBrandLogoImageState]);

  useEffect(() => {
    if (!showBrandLogoInputState && formState.input_logo.length > 0) {
      setBrandLogoURLState(formState.input_logo);
    }

    if (showBrandLogoInputState && logoInputRef.current) {
      console.log({ logoInputPosition });
      const { xPosition, yPosition } = logoInputPosition;
      logoInputRef.current.style.left = `${
        xPosition - logoInputRef.current.clientWidth * 0.5
      }px`;
      logoInputRef.current.style.top = `${yPosition}px`;
    }
  }, [showBrandLogoInputState]);

  return (
    <MainStudio>
      <VideoStudio>
        <SettingsTray>
          <DivContainer
            $flexDirection="row"
            $flexWrap="nowrap"
            $height="100%"
            $justifyContent="flex-start"
            $width="fit-content"
          >
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
                  src={brandLogoURLState || undefined}
                  $size="32px"
                  ref={brandLogoRef}
                />
                Brand Logo
              </SettingsButton>
              {showBrandLogoInputState ? (
                <PositionContainer
                  $height="100%"
                  $width="100%"
                  $position="fixed"
                  onClick={() => setShowBrandLogoInputState(false)}
                >
                  <LogoInput
                    ref={logoInputRef}
                    name="input_logo"
                    value={formState.input_logo}
                    $loadFailed={!loadedBrandLogoImageState}
                    onChange={handleInputChange}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </PositionContainer>
              ) : (
                <></>
              )}
            </MainLogo>
            <SettingsButton onClick={handleEditTextClick}>
              <CustomImage src={editIcon.src} $size="24px" />
              {textEditorActivatedState ? "Edit Scene" : "Edit Text"}
            </SettingsButton>
            {voiceoverTrackLanguages.length > 0 ? (
              <Select
                $selected={selectedVoiceOverTrackState.language.length > 0}
                onClick={toggleShowSelectState}
              >
                <CustomImage src={speakIcon.src} $size="24px" />
                {selectedVoiceOverTrackState.language.length > 0
                  ? voiceoverTrackState[selectedVoiceOverTrackState.language][
                      selectedVoiceOverTrackState.id
                    ].name
                  : "AI Voices"}
                <audio
                  src={
                    selectedVoiceOverTrackState.language.length > 0
                      ? voiceoverTrackState[
                          selectedVoiceOverTrackState.language
                        ][selectedVoiceOverTrackState.id].sample || undefined
                      : undefined
                  }
                  ref={voiceoverRefCallback}
                />
              </Select>
            ) : (
              <></>
            )}
            <ReplaceButton onClick={handleReplaceBackgroundClick}>
              {replaceBgState.activated ? "Save " : "Replace Bg"}
            </ReplaceButton>
            {generatingNewScenes ? (
              statusLoadingState ? (
                <CustomImage src={loaderTwoIcon.src} $size="80px" />
              ) : (
                <StatusButton onClick={handleStatusButton}>
                  Check Video Status
                </StatusButton>
              )
            ) : (
              <PictoryButton onClick={handlePictoryButtonClick}>
                {detectedChangeInTextLine
                  ? "Preview Changes"
                  : "Final Video Rendering"}
                <CustomImage src={aiIcon.src} alt="ai-icon" $size="32px" />
              </PictoryButton>
            )}
          </DivContainer>
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
          {editTagToolActivatedState ? <EditTagTool /> : <></>}
        </DivContainer>
      </MainScene>
      {showSelectState ? (
        <PositionContainer
          $justifyContent="center"
          $position="fixed"
          $height="100%"
          $width="100%"
          onClick={toggleShowSelectState}
        >
          <MainVoiceOver>
            <VoiceOverTitle>
              <h4>AI Voices</h4>
            </VoiceOverTitle>
            <VoiceOverScroller>
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
            </VoiceOverScroller>
          </MainVoiceOver>
        </PositionContainer>
      ) : (
        <></>
      )}
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
