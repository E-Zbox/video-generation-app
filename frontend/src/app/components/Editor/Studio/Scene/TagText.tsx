"use client";
import React from "react";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import { MainTagText } from "@/app/styles/Editor/Studio/Scene/SubScene.styles";
// utils
import { constructSSML } from "@/app/utils/ssml";
import { ISSMLTag } from "@/app/utils/ssml/interface";

interface IProps extends ISSMLTag {
  innerText: string;
  sceneIndex: number;
  subSceneIndex: number;
  tagTextIndex: number;
  textLineIndex: number;
  type: string;
}

const TagText = (props: IProps) => {
  const {
    attributes,
    endIndex,
    innerText,
    isSelfClosing,
    sceneIndex,
    startIndex,
    subSceneIndex,
    tagTextIndex,
    textLineIndex,
    type,
  } = props;

  const {
    setCachedSSMLTagState,
    setEditTagToolActivatedState,
    selectedTextLineTagState,
    setSelectedTextLineTagState,
  } = useStoryboardEditorStore();

  const textTagIsSelected =
    selectedTextLineTagState === null
      ? false
      : selectedTextLineTagState.sceneIndex === sceneIndex &&
        selectedTextLineTagState.subSceneIndex === subSceneIndex &&
        selectedTextLineTagState.textLineIndex == textLineIndex &&
        selectedTextLineTagState.tagTextIndex == tagTextIndex;

  const handleTagClick = (key: number) => {
    if (textTagIsSelected) {
      setEditTagToolActivatedState(false);

      setSelectedTextLineTagState(null);

      setCachedSSMLTagState(null);
    } else {
      setEditTagToolActivatedState(true);

      setSelectedTextLineTagState({
        sceneIndex,
        subSceneIndex,
        tagTextIndex: key,
        textLineIndex,
      });

      setCachedSSMLTagState({
        ...props,
      });
    }
  };

  return (
    <MainTagText
      $selected={textTagIsSelected}
      $tagType={type}
      onClick={() => handleTagClick(tagTextIndex)}
    >
      {innerText}
    </MainTagText>
  );
};

export default TagText;
