"use client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
// api
import {
  IStringResponse,
  IVideoGeneration,
  IVideoGenerationResponse,
} from "@/api/interfaces/video";
import {
  expandText,
  generateVideo,
  monitorVideoStatus,
} from "@/api/rest/ai-generation";
import { emitEvents, onEvents } from "@/api/socket";
// components
import AIGeneratedCard from "../components/AIGeneratedCard";
import TextInput from "../components/TextInput";
// store
import {
  useAppStore,
  useEditorStore,
  useStoryboardEditorStore,
} from "../store";
// styles
import {
  Form,
  FormButton,
  MainForm,
  MainExpandText,
  MainVideoGeneration,
  Textarea,
  TextareaContainer,
  TextareaH4,
  TextareaLabel,
  ExpandTextScroller,
  MainTab,
  TabText,
  MainAIGenerated,
  AIGeneratedScroller,
} from "../styles/VideoGenerationScreen.styles";
import { DivContainer } from "../styles/shared/Container.styles";
import { CustomImage } from "../styles/shared/Image.styles";
// utils
import { screens, theme } from "../utils/data";
import { StatusButton } from "../styles/Editor/MediaTray/AIGeneratedVideo.styles";

interface IAIGeneratedText {
  loading: boolean;
  value: string[];
}

interface IGeneratedVideo {
  loading: boolean;
  value: {
    audio: string;
    videos: {
      src: string;
      time: number;
    }[];
  };
}

const VideoGenerationScreen = () => {
  const {
    default: {
      assets: { loaderIcon, loaderThreeIcon },
    },
    videoGeneration: {
      assets: { aiIcon },
    },
  } = screens;

  const {
    setBrandLogoURLState,
    editMessageInMessageState,
    updateMessageState,
    setMinimumVideoDurationState,
    navbarHeightState,
    socketState,
  } = useAppStore();
  const { setAiGeneratedScenes } = useEditorStore();
  const { sceneState, setStoryboardState } = useStoryboardEditorStore();

  const expandTextScrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const [aiGeneratedTextState, setAIGeneratedTextState] =
    useState<IAIGeneratedText>({
      loading: false,
      value: [],
    });
  const [formState, setFormState] = useState({
    input_brand_logo_url: "",
    input_minimum_duration: "",
    input_text: "",
    input_video_description: "",
    input_video_name: "",
  });
  const [jobIdState, setJobIdState] = useState("");
  const [showStatusButtonState, setShowStatusButtonState] = useState(false);
  const [hideTextLabelState, setHideTextLabelState] = useState(false);
  const [redirectMessageIdState, setRedirectMessageIdState] = useState("");
  const [redirectTimerState, setRedirectTimerState] = useState(5);
  const [selectedTabMenuState, setSelectedTabMenuState] = useState(0);
  const [statusLoadingState, setStatusLoadingState] = useState(false);
  const [tabMenuState, setTabMenuState] = useState([
    {
      id: 1,
      selected: true,
      text: "Your Story",
    },
    {
      id: 2,
      selected: false,
      text: "AI Generated Story",
    },
  ]);
  const [triggerTimerState, setTriggerTimerState] = useState(false);
  const [videoState, setVideoState] = useState<IGeneratedVideo>({
    loading: false,
    value: {
      audio: "",
      videos: [],
    },
  });

  const { purple01, purple02 } = theme;

  const { join_video_generation_room } = emitEvents;

  const { join_video_generation_room_success, video_generation_success } =
    onEvents;

  let disableGenerateButton = false;

  if (
    formState.input_brand_logo_url.length == 0 ||
    formState.input_minimum_duration.length == 0 ||
    formState.input_text.length == 0 ||
    formState.input_video_description.length == 0 ||
    formState.input_video_name.length == 0
  ) {
    disableGenerateButton = true;
  }
  if (aiGeneratedTextState.loading) {
    disableGenerateButton = true;
  }

  const handleTabClick = (id: number) => {
    setTabMenuState((prevState) =>
      prevState.map((item) => ({ ...item, selected: item.id === id }))
    );
  };

  const handleInputChange = ({ target: { name, value } }: ChangeEvent<any>) => {
    if (name == "input_text" && aiGeneratedTextState.loading) {
      return;
    }
    if (name == "input_text" && value.length > 0) {
      setHideTextLabelState(true);
    }
    if (videoState.loading) {
      return;
    }
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleTextAreaClick = () => {
    setHideTextLabelState(true);
  };

  const handleTextAreaBlur = () => {
    if (formState.input_text.length == 0) {
      setHideTextLabelState(false);
    }
  };

  const handleExpandTextFormSubmit = async () => {
    const { input_text: text } = formState;

    if (text.length == 0) {
      updateMessageState({
        message: "Write a story to continue!",
        success: false,
      });
      return;
    }

    setAIGeneratedTextState((prevState) => ({
      loading: true,
      value: prevState.value,
    }));

    const { data, error, success } = await expandText(text);

    if (!success) {
      setAIGeneratedTextState((prevState) => ({
        loading: false,
        value: prevState.value,
      }));

      updateMessageState({ message: error, success: false });
      return;
    }

    setAIGeneratedTextState((prevState) => {
      const storedValues = [...prevState.value];

      storedValues.push(data);

      return { loading: false, value: storedValues };
    });

    updateMessageState({
      message:
        "Copy paste the most recent AI response in 'Your Story' tab and continue",
      success: true,
    });
  };

  const handleGenerateVideoSubmit = async () => {
    const {
      input_brand_logo_url: brandLogoURL,
      input_minimum_duration: minimumDuration,
      input_text: text,
      input_video_description: videoDescription,
      input_video_name: videoName,
    } = formState;

    if (text.length == 0 && aiGeneratedTextState.value.length == 0) {
      updateMessageState({
        message: "Write a story to continue!",
        success: false,
      });
      return;
    }

    if (brandLogoURL.length == 0) {
      updateMessageState({
        message: "Brand Logo field is missing!",
        success: false,
      });
      return;
    }

    if (minimumDuration.length == 0) {
      updateMessageState({
        message: "Minimum duration field is missing!",
        success: false,
      });
      return;
    }

    if (videoDescription.length == 0) {
      updateMessageState({
        message: "Brand Logo field is missing!",
        success: false,
      });
      return;
    }

    if (videoName.length == 0) {
      updateMessageState({
        message: "Brand Logo field is missing!",
        success: false,
      });
      return;
    }

    setVideoState((prevState) => ({ ...prevState, loading: true }));

    const { data, error, success } = await generateVideo({
      brandLogoHorizontalAlignment: "right",
      brandLogoVerticalAlignment: "top",
      brandLogoURL,
      minimumDuration: Number(minimumDuration),
      text,
      videoDescription,
      videoName,
    });

    if (!success) {
      updateMessageState({ message: error, success });
      return;
    }

    setMinimumVideoDurationState(Number(minimumDuration));

    setBrandLogoURLState(brandLogoURL);

    socketState.emit(join_video_generation_room, { jobId: data });
  };

  const handleStatusButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

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

    // update a particular state that will trigger render video element
    setVideoState({
      loading: false,
      value: {
        audio: data.renderParams.audio.tts!,
        videos: (data as IVideoGeneration).renderParams.scenes.map(
          ({ background: { src }, time }) => ({ src: src[0].url, time })
        ),
      },
    });
  };

  useEffect(() => {
    if (hideTextLabelState) {
      textareaRef.current?.focus();
    }
  }, [hideTextLabelState]);

  useEffect(() => {
    if (
      aiGeneratedTextState.loading == false &&
      aiGeneratedTextState.value.length > 0
    ) {
      handleTabClick(2);
    }
  }, [aiGeneratedTextState]);

  useEffect(() => {
    tabMenuState.forEach(({ selected }, index) => {
      if (selected) {
        setSelectedTabMenuState(index);
      }
    });
  }, [tabMenuState]);

  useEffect(() => {
    if (expandTextScrollerRef.current) {
      const { clientWidth } = expandTextScrollerRef.current;

      expandTextScrollerRef.current.scrollTo({
        behavior: "smooth",
        left: clientWidth * selectedTabMenuState,
      });
    }
  }, [selectedTabMenuState]);

  useEffect(() => {
    // socketState.on("connect", () => {
    const onJoinVideoGenerationRoomSuccessListener = (
      payload: IStringResponse
    ) => {
      const { data, error, success } = payload;

      // setVideoState((prevState) => ({ ...prevState, loading: true }));

      if (!success) {
        updateMessageState({ message: error, success: false });
        return;
      }

      setJobIdState(data);

      setShowStatusButtonState(true);

      // your video is processing
      updateMessageState({
        message: "Your video is processing!",
        success: true,
      });
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
        setVideoState((prevState) => ({ ...prevState, loading: false }));

        updateMessageState({ message: error, success: false });
        return;
      }

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

      // update a particular state that will trigger render video element
      setVideoState({
        loading: false,
        value: {
          audio: data.renderParams.audio.tts!,
          videos: data.renderParams.scenes.map(
            ({ background: { src }, time }) => ({ src: src[0].url, time })
          ),
        },
      });
    };

    socketState.on(video_generation_success, onVideoGenerationSuccessListener);
    // });

    return () => {
      socketState.off(
        join_video_generation_room_success,
        onJoinVideoGenerationRoomSuccessListener
      );

      socketState.off(
        video_generation_success,
        onVideoGenerationSuccessListener
      );
    };
  }, [socketState]);

  useEffect(() => {
    if (videoState.value.videos.length > 0) {
      // let's trigger navigating to /editor page
      setTriggerTimerState(true);
    }

    if (!videoState.loading) {
      setShowStatusButtonState(false);
    }
  }, [videoState]);

  useEffect(() => {
    if (triggerTimerState) {
      const messageId = updateMessageState({
        message: `Navigating you to /editor page to customize video scenes in ${redirectTimerState} seconds!`,
        timeoutInMilliseconds: 5500,
        success: true,
      });

      setRedirectMessageIdState(messageId);

      const intervalId = setInterval(() => {
        setRedirectTimerState((prevState) => prevState - 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [triggerTimerState]);

  useEffect(() => {
    if (redirectMessageIdState) {
      editMessageInMessageState(
        redirectMessageIdState,
        `Navigating you to /editor page to customize video scenes in ${redirectTimerState} seconds!`
      );
    }

    if (redirectTimerState == 0) {
      router.push("/editor");
    }
  }, [redirectMessageIdState, redirectTimerState]);

  useEffect(() => {
    if (sceneState.length > 0) {
      setAiGeneratedScenes(
        sceneState.map((scene) => scene.background.src[0].url)
      );
    }
  }, [sceneState]);

  return (
    <MainVideoGeneration $marginTop={navbarHeightState}>
      <DivContainer $width="100%">
        <MainForm>
          <Form>
            <DivContainer $width="100%">
              <MainExpandText>
                {aiGeneratedTextState.value ? (
                  <MainTab
                    $beforeLeft={`${selectedTabMenuState * 50}%`}
                    $show={aiGeneratedTextState.value.length > 0}
                  >
                    {tabMenuState.map(({ id, selected, text }) => (
                      <TabText
                        key={id}
                        $selected={selected}
                        onClick={() => handleTabClick(id)}
                      >
                        {text}
                      </TabText>
                    ))}
                  </MainTab>
                ) : (
                  <></>
                )}
                <ExpandTextScroller ref={expandTextScrollerRef}>
                  <DivContainer
                    $alignItems="flex-start"
                    $flexDirection="row"
                    $width="fit-content"
                  >
                    <TextareaContainer onClick={handleTextAreaClick}>
                      <Textarea
                        disabled={
                          aiGeneratedTextState.loading || videoState.loading
                        }
                        placeholder="Write your story..."
                        name={"input_text"}
                        ref={textareaRef}
                        value={formState.input_text}
                        onBlur={handleTextAreaBlur}
                        onChange={handleInputChange}
                      />
                      <TextareaLabel $hide={hideTextLabelState}>
                        <TextareaH4>
                          Begin your
                          <TextareaH4 $fontStyle="normal" $fontWeight="bold">
                            AI journey
                          </TextareaH4>
                          with the creation of your own first custom video
                          featuring an
                          <TextareaH4
                            $colorGradient={[purple01, purple02]}
                            $fontStyle="normal"
                            $fontWeight="bolder"
                          >
                            AI-Powered Script!
                          </TextareaH4>
                        </TextareaH4>
                      </TextareaLabel>
                    </TextareaContainer>
                    {aiGeneratedTextState.value.length > 0 ? (
                      <MainAIGenerated>
                        <AIGeneratedScroller>
                          <DivContainer $alignItems="flex-start" $width="100%">
                            {aiGeneratedTextState.value.map((text, index) => (
                              <AIGeneratedCard key={index} text={text} />
                            ))}
                          </DivContainer>
                        </AIGeneratedScroller>
                      </MainAIGenerated>
                    ) : (
                      <></>
                    )}
                  </DivContainer>
                </ExpandTextScroller>
              </MainExpandText>
              {aiGeneratedTextState.loading ? (
                <CustomImage
                  src={loaderIcon.src}
                  alt="loader-icon"
                  $size={"50px"}
                />
              ) : (
                <FormButton
                  disabled={formState.input_text.length == 0}
                  onClick={handleExpandTextFormSubmit}
                >
                  Expand Story
                  <CustomImage src={aiIcon.src} alt="ai-icon" $size="32px" />
                </FormButton>
              )}
            </DivContainer>
            <DivContainer
              $flexDirection="row"
              $flexWrap="wrap"
              $justifyContent="center"
              $width="70%"
              $margin="calc(var(--ten-px) * 2) 0px 0px"
            >
              <TextInput
                disabled={videoState.loading}
                label="Brand Logo URL"
                name="input_brand_logo_url"
                type="text"
                value={formState.input_brand_logo_url}
                handleInputChange={handleInputChange}
              />
              <TextInput
                disabled={videoState.loading}
                label="Minimum Duration (in seconds)"
                min="10"
                name="input_minimum_duration"
                type="number"
                value={formState.input_minimum_duration}
                handleInputChange={handleInputChange}
              />
              <TextInput
                disabled={videoState.loading}
                label="Video Description"
                name="input_video_description"
                type="text"
                value={formState.input_video_description}
                handleInputChange={handleInputChange}
              />
              <TextInput
                disabled={videoState.loading}
                label="Video Name"
                name="input_video_name"
                type="text"
                value={formState.input_video_name}
                handleInputChange={handleInputChange}
              />
              {videoState.loading ? (
                <DivContainer
                  $height="150px"
                  $justifyContent="space-around"
                  $width="100%"
                >
                  <CustomImage
                    src={loaderIcon.src}
                    alt="loader-icon"
                    $size={"50px"}
                  />
                  {showStatusButtonState ? (
                    statusLoadingState ? (
                      <CustomImage src={loaderThreeIcon.src} $size={"32px"} />
                    ) : (
                      <StatusButton onClick={handleStatusButton}>
                        Status
                      </StatusButton>
                    )
                  ) : (
                    <></>
                  )}
                </DivContainer>
              ) : (
                <>
                  <FormButton
                    disabled={disableGenerateButton}
                    onClick={handleGenerateVideoSubmit}
                  >
                    Generate Video
                    <CustomImage src={aiIcon.src} alt="ai-icon" $size="32px" />
                  </FormButton>
                </>
              )}
            </DivContainer>
          </Form>
        </MainForm>
      </DivContainer>
    </MainVideoGeneration>
  );
};

export default VideoGenerationScreen;
