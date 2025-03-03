"use client";
import React, { useEffect, useState } from "react";
// components
import DarkOverlay from "@/app/components/shared/DarkOverlay";
// screens
import { IVideoMeta } from "@/app/screens/interface";
// store
import {
  useAppStore,
  useEditorStore,
  useStoryboardEditorStore,
} from "@/app/store";
// styles
import { MainMedia } from "@/app/styles/Editor/MediaTray/UploadMedia.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { extractImageFromVideo } from "@/app/utils/ffmpeg";
import { timeFormatter } from "@/app/utils/transformer";
import { SceneThumbnail } from "@/app/styles/Editor/Studio/Scene/index.styles";

interface IProps {
  index: number;
}

const Scene = (props: IProps) => {
  const { index } = props;

  const {
    default: {
      assets: { loaderTwoIcon },
    },
  } = screens;

  const { ffmpegState } = useAppStore();
  const {
    thumbnailState,
    updateThumbnailState,
    videoMetadataState,
    updateVideoMetadataState,
  } = useEditorStore();
  const {
    sceneState,
    selectedSceneIndex,
    setSelectedSceneIndex,
    trimmedBackgroundVideoState,
  } = useStoryboardEditorStore();

  const [loadingState, setLoadingState] = useState(false);
  const [metadataState, setMetadataState] = useState<IVideoMeta>({
    duration: 0,
    name: "",
    initialDuration: 0,
    videoHeight: 0,
    videoWidth: 0,
  });
  const [localThumbnailState, setLocalThumbnailState] = useState("");

  const {
    background: {
      src: [src],
    },
    sub_scenes,
    time,
  } = sceneState[index];

  const isVideo = src.type == "video";
  const path = src.url;

  const trimmedBackgroundUrlKey = `${index}-${path}`;

  const handleLoadedMetaData = ({
    currentTarget,
  }: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (videoMetadataState[path]) {
      updateVideoMetadataState(path, {
        ...videoMetadataState[path],
        name: path,
        duration: currentTarget.duration,
        videoHeight: currentTarget.videoHeight,
        videoWidth: currentTarget.videoWidth,
      });
    } else {
      updateVideoMetadataState(path, {
        name: path,
        duration: currentTarget.duration,
        initialDuration: currentTarget.duration,
        videoHeight: currentTarget.videoHeight,
        videoWidth: currentTarget.videoWidth,
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setSelectedSceneIndex(index);
  };

  useEffect(() => {
    if (isVideo) {
      setLoadingState(true);
      if (ffmpegState && ffmpegState.loaded) {
        extractImageFromVideo(ffmpegState, path, 0)
          .then((res) => {
            const { data, error, success } = res;

            if (success) {
              // setLocalThumbnailState(data);
              updateThumbnailState(path, data);
            }
          })
          .catch((err) => console.log(err));
      }
    } else {
      setLocalThumbnailState(path);
    }
  }, [ffmpegState, path]);

  useEffect(() => {
    if (isVideo) {
      if (metadataState.duration > 0 && localThumbnailState.length > 0) {
        setLoadingState(false);
      }
    } else {
      setLoadingState(false);
    }
  }, [metadataState, localThumbnailState]);

  useEffect(() => {
    if (isVideo) {
      if (thumbnailState[path] == undefined) {
        setLocalThumbnailState("");
      } else {
        setLocalThumbnailState(thumbnailState[path]);
      }
    }
  }, [thumbnailState]);

  useEffect(() => {
    if (isVideo) {
      if (videoMetadataState[path] == undefined) {
        setMetadataState({
          duration: 0,
          name: "",
          initialDuration: 0,
          videoHeight: 0,
          videoWidth: 0,
        });
      } else {
        setMetadataState(videoMetadataState[path]);
      }
    }
  }, [videoMetadataState]);

  return (
    <SceneThumbnail
      $selected={index === selectedSceneIndex}
      onClick={handleClick}
    >
      <MainMedia $bgImg={localThumbnailState}>
        {isVideo ? (
          <video
            src={
              trimmedBackgroundVideoState[trimmedBackgroundUrlKey]
                ? trimmedBackgroundVideoState[trimmedBackgroundUrlKey].video
                : path
            }
            onLoadedMetadata={handleLoadedMetaData}
          ></video>
        ) : (
          <></>
        )}
        {metadataState.duration ? (
          <span>{timeFormatter(metadataState.duration)}</span>
        ) : (
          <></>
        )}
        {loadingState ? (
          <DarkOverlay>
            <CustomImage
              src={loaderTwoIcon.src}
              alt="loader-icon"
              $size="80px"
            />
          </DarkOverlay>
        ) : (
          <></>
        )}
      </MainMedia>
    </SceneThumbnail>
  );
};

export default Scene;
