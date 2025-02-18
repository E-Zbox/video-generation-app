"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
// api
import {
  IStringResponse,
  IVideoGeneration,
  IVideoGenerationResponse,
} from "@/api/interface";
import { expandText, generateVideo } from "@/api/rest";
import { emitEvents, onEvents } from "@/api/socket";
// components
import AIGeneratedCard from "../components/AIGeneratedCard";
import TextInput from "../components/TextInput";
import VideoControl from "../components/VideoControl";
// store
import { useAppStore } from "../store";
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
  MainVideo,
  VideoControls,
  ProgressBar,
  MainTimer,
} from "../styles/VideoGenerationScreen.styles";
import { DivContainer } from "../styles/shared/Container.styles";
import { CustomImage } from "../styles/shared/Image.styles";
// utils
import { screens, theme } from "../utils/data";
import { timeFormatter } from "../utils/transformer";

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
      assets: { loaderIcon },
    },
    videoGeneration: {
      assets: {
        aiIcon,
        videoJS: {
          fullscreenEnter,
          fullscreenExit,
          pause,
          play,
          volumeHigh,
          volumeLow,
          volumeMid,
          volumeMute,
        },
      },
      data: { aiGeneration, videoSrc },
    },
  } = screens;

  const { updateErrorState, navbarHeightState, socketState } = useAppStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const expandTextScrollerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [aiGeneratedTextState, setAIGeneratedTextState] =
    useState<IAIGeneratedText>({
      loading: false,
      value: [],
    });
  const [audioMutedState, setAudioMutedState] = useState(false);
  const [formState, setFormState] = useState({
    input_brand_logo_url: "",
    input_minimum_duration: "",
    input_text: "",
    input_video_description: "",
    input_video_name: "",
  });
  const [hideTextLabelState, setHideTextLabelState] = useState(false);
  const [selectedTabMenuState, setSelectedTabMenuState] = useState(0);
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
  const [videoCurrentTimeState, setVideoCurrentTimeState] = useState(0);
  const [videoDurationState, setVideoDurationState] = useState(0);
  const [videoFullscreenState, setVideoFullscreenState] = useState(false);
  const [videoIsPlayingState, setVideoIsPlayingState] = useState(false);
  const [videoMouseOverState, setVideoMouseOverState] = useState(false);
  const [videoPlayIdState, setVideoPlayIdState] = useState(0);
  const [videoState, setVideoState] = useState<IGeneratedVideo>({
    loading: false,
    value: {
      audio: "",
      videos: [],
    },
  });
  const [videoWatchedTimeState, setVideoWatchedTimeState] = useState(0);

  const { purple01, purple02 } = theme;

  const { join_room } = emitEvents;

  const { join_room_success, video_generation_success } = onEvents;

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
      updateErrorState({
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
      updateErrorState({ message: error, success: false });
      return;
    }

    setAIGeneratedTextState((prevState) => {
      const storedValues = [...prevState.value];

      console.log({ storedValues });

      storedValues.push(data);

      console.log({ updatedStoredValues: storedValues });

      return { loading: false, value: storedValues };
    });

    updateErrorState({
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
      updateErrorState({
        message: "Write a story to continue!",
        success: false,
      });
      return;
    }

    if (brandLogoURL.length == 0) {
      updateErrorState({
        message: "Brand Logo field is missing!",
        success: false,
      });
      return;
    }

    if (minimumDuration.length == 0) {
      updateErrorState({
        message: "Minimum duration field is missing!",
        success: false,
      });
      return;
    }

    if (videoDescription.length == 0) {
      updateErrorState({
        message: "Brand Logo field is missing!",
        success: false,
      });
      return;
    }

    if (videoName.length == 0) {
      updateErrorState({
        message: "Brand Logo field is missing!",
        success: false,
      });
      return;
    }

    setVideoState((prevState) => ({ ...prevState, loading: true }));

    const { data, error, success } = await generateVideo({
      brandLogoURL,
      minimumDuration: Number(minimumDuration),
      text,
      videoDescription,
      videoName,
    });

    console.log({ data, error, success });

    if (!success) {
      updateErrorState({ message: error, success });
      setVideoState((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    socketState.emit(join_room, { jobId: data });
  };

  const toggleFullScreen = async () => {
    /*
    const videoElement = videoRef.current;

    if (videoElement) {
      if (!document.fullscreenElement) {
        await videoElement.requestFullscreen();
      } else {
        await document.exitFullscreen()
      }
    }
    */
    setVideoFullscreenState((prevState) => !prevState);
  };

  const toggleAudio = () => {
    setAudioMutedState((prevState) => !prevState);
  };

  const togglePlay = async () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      if (videoIsPlayingState) {
        videoElement.pause();
      } else {
        await videoElement.play();
      }
    }
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
    socketState.on("connect", () => {
      socketState.on(join_room_success, (payload: IStringResponse) => {
        const { data, error, success } = payload;

        if (!success) {
          updateErrorState({ message: error, success: false });
          return;
        }

        console.log({ data });

        // your video is processing
        updateErrorState({
          message: "Your video is processing!",
          success: true,
        });
      });

      socketState.on(
        video_generation_success,
        (payload: IVideoGenerationResponse) => {
          const { data, error, success } = payload;

          if (!success) {
            updateErrorState({ message: error, success: false });
            return;
          }

          // update a particular state that will trigger render video element
          console.log(video_generation_success);
          console.log(data);

          setVideoState({
            loading: false,
            value: {
              audio: data.renderParams.audio.tts,
              videos: data.renderParams.scenes.map(
                ({ background: { src }, time }) => ({ src: src[0].url, time })
              ),
            },
          });
        }
      );
    });
  }, [socketState]);

  useEffect(() => {
    if (audioRef.current && videoRef.current && videoDurationState > 0) {
      const audioElement = audioRef.current;
      const videoElement = videoRef.current;

      // audioElement.addEventListener("volumechange", () => {
      //   if (!audioElement.muted) {
      //     videoElement.volume = audioElement.volume;
      //   }
      // });

      videoElement.addEventListener("ended", (e) => {
        console.log("ended");

        if (videoPlayIdState < videoState.value.videos.length - 1) {
          setVideoPlayIdState((prevState) => prevState + 1);
        }
      });

      videoElement.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
          setVideoFullscreenState(false);
          console.log({
            bodyScrollHeight: document.body.scrollHeight,
            bodyScrollTop: document.body.scrollTop,
          });
          videoRef.current?.scrollIntoView();
        } else {
          setVideoFullscreenState(true);
        }
      });

      videoElement.addEventListener("loadstart", (e) => {
        console.log("video is loading");
        audioElement.pause();
      });

      videoElement.addEventListener("pause", (e) => {
        console.log("paused video");
        audioElement.pause();
        setVideoIsPlayingState(false);
      });

      videoElement.addEventListener("play", async (e) => {
        console.log("video started playing");
        await audioElement.play();
        setVideoIsPlayingState(true);
      });

      videoElement.addEventListener("timeupdate", () => {
        const currentTime = videoElement.currentTime;

        const progressBarWidth =
          videoDurationState > currentTime
            ? (currentTime / videoDurationState) * 100
            : 0;

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${progressBarWidth}%`;
          setVideoCurrentTimeState(videoWatchedTimeState + currentTime);
        }
      });

      videoElement.addEventListener("volumechange", () => {
        if (videoElement.muted) {
          setAudioMutedState(videoElement.muted);
        } else {
          // adjust volume accordingly
          const volume = videoElement.volume;

          audioElement.volume = volume;

          setAudioMutedState(false);
        }
      });
    }
  }, [audioRef, videoDurationState, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoState.value.videos[videoPlayIdState].src;

      // we don't want to start playing the video when the screen just loads
      if (videoPlayIdState) {
        videoRef.current?.play().then(() => {});
      }

      // let's preload some video resource in background
      for (
        let index = videoPlayIdState + 1;
        index <= videoPlayIdState + 2;
        index++
      ) {
        if (videoState.value.videos[index]) {
          const video = document.createElement("video");
          video.preload = "auto";
          video.src = videoState.value.videos[index].src;
        } else {
          break;
        }
      }

      // let's update watched time state
      let newWatchedTime = 0;

      for (let index = 0; index < videoPlayIdState + 1; index++) {
        newWatchedTime += videoState.value.videos[index].time;
      }

      setVideoWatchedTimeState(newWatchedTime);
    }
  }, [videoPlayIdState]);

  useEffect(() => {
    if (videoFullscreenState) {
      videoRef.current?.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [videoFullscreenState]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const videoElement = videoRef.current;

    if (audioElement) {
      audioElement.muted = audioMutedState;

      if (videoElement) {
        // videoElement.muted = audioMutedState;
      }
    }
  }, [audioMutedState]);

  useEffect(() => {
    if (videoState.value.videos.length > 0) {
      let totalDuration = 0;

      videoState.value.videos.forEach(({ time }) => {
        totalDuration += time;
      });

      setVideoDurationState(totalDuration);
    }
  }, [videoState]);

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
                  $height="100px"
                  $justifyContent="center"
                  $width="100%"
                >
                  <CustomImage
                    src={loaderIcon.src}
                    alt="loader-icon"
                    $size={"50px"}
                  />
                </DivContainer>
              ) : (
                <FormButton
                  disabled={disableGenerateButton}
                  onClick={handleGenerateVideoSubmit}
                >
                  Generate Video
                  <CustomImage src={aiIcon.src} alt="ai-icon" $size="32px" />
                </FormButton>
              )}
            </DivContainer>
          </Form>
        </MainForm>
        {videoState.loading ? (
          <DivContainer $justifyContent="center" $height="200px"></DivContainer>
        ) : videoState.value.videos.length == 0 ? (
          <></>
        ) : (
          <MainVideo
            onMouseOut={() => setVideoMouseOverState(false)}
            onMouseOver={() => setVideoMouseOverState(true)}
          >
            <video ref={videoRef} onClick={togglePlay} muted={false}>
              <source
                src={videoState.value.videos[videoPlayIdState].src}
                type="video/mp4"
              ></source>
            </video>
            <audio ref={audioRef} controls>
              <source src={videoState.value.audio} type="audio/mpeg"></source>
            </audio>
            <VideoControls $show={videoMouseOverState}>
              <VideoControl
                icon={videoIsPlayingState ? pause : play}
                handleClick={togglePlay}
              />
              <MainTimer>
                <p>{timeFormatter(videoCurrentTimeState)}</p>
                <p>/</p>
                <p>{timeFormatter(videoDurationState)}</p>
              </MainTimer>
              <ProgressBar>
                <div ref={progressBarRef}></div>
              </ProgressBar>
              <VideoControl
                icon={audioMutedState ? volumeMute : volumeHigh}
                handleClick={toggleAudio}
              />
              <VideoControl
                icon={videoFullscreenState ? fullscreenExit : fullscreenEnter}
                handleClick={toggleFullScreen}
              />
            </VideoControls>
          </MainVideo>
        )}
      </DivContainer>
    </MainVideoGeneration>
  );
};

export default VideoGenerationScreen;
