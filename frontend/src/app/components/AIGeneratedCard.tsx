"use client";
import React, { MouseEvent, useEffect, useState } from "react";
// styles
import {
  CardText,
  CopyImage,
  MainCard,
} from "../styles/AIGeneratedCard.styles";
import { CustomImage } from "../styles/shared/Image.styles";
// utils
import { screens } from "../utils/data";

interface IProps {
  text: string;
}
const AIGeneratedCard = (props: IProps) => {
  const { text } = props;
  const {
    default: {
      assets: { checkIcon, copyIcon },
    },
    videoGeneration: {
      assets: { botIcon },
    },
  } = screens;

  const [copiedState, setCopiedState] = useState(false);
  const [showCopyState, setShowCopyState] = useState(false);

  const handleTextMouseEnter = (
    _event: MouseEvent<HTMLHeadingElement, globalThis.MouseEvent>
  ) => {
    setShowCopyState(true);
  };

  const handleTextMouseLeave = (
    event: MouseEvent<HTMLHeadingElement, globalThis.MouseEvent>
  ) => {
    setShowCopyState(false);
  };

  const copyToClipboard = async () => {
    if (copiedState) {
      return;
    }

    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob([text], { type: "text/plain" }),
    });

    await navigator.clipboard.write([clipboardItem]);

    setCopiedState(true);
  };

  useEffect(() => {
    if (copiedState) {
      const timeoutId = setTimeout(() => {
        setCopiedState(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [copiedState]);

  return (
    <MainCard>
      <CustomImage src={botIcon.src} alt={"bot-icon"} $size={"30px"} />
      <CardText
        onMouseEnter={handleTextMouseEnter}
        onMouseLeave={handleTextMouseLeave}
      >
        {text}
        <CopyImage
          src={copiedState ? checkIcon.src : copyIcon.src}
          alt="copy-icon"
          $show={showCopyState}
          $size="32px"
          onClick={copyToClipboard}
        />
      </CardText>
    </MainCard>
  );
};

export default AIGeneratedCard;
