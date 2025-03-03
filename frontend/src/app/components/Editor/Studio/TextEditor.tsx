"use client";
import React from "react";
// components
import SubScene from "./Scene/SubScene";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import {
  MainTextEditor,
  TextEditorContainer,
} from "@/app/styles/Editor/Studio/TextEditor.styles";

const TextEditor = () => {
  const { selectedSceneIndex, sceneState } = useStoryboardEditorStore();

  return (
    <MainTextEditor>
      <TextEditorContainer>
        {selectedSceneIndex == null ? (
          <></>
        ) : (
          sceneState[selectedSceneIndex].sub_scenes.map((_, index) => (
            <SubScene
              key={index}
              sceneIndex={selectedSceneIndex}
              subSceneIndex={index}
            />
          ))
        )}
      </TextEditorContainer>
    </MainTextEditor>
  );
};

export default TextEditor;
