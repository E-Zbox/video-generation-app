"use client";
import React, { useEffect, useState } from "react";
// store
import { useStoryboardEditorStore } from "@/app/store";
// styles
import {
  AttributeBox,
  AttributeField,
  AttributeInput,
  EditTagButton,
  EditTagButtonContainer,
  EditTagToolScroller,
  MainEditTagTool,
  TagLabel,
} from "@/app/styles/Editor/Studio/Scene/EditTagTool.styles";
import { DivContainer } from "@/app/styles/shared/Container.styles";
import { CustomImage } from "@/app/styles/shared/Image.styles";
// utils
import { screens } from "@/app/utils/data";
import { constructSSML, parseSSML } from "@/app/utils/ssml";
import { ISSMLTag } from "@/app/utils/ssml/interface";

const EditTagTool = () => {
  const {
    videoEditor: {
      assets: { trashIcon },
    },
  } = screens;

  const {
    cachedSSMLTagState,
    sceneState,
    selectedTextLineTagState,
    deleteSceneSubSceneTextLineState,
    updateSceneSubSceneTextLineState,
  } = useStoryboardEditorStore();

  const { attributes, endIndex, innerText, isSelfClosing, startIndex, type } =
    cachedSSMLTagState!;

  const inputFieldValues: { [name: string]: string } = {};

  if (attributes) {
    const attributesKey = Object.getOwnPropertyNames(attributes);

    attributesKey.forEach((key) => {
      inputFieldValues[`input_${key}`] = attributes[key];
    });
  }

  const input_innerText = "input_innerText";

  if (innerText) {
    inputFieldValues[input_innerText] = innerText;
  }

  const [formState, setFormState] = useState(inputFieldValues);

  const formStateFieldNames = Object.getOwnPropertyNames(formState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const { sceneIndex, subSceneIndex, tagTextIndex, textLineIndex } =
    selectedTextLineTagState!;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { tags } = parseSSML(
      sceneState[sceneIndex].sub_scenes[subSceneIndex].text_lines[textLineIndex]
        .text
    );

    const updatedTags = tags.map((tag, index): ISSMLTag => {
      if (index !== tagTextIndex) {
        return tag;
      }

      let innerText = formState[input_innerText];

      let attributes: any = null;

      formStateFieldNames.forEach((fieldName, idx) => {
        if (fieldName !== input_innerText) {
          if (idx == 0) {
            attributes = {};
          }

          attributes[fieldName] = formState[fieldName];
        }
      });

      return {
        attributes,
        endIndex,
        innerText,
        isSelfClosing,
        startIndex,
        type,
      };
    });

    const newLineText = constructSSML(updatedTags);

    updateSceneSubSceneTextLineState(
      sceneIndex,
      subSceneIndex,
      textLineIndex,
      newLineText
    );
  };

  const handleDelete = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    deleteSceneSubSceneTextLineState(sceneIndex, subSceneIndex, textLineIndex);
  };

  useEffect(() => {
    console.log(inputFieldValues);
    setFormState(inputFieldValues);
  }, [cachedSSMLTagState]);

  return (
    <MainEditTagTool>
      <TagLabel>{`<${type}>`}</TagLabel>
      <EditTagToolScroller>
        <DivContainer $flexDirection="row" $height="100%" $width="fit-content">
          {formStateFieldNames.map((name) => (
            <AttributeBox key={name}>
              <AttributeField>{name.split("input_")[1]}</AttributeField>
              {"="}
              <AttributeInput
                id={name}
                name={name}
                value={formState[name]}
                onChange={handleInputChange}
              />
            </AttributeBox>
          ))}
        </DivContainer>
      </EditTagToolScroller>
      <EditTagButtonContainer>
        <EditTagButton onClick={handleClick}>Save Changes</EditTagButton>
        <CustomImage
          src={trashIcon.src}
          $hover={true}
          $size={"40px"}
          onClick={handleDelete}
        />
      </EditTagButtonContainer>
    </MainEditTagTool>
  );
};

export default EditTagTool;
