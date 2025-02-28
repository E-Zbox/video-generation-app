import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// components
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
import AIGeneratedMedia from "./AIGeneratedMedia";

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
    selectedMediaState,
    updateSelectedMediaState,
    selectTabMenuState,
    selectedTabMenuIndexState,
    tabMenuState,
    uploadedMediaState,
  } = useEditorStore();

  const uploadedMediaStateIds = Object.getOwnPropertyNames(uploadedMediaState);

  const [scrollerWidthState, setScrollerWidthState] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // we use this methodolgy so as to trigger a re-render of state when setState is called
  const scrollerCallbackRef = useCallback((node: HTMLDivElement) => {
    scrollerRef.current = node;

    if (node) {
      setScrollerWidthState(node.clientWidth);
    }
  }, []);

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
    <MainMediaTray $show={true}>
      <TrayTab $left={`${selectedTabMenuIndexState * 50}%`}>
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
                <AIGeneratedMedia key={path} index={index} path={path} />
              ))}
            </DivContainer>
          </VerticalScroller>
        </DivContainer>
      </TrayScroller>
    </MainMediaTray>
  );
};

export default MediaTray;
