"use client";
import React, { useEffect, useState } from "react";
// api
import { deleteMedia } from "@/api/rest/media";
// components
import DarkOverlay from "../../shared/DarkOverlay";
// screens
import { IVideoMeta } from "@/app/screens/interface";
// store
import { useAppStore, useEditorStore } from "@/app/store";
// styles
import { MainMedia } from "@/app/styles/Editor/MediaTray/UploadMedia.styles";
import { PositionContainer } from "@/app/styles/shared/Container.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { extractImageFromVideo } from "@/app/utils/ffmpeg";
import { timeFormatter } from "@/app/utils/transformer";

interface IProps {
  _id: string;
}

const UploadedMedia = (props: IProps) => {
  const { _id } = props;

  const {
    default: {
      assets: { checkIcon, loaderTwoIcon },
    },
    videoEditor: {
      acceptedMimeTypes,
      assets: { trashIcon },
    },
  } = screens;

  const { ffmpegState, updateMessageState } = useAppStore();

  const {
    replaceBgState,
    setReplaceBgState,
    uploadedMediaState,
    removeFromUploadedMediaState,
    selectedUploadedMediaIdState,
    setSelectedUploadedMediaIdState,
  } = useEditorStore();

  const { mimetype, path } = uploadedMediaState[_id];

  const [deletedMediaState, setDeletedMediaState] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [metadataState, setMetadataState] = useState<IVideoMeta>({
    duration: 0,
    name: "",
    initialDuration: 0,
    videoHeight: 0,
    videoWidth: 0,
  });
  const [thumbnailState, setThumbnailState] = useState("");

  const isVideo = acceptedMimeTypes.video.includes(mimetype);

  const handleLoadedMetaData = ({
    currentTarget,
  }: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setMetadataState({
      name: path,
      duration: currentTarget.duration,
      initialDuration: currentTarget.duration,
      videoHeight: currentTarget.videoHeight,
      videoWidth: currentTarget.videoWidth,
    });
  };

  const handleTrashClick = async () => {
    setLoadingState(true);

    const { data, error, success } = await deleteMedia(_id);

    if (!success) {
      updateMessageState({ message: error, success });
    } else {
      setDeletedMediaState(true);
    }
  };

  const handleMainMediaClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (_id === selectedUploadedMediaIdState) {
      setSelectedUploadedMediaIdState("");
      setReplaceBgState({
        activated: true,
        transientValue: "",
        type: isVideo ? "video" : "image",
      });
    } else {
      setSelectedUploadedMediaIdState(_id);
      setReplaceBgState({
        activated: true,
        transientValue: path,
        type: isVideo ? "video" : "image",
      });
    }
  };

  useEffect(() => {
    if (isVideo && ffmpegState && ffmpegState.loaded) {
      extractImageFromVideo(ffmpegState, path, 0)
        .then((res) => {
          const { data, error, success } = res;

          if (success) {
            setThumbnailState(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setThumbnailState(path);
    }
  }, [ffmpegState]);

  useEffect(() => {
    if (deletedMediaState) {
      const timeoutId = setTimeout(() => {
        removeFromUploadedMediaState(_id);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [deletedMediaState]);

  return (
    <MainMedia
      $bgImg={thumbnailState}
      $selected={
        replaceBgState.activated && _id === selectedUploadedMediaIdState
      }
      onClick={handleMainMediaClick}
    >
      {isVideo ? (
        <video src={path} onLoadedMetadata={handleLoadedMetaData}></video>
      ) : (
        <></>
      )}
      {metadataState.duration ? (
        <span>{timeFormatter(metadataState.duration)}</span>
      ) : (
        <></>
      )}
      {deletedMediaState ? (
        <DarkOverlay>
          <CustomImage src={checkIcon.src} alt="check" $size="40px" />
        </DarkOverlay>
      ) : loadingState ? (
        <DarkOverlay>
          <CustomImage src={loaderTwoIcon.src} alt="loader-icon" $size="80px" />
        </DarkOverlay>
      ) : (
        <PositionContainer
          $height="fit-content"
          $left={"undefine"}
          $width="fit-content"
          $top="3px"
          $justifyContent="center"
          $padding="var(--three-px)"
          $miscellanous="right: 3px; background-color: #0009; border-radius: 30px;"
        >
          <CustomImage
            src={trashIcon.src}
            alt="delete-icon"
            $hover={true}
            $size="20px"
            onClick={handleTrashClick}
          />
        </PositionContainer>
      )}
    </MainMedia>
  );
};

export default UploadedMedia;
