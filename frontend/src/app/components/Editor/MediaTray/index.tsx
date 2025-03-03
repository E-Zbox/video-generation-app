import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// components
import AIGeneratedScene from "./AIGeneratedScene";
import AIGeneratedVideo from "./AIGeneratedVideo";
import UploadMedia from "./UploadMedia";
import UploadedMedia from "./UploadedMedia";
// store
import { useEditorStore } from "@/app/store";
// styles
import {
  MainMediaTray,
  TrayScroller,
  TrayTab,
  TrayTitle,
  UploadButton,
} from "@/app/styles/Editor/MediaTray/index.styles";
import { DivContainer } from "@/app/styles/shared/Container.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";

const VerticalScroller = ({
  children,
  width,
}: {
  children: ReactNode;
  width: string;
}) => {
  return (
    <DivContainer
      $alignItems="flex-start"
      $height="100%"
      $padding="var(--ten-px) var(--seven-px)"
      $width={width}
      $miscellanous="overflow-y: scroll;"
    >
      {children}
    </DivContainer>
  );
};

const MediaTray = () => {
  const {
    videoEditor: {
      acceptedMimeTypes,
      assets: { uploadIcon },
    },
  } = screens;

  const {
    aiGeneratedScenes,
    generatedVideoState,
    selectedMediaState,
    updateSelectedMediaState,
    selectTabMenuState,
    selectedTabMenuIndexState,
    tabMenuState,
    uploadedMediaState,
  } = useEditorStore();

  // we use this methodolgy so as to trigger a re-render of state when setState is called
  const scrollerCallbackRef = useCallback((node: HTMLDivElement) => {
    scrollerRef.current = node;

    if (node) {
      setScrollerWidthState(node.clientWidth);
    }
  }, []);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [scrollerWidthState, setScrollerWidthState] = useState(0);
  const [showState, setShowState] = useState(true);

  const uploadedMediaStateIds = Object.getOwnPropertyNames(uploadedMediaState);

  const generatedVideoJobIds = Object.getOwnPropertyNames(generatedVideoState);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name } = target;

    if (name == "input_media") {
      if (target.files) {
        const { files } = target;
        for (const file of files) {
          updateSelectedMediaState(file);
        }
      }
    }
  };

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scroll({
        behavior: "smooth",
        left: selectedTabMenuIndexState * scrollerRef.current.clientWidth,
      });
    }
  }, [scrollerRef.current, selectedTabMenuIndexState]);

  return (
    <MainMediaTray $show={showState}>
      {showState ? (
        <>
          <TrayTab
            $left={`${
              (selectedTabMenuIndexState * 100) / tabMenuState.length
            }%`}
            $width={`${100 / tabMenuState.length}%`}
          >
            {tabMenuState.map(({ id, selected, text }, index) => (
              <TrayTitle
                key={id}
                $selected={selected}
                onClick={() => selectTabMenuState(index)}
              >
                {text}
              </TrayTitle>
            ))}
          </TrayTab>
          <TrayScroller ref={scrollerCallbackRef}>
            <DivContainer
              $flexDirection="row"
              $alignItems="flex-start"
              $height="100%"
              $width="fit-content"
            >
              <VerticalScroller width={`${scrollerWidthState}px`}>
                {/* upload section */}
                <DivContainer $width={"100%"}>
                  <UploadButton>
                    <CustomImage
                      src={uploadIcon.src}
                      alt="upload-icon"
                      $size={"24px"}
                    />
                    Upload
                    <input
                      accept={[
                        ...acceptedMimeTypes.image,
                        ...acceptedMimeTypes.video,
                      ].join(",")}
                      name="input_media"
                      multiple
                      type="file"
                      onChange={handleChange}
                    />
                  </UploadButton>
                  <DivContainer
                    $flexDirection="row"
                    $flexWrap="wrap"
                    $justifyContent="space-between"
                    $padding="calc(var(--ten-px) * 2) 0px 0px"
                    $width="100%"
                    $miscellanous={
                      uploadedMediaStateIds.length > 0
                        ? "border-bottom: 1px solid #9994;"
                        : ""
                    }
                  >
                    {selectedMediaState.map(({ id, file }) => (
                      <UploadMedia key={file.name} id={id} file={file} />
                    ))}
                  </DivContainer>
                  {uploadedMediaStateIds.length > 0 ? (
                    <DivContainer
                      $flexDirection="row"
                      $flexWrap="wrap"
                      $justifyContent="space-between"
                      $padding="calc(var(--ten-px) * 2) 0px calc(var(--ten-px) * 2)"
                      $width="100%"
                    >
                      {uploadedMediaStateIds.map((_id) => (
                        <UploadedMedia key={_id} _id={_id} />
                      ))}
                    </DivContainer>
                  ) : (
                    <></>
                  )}
                </DivContainer>
              </VerticalScroller>
              <VerticalScroller width={`${scrollerWidthState}px`}>
                {/* ai generated scenes section */}
                <DivContainer
                  $flexDirection="row"
                  $flexWrap="wrap"
                  $justifyContent="space-between"
                  $padding="var(--ten-px) 0px"
                  $width={"100%"}
                >
                  {aiGeneratedScenes.map((path, index) => (
                    <AIGeneratedScene key={path} index={index} path={path} />
                  ))}
                </DivContainer>
              </VerticalScroller>
              <VerticalScroller width={`${scrollerWidthState}px`}>
                {/* ai generated video section */}
                <DivContainer
                  $flexDirection="column"
                  $flexWrap="wrap"
                  $justifyContent="flex-end"
                  $padding="var(--ten-px) 0px"
                  $width={"100%"}
                >
                  {generatedVideoJobIds.map((jobId, index) => (
                    <AIGeneratedVideo key={index} jobId={jobId} />
                  ))}
                </DivContainer>
              </VerticalScroller>
            </DivContainer>
          </TrayScroller>
        </>
      ) : (
        <></>
      )}
    </MainMediaTray>
  );
};

export default MediaTray;
