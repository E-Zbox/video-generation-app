"use client";
import React from "react";
// components
import TagText from "./TagText";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import {
  AddSSMLTag,
  SubSceneTextLine,
} from "@/app/styles/Editor/Studio/Scene/SubScene.styles";
import { DivContainer } from "@/app/styles/shared/Container.styles";
// utils
import { parseSSML } from "@/app/utils/ssml";

interface IProps {
  borderColor: string;
  sceneIndex: number;
  subSceneIndex: number;
  textLineIndex: number;
}

const TextLine = (props: IProps) => {
  const { borderColor, sceneIndex, subSceneIndex, textLineIndex } = props;

  const { sceneState } = useStoryboardEditorStore();

  const { text } =
    sceneState[sceneIndex].sub_scenes[subSceneIndex].text_lines[textLineIndex];

  const { tags } = parseSSML(text);

  return (
    <SubSceneTextLine $borderColor={borderColor}>
      <AddSSMLTag>+ Tag</AddSSMLTag>
      <DivContainer $alignItems="flex-start" $width="100%">
        {tags.map((tag, key) => (
          <TagText key={key} tagTextIndex={key} {...props} {...tag} />
        ))}
      </DivContainer>
    </SubSceneTextLine>
  );
};

export default TextLine;
