"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
// api
import { trimVideo } from "@/api/rest/media";
// components
import DarkOverlay from "../../shared/DarkOverlay";
// store
import {
  useAppStore,
  useEditorStore,
  useStoryboardEditorStore,
} from "@/app/store";
// styles
import {
  CancelTrimButton,
  MainTrimTool,
  TrimBox,
  TrimButton,
  TrimButtonContainer,
  TrimContainer,
  TrimScroller,
  TrimThumbnail,
} from "@/app/styles/Editor/Studio/TrimTool.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { generateThumbnailsFromVideo } from "@/app/utils/ffmpeg";
import { timeFormatter } from "@/app/utils/transformer";

const TrimTool = () => {
  const {
    default: {
      assets: { loaderTwoIcon },
    },
  } = screens;

  const { ffmpegState, updateMessageState } = useAppStore();
  const { videoMetadataState } = useEditorStore();
  const {
    sceneState,
    selectedSceneIndex,
    trimActivatedState,
    setTrimActivatedState,
    trimmedBackgroundVideoState,
    updateTrimmedBackgroundVideoState,
    trimmedThumbnailState,
    updateTrimmedThumbnailState,
  } = useStoryboardEditorStore();

  const TRIM_BOX_MINIMUM_WIDTH = 45;

  const initialXPositionOnMouseDown = useRef(0);

  const [leftOffsetInPixelState, setLeftOffsetInPixelState] = useState(20);
  const [rightOffsetInPixelState, setRightOffsetInPixelState] = useState(100);
  const [thumbnailIsProcessingState, setThumbnailIsProcessingState] =
    useState(false);

  const [trimBoxNodeState, setTrimBoxNodeState] = useState<HTMLDivElement>();
  const [trimBoxParentNodeState, setTrimBoxParentNodeState] =
    useState<HTMLDivElement>();
  const [firstSpanNodeState, setFirstSpanNodeState] =
    useState<HTMLSpanElement>();
  const [secondSpanNodeState, setSecondSpanNodeState] =
    useState<HTMLSpanElement>();
  const [videoTrimmingIsProcessingState, setVideoTrimmingIsProcessingState] =
    useState(false);

  const trimBoxRef = useCallback((node: HTMLDivElement) => {
    setTrimBoxNodeState(node);
  }, []);
  const trimBoxParentRef = useCallback((node: HTMLDivElement) => {
    setTrimBoxParentNodeState(node);
  }, []);
  const firstSpanRef = useCallback((node: HTMLSpanElement) => {
    setFirstSpanNodeState(node);
  }, []);
  const secondSpanRef = useCallback((node: HTMLSpanElement) => {
    setSecondSpanNodeState(node);
  }, []);

  const {
    background: {
      src: [src],
    },
    sub_scenes,
    time,
  } = sceneState[selectedSceneIndex!];

  const isVideo = src.type == "video";
  const path = src.url;

  const duration = videoMetadataState[path]?.duration || 0;

  const getThumbnails = async () => {
    if (ffmpegState) {
      setThumbnailIsProcessingState(true);

      const { data, error, success } = await generateThumbnailsFromVideo(
        ffmpegState,
        path,
        duration
      );

      // console.log({ data, error, success });

      setThumbnailIsProcessingState(false);

      if (!success) {
        updateMessageState({
          message: "Something went wrong in generating thumbnails!",
          success: false,
        });
        return;
      }

      updateTrimmedThumbnailState(path, data);
    }
  };

  const handleVideoTrim = async () => {
    if (trimBoxParentNodeState) {
      const startTime = Number(
        (
          (leftOffsetInPixelState * duration) /
          trimBoxParentNodeState?.clientWidth
        ).toFixed(2)
      );
      const offset = Number(
        (
          (rightOffsetInPixelState * duration) /
            trimBoxParentNodeState.clientWidth -
          startTime
        ).toFixed(2)
      );

      setVideoTrimmingIsProcessingState(true);

      const { data, error, success } = await trimVideo(offset, startTime, path);

      setVideoTrimmingIsProcessingState(false);

      if (!success) {
        updateMessageState({ message: error, success });
        return;
      }

      updateTrimmedBackgroundVideoState(path, {
        leftOffset: leftOffsetInPixelState,
        rightOffset: rightOffsetInPixelState,
        video: data,
      });
    }
  };

  useEffect(() => {
    if (trimActivatedState) {
      if (!trimmedThumbnailState[path]) {
        getThumbnails()
          .then()
          .catch((err) => console.log(err));
      }
    }
  }, [trimActivatedState]);

  useEffect(() => {
    const trimBox = trimBoxNodeState;
    const trimBoxParent = trimBoxParentNodeState;

    if (firstSpanNodeState && trimBox && trimBoxParent) {
      let initialWidth = 0,
        initialLeft = 0,
        initialRight = 0;

      const mousemoveHandlerForFirstSpan = (event: MouseEvent) => {
        // we are adjusting just the left position
        /*
              THEORY
              - cache the mouse initial x position
              - determine the current mouse x position
              - get the difference i.e (initial - current) x position
              - change trimbox width value by ±difference
          */
        const currentMouseXPosition = event.clientX;
        const diff =
          initialXPositionOnMouseDown.current - currentMouseXPosition;
        const newLeft = initialLeft - diff;
        const newWidth = initialRight - newLeft;

        // we update the width of trimbox and xPosition
        if (newWidth > TRIM_BOX_MINIMUM_WIDTH && newLeft >= 0) {
          setLeftOffsetInPixelState(newLeft);
          trimBox.style.width = `${newWidth}px`;
        } else if (newLeft < 0) {
          // if trying to move beyond left edge
          setLeftOffsetInPixelState(0);
        } else if (newWidth <= TRIM_BOX_MINIMUM_WIDTH) {
          // minimum width constraint
          const minWidthLeft = initialRight - TRIM_BOX_MINIMUM_WIDTH;
          setLeftOffsetInPixelState(minWidthLeft);
          trimBox.style.width = `${TRIM_BOX_MINIMUM_WIDTH}px`;
        }

        console.log({ spanLeft: trimBox.offsetLeft });

        // handleUpdateStart({
        //   target: {
        //     value: (trimBox.offsetLeft * 100) / trimBoxParent.clientWidth,
        //   },
        // });
      };

      const mousedownEventListener = (event: MouseEvent) => {
        initialXPositionOnMouseDown.current = event.clientX;
        initialWidth = trimBox.clientWidth;
        initialLeft = trimBox.offsetLeft;
        initialRight = initialLeft + initialWidth; // Store right edge position

        event.preventDefault();
        document.addEventListener("mousemove", mousemoveHandlerForFirstSpan);
      };

      firstSpanNodeState.addEventListener("mousedown", mousedownEventListener);

      const mouseupEventListener = (event: Event) => {
        document.removeEventListener("mousemove", mousemoveHandlerForFirstSpan);
      };

      document.addEventListener("mouseup", mouseupEventListener);

      return () => {
        document.removeEventListener("mousemove", mousemoveHandlerForFirstSpan);

        firstSpanNodeState?.removeEventListener(
          "mousedown",
          mousedownEventListener
        );

        document.removeEventListener("mouseup", mouseupEventListener);
      };
    }
  }, [firstSpanNodeState, trimBoxNodeState, trimBoxParentNodeState]);

  useEffect(() => {
    const trimBox = trimBoxNodeState;
    const trimBoxParent = trimBoxParentNodeState;

    if (secondSpanNodeState && trimBox && trimBoxParent) {
      // Declare variables to store initial values on mousedown
      let initialWidth = 0,
        initialLeft = 0;

      const mousemoveHandlerForSecondSpan = (event: MouseEvent) => {
        const currentMouseXPosition = event.clientX;
        const diff =
          currentMouseXPosition - initialXPositionOnMouseDown.current;

        // Calculate new width (left position remains unchanged)
        const newWidth = initialWidth + diff;

        const trimboxParentClientWidth = trimBoxParent.clientWidth;
        const rightEdge = initialLeft + newWidth;

        // Apply constraints
        if (
          newWidth > TRIM_BOX_MINIMUM_WIDTH &&
          rightEdge <= trimboxParentClientWidth
        ) {
          trimBox.style.width = `${newWidth}px`;
        } else if (rightEdge > trimboxParentClientWidth) {
          // If trying to move beyond right edge
          trimBox.style.width = `${trimboxParentClientWidth - initialLeft}px`;
        } else if (newWidth <= TRIM_BOX_MINIMUM_WIDTH) {
          // Minimum width constraint
          trimBox.style.width = `${TRIM_BOX_MINIMUM_WIDTH}px`;
        }

        const rightPosition = trimBox.offsetLeft + trimBox.clientWidth;

        setRightOffsetInPixelState(rightPosition);

        // handleUpdateEnd({
        //   target: { value: (rightPosition * 100) / trimBoxParent.clientWidth },
        // });
        console.log({
          spanRight: rightPosition,
          "trimBox.clientWidth": trimBox.clientWidth,
        });
      };

      const mousedownEventListener = (event: MouseEvent) => {
        // Store initial values when drag starts
        initialXPositionOnMouseDown.current = event.clientX;
        initialWidth = trimBox.clientWidth;
        initialLeft = trimBox.offsetLeft;

        event.preventDefault();
        document.addEventListener("mousemove", mousemoveHandlerForSecondSpan);
      };

      secondSpanNodeState.addEventListener("mousedown", mousedownEventListener);

      const mouseupEventListener = (event: Event) => {
        document.removeEventListener(
          "mousemove",
          mousemoveHandlerForSecondSpan
        );
      };

      document.addEventListener("mouseup", mouseupEventListener);

      return () => {
        document.removeEventListener(
          "mousemove",
          mousemoveHandlerForSecondSpan
        );

        secondSpanNodeState?.removeEventListener(
          "mousedown",
          mousedownEventListener
        );

        document.removeEventListener("mouseup", mouseupEventListener);
      };
    }
  }, [secondSpanNodeState, trimBoxNodeState, trimBoxParentNodeState]);

  if (duration == 0) {
    return <></>;
  }

  return (
    <MainTrimTool>
      <TrimScroller>
        {thumbnailIsProcessingState ? (
          <DarkOverlay>
            <CustomImage src={loaderTwoIcon.src} $size={"100px"} />
          </DarkOverlay>
        ) : trimmedThumbnailState[path]?.length > 0 ? (
          <TrimContainer ref={trimBoxParentRef}>
            {trimmedThumbnailState[path]?.map(({ src, startTimeInSeconds }) => (
              <TrimThumbnail key={src} $bgImg={src}>
                <span>{timeFormatter(startTimeInSeconds)}</span>
              </TrimThumbnail>
            ))}
            <TrimBox
              $left={`${
                trimmedBackgroundVideoState[path]
                  ? trimmedBackgroundVideoState[path].leftOffset
                  : leftOffsetInPixelState
              }px`}
              $width={"20%"}
              ref={trimBoxRef}
            >
              <span ref={firstSpanRef}></span>
              <span ref={secondSpanRef}></span>
            </TrimBox>
          </TrimContainer>
        ) : (
          <></>
        )}
      </TrimScroller>
      {thumbnailIsProcessingState ? (
        <></>
      ) : trimmedThumbnailState[path]?.length == 0 ? (
        <></>
      ) : (
        <TrimButtonContainer>
          <TrimButton onClick={handleVideoTrim}>Trim Video</TrimButton>
          <CancelTrimButton onClick={() => setTrimActivatedState(false)}>
            Cancel
          </CancelTrimButton>
        </TrimButtonContainer>
      )}
      {videoTrimmingIsProcessingState ? (
        <DarkOverlay>
          <CustomImage src={loaderTwoIcon.src} $size={"80px"} />
        </DarkOverlay>
      ) : (
        <></>
      )}
    </MainTrimTool>
  );
};

export default TrimTool;
