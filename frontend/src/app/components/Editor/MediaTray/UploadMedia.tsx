"use client";
import React, { ReactNode, useEffect, useState } from "react";
// api
import { IMedia } from "@/api/interfaces/media";
import { uploadMedia } from "@/api/rest/media";
// components
import DarkOverlay from "../../shared/DarkOverlay";
// screens
import { IVideoMeta } from "@/app/screens/interface";
// store
import { useAppStore, useEditorStore } from "@/app/store";
// styles
import {
  ActionButton,
  CancelButton,
  MainMedia,
} from "@/app/styles/Editor/MediaTray/UploadMedia.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { extractImageFromVideo } from "@/app/utils/ffmpeg";
import { readFileAsBase64, timeFormatter } from "@/app/utils/transformer";

interface IProps {
  id: string;
  file: File;
}

const UploadMedia = (props: IProps) => {
  const { id, file } = props;
  const {
    default: {
      assets: { checkIcon, loaderTwoIcon },
    },
    videoEditor: {
      acceptedMimeTypes,
      assets: { uploadIcon },
    },
  } = screens;

  const { ffmpegState, updateMessageState } = useAppStore();

  const { removeSelectedMediaState, updateUploadedMediaState } =
    useEditorStore();

  const [fileBase64StringState, setFileBase64StringState] = useState<string>();
  const [loadingState, setLoadingState] = useState(false);
  const [localUploadedMediaState, setLocalUploadedMediaState] =
    useState<IMedia>();
  const [metadataState, setMetadataState] = useState<IVideoMeta>({
    duration: 0,
    name: "",
    videoHeight: 0,
    videoWidth: 0,
  });
  const [thumbnailState, setThumbnailState] = useState<string>("");

  const isVideo = acceptedMimeTypes.video.includes(file.type);

  const handleLoadedMetaData = ({
    currentTarget,
  }: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setMetadataState({
      name: file.name,
      duration: currentTarget.duration,
      videoHeight: currentTarget.videoHeight,
      videoWidth: currentTarget.videoWidth,
    });
  };

  const handleClick = async () => {
    setLoadingState(true);

    const { data, error, success } = await uploadMedia({ media: file });

    if (!success) {
      updateMessageState({ message: error, success });
    } else {
      setLocalUploadedMediaState(data);
    }

    setLoadingState(false);
  };

  useEffect(() => {
    readFileAsBase64(file).then((res) => setFileBase64StringState(res));
  }, []);

  useEffect(() => {
    if (isVideo && ffmpegState && ffmpegState.loaded && fileBase64StringState) {
      extractImageFromVideo(ffmpegState, file, 0)
        .then((res) => {
          console.log(res);
          const { data, error, success } = res;

          if (success) {
            setThumbnailState(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setThumbnailState(fileBase64StringState || "");
    }
  }, [ffmpegState, fileBase64StringState]);

  useEffect(() => {
    if (localUploadedMediaState) {
      const timeoutId = setTimeout(() => {
        updateUploadedMediaState(localUploadedMediaState);

        removeSelectedMediaState(id);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [localUploadedMediaState]);

  return (
    <MainMedia $bgImg={thumbnailState}>
      {isVideo ? (
        <video
          src={fileBase64StringState}
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
      {thumbnailState ? (
        localUploadedMediaState ? (
          <DarkOverlay>
            <CustomImage src={checkIcon.src} alt="check" $size="40px" />
          </DarkOverlay>
        ) : loadingState ? (
          <DarkOverlay>
            <CustomImage
              src={loaderTwoIcon.src}
              alt="loader-icon"
              $size="80px"
            />
          </DarkOverlay>
        ) : (
          <>
            <CancelButton onClick={() => removeSelectedMediaState(id)}>
              x
            </CancelButton>
            <ActionButton onClick={handleClick}>
              <CustomImage
                src={uploadIcon.src}
                alt="upload-icon"
                $size="24px"
              />
            </ActionButton>
          </>
        )
      ) : (
        <></>
      )}
    </MainMedia>
  );
};

export default UploadMedia;
