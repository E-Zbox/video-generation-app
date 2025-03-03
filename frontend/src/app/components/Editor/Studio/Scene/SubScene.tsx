"use client";
import React from "react";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import {
  MainSubScene,
  SubSceneHeader,
  SubSceneTextLineCard,
} from "@/app/styles/Editor/Studio/Scene/SubScene.styles";
import { DivContainer } from "@/app/styles/shared/Container.styles";
import TextLine from "./TextLine";
// utils
import { screens } from "@/app/utils/data";

interface IProps {
  sceneIndex: number;
  subSceneIndex: number;
}

const SubScene = (props: IProps) => {
  const { sceneIndex, subSceneIndex } = props;

  const {
    subScene: { borderColors },
  } = screens;

  const { sceneState } = useStoryboardEditorStore();

  const { text_lines } = sceneState[sceneIndex].sub_scenes[subSceneIndex];

  return (
    <MainSubScene>
      <SubSceneHeader>Sub Scene #{subSceneIndex + 1}</SubSceneHeader>
      <SubSceneTextLineCard>
        <DivContainer $alignItems="center" $width="100%">
          {text_lines.map((textLine, index) => (
            <TextLine
              key={index}
              borderColor={borderColors[index % borderColors.length]}
              sceneIndex={sceneIndex}
              subSceneIndex={subSceneIndex}
              textLineIndex={index}
            />
          ))}
        </DivContainer>
      </SubSceneTextLineCard>
    </MainSubScene>
  );
};

export default SubScene;
