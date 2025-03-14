"use client";
import React, { useEffect, useState } from "react";
// api
import { onEvents } from "@/api/socket";
// components
import DarkOverlay from "../../shared/DarkOverlay";
// store
import { useAppStore, useEditorStore } from "@/app/store";
// styles
import {
  DownloadFile,
  MainAIGeneratedVideo,
  NonVideoThumbnail,
  OtherDownloads,
  ProcessingText,
  StatusButton,
  VideoNameText,
  VideoThumbnail,
} from "@/app/styles/Editor/MediaTray/AIGeneratedVideo.styles";
import { DivContainer } from "@/app/styles/shared/Container.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { download } from "@/app/utils/transformer";
import { IJobIdResponse, IVideoRenderResponse } from "@/api/interfaces/video";
import { monitorVideoStatus } from "@/api/rest/ai-generation";

interface IProps {
  jobId: string;
}

const DownloadIcon = () => {
  const {
    videoGeneration: {
      assets: { brownIcon },
    },
  } = screens;

  return <CustomImage src={brownIcon.src} $size="16px" />;
};

const AIGeneratedVideo = (props: IProps) => {
  const { jobId } = props;

  const {
    default: {
      assets: { loaderThreeIcon },
    },
    videoGeneration: {
      assets: { brownIcon, purpleIcon },
    },
  } = screens;

  const { socketState } = useAppStore();

  const { updateMessageState } = useAppStore();
  const {
    selectTabMenuState,
    deleteGeneratedVideoState,
    generatedVideoState,
    updatedGeneratedVideoState,
  } = useEditorStore();

  const [loadingState, setLoadingState] = useState(false);

  const {
    audioURL,
    processing,
    srtFile,
    status,
    thumbnail,
    txtFile,
    videoDuration,
    videoName,
    videoURL,
    vttFile,
  } = generatedVideoState[jobId];

  const generatedVideoJobIds = Object.getOwnPropertyNames(generatedVideoState);

  // socket
  const { video_render_failed, video_render_success } = onEvents;

  const handleStatusClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoadingState(true);

    const { data, error, success } = await monitorVideoStatus(jobId);

    setLoadingState(false);

    console.log({ jobId });

    if (!success) {
      updateMessageState({ message: error, success });

      if (error.includes("Something went wrong")) {
        deleteGeneratedVideoState(jobId);

        if (generatedVideoJobIds.length == 1) {
          selectTabMenuState(0);
        }
      }
      return;
    }
    console.log("socketState.listeners(video_render_success)");
    console.log(socketState.listeners(video_render_success));

    if (data.status == "in-progress") {
      updateMessageState({ message: "Your video is processing!", success });
      return;
    }

    updatedGeneratedVideoState(jobId, {
      ...data,
      processing: false,
      videoName,
    });
  };

  useEffect(() => {
    const onVideoRenderFailedListener = ({ data }: IJobIdResponse) => {
      if (jobId === data.jobId) {
        updateMessageState({
          message: "Video processing failed. Try again!",
          success: false,
        });
        deleteGeneratedVideoState(jobId);

        if (generatedVideoJobIds.length == 1) {
          selectTabMenuState(0);
        }
        return;
      }
    };

    socketState.on(video_render_failed, onVideoRenderFailedListener);

    const onVideoRenderSuccessListener = ({ data }: IVideoRenderResponse) => {
      console.log({ data });
      if (jobId === data.jobId) {
        updatedGeneratedVideoState(jobId, {
          ...data,
          processing: false,
          videoName,
        });
      }
    };
    socketState.on(video_render_success, onVideoRenderSuccessListener);

    return () => {
      socketState.off(video_render_failed, onVideoRenderFailedListener);

      socketState.off(video_render_success, onVideoRenderSuccessListener);
    };
  }, []);

  return (
    <MainAIGeneratedVideo>
      <VideoThumbnail $bgImg={thumbnail}>
        {!processing ? (
          <DarkOverlay>
            <CustomImage
              src={purpleIcon.src}
              $hover={true}
              $size="50px"
              onClick={() => download(videoURL)}
            />
          </DarkOverlay>
        ) : (
          <></>
        )}
      </VideoThumbnail>
      <NonVideoThumbnail>
        {processing ? (
          <>
            <ProcessingText>Processing...</ProcessingText>
            {loadingState ? (
              <CustomImage src={loaderThreeIcon.src} $size={"32px"} />
            ) : (
              <StatusButton onClick={handleStatusClick}>Status</StatusButton>
            )}
          </>
        ) : (
          <>
            <VideoNameText>{videoName}</VideoNameText>
            <OtherDownloads>
              <DivContainer $flexDirection="row" $width="fit-content">
                <DownloadFile onClick={() => download(audioURL)}>
                  Audio
                  <DownloadIcon />
                </DownloadFile>
                <DownloadFile onClick={() => download(thumbnail)}>
                  Thumbnail
                  <DownloadIcon />
                </DownloadFile>
                <DownloadFile onClick={() => download(srtFile)}>
                  SRT File
                  <DownloadIcon />
                </DownloadFile>
                <DownloadFile onClick={() => download(txtFile)}>
                  TXT File
                  <DownloadIcon />
                </DownloadFile>
                <DownloadFile onClick={() => download(vttFile)}>
                  VTT File
                  <DownloadIcon />
                </DownloadFile>
              </DivContainer>
            </OtherDownloads>
          </>
        )}
      </NonVideoThumbnail>
    </MainAIGeneratedVideo>
  );
};

export default AIGeneratedVideo;
