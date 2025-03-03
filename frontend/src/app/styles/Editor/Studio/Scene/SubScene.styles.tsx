import styled from "styled-components";

interface ISubSceneTextLine {
  $borderColor: string;
}

interface IText {
  $selected: boolean;
  $tagType: string;
}

export const MainSubScene = styled.main`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const SubSceneHeader = styled.h4`
  ${({ theme: { blue01 } }) => `
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${blue01};
  font-size: 1.9rem;
  box-shadow: 0px 2px 5px #0006;
  padding: var(--seven-px) calc(var(--seven-px) * 2.5);
  `}
`;

export const SubSceneTextLineCard = styled.div`
  height: fit-content;
  max-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: scroll;
  padding: var(--ten-px);
  box-shadow: 1px 1px 3px #0004 inset;

  // use div container to have height:fit-content to enable scroll feature
`;

export const SubSceneTextLine = styled.div<ISubSceneTextLine>`
  ${({ $borderColor }) => `
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
    justify-content: flex-start;
    border-radius: 10px;
    overflow-x: scroll;
    margin-bottom: calc(var(--three-px) * 1.7);
    border: 3px solid ${$borderColor}b0;
    padding: calc(var(--seven-px) * 1.4);
    background-color: ${$borderColor}91;

    // use div container to have height:fit-content to enable scroll feature

    &:last-of-type {
        margin-bottom: 0px;
    }
`}
`;

export const AddSSMLTag = styled.button`
  ${({ theme: { brown01 } }) => `
    border: none;
    outline: none;
    color: #ededed;
    font-size: 0.9rem;
    top: 0px;
    right: 0px;
    position: absolute;
    transform: translate(0, -100%);
    background-color: ${brown01};
    border-radius: 3px 3px 0px 0px;
    padding: var(--three-px);
`}
`;

export const MainTagText = styled.h4<IText>`
  ${({ $selected, $tagType, theme: { blue04, brown01 } }) => `
        color: white;
        height: 30px;
        width: fit-content;
        position: relative;
        padding: calc(var(--ten-px) * 1.5) 80px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        margin: var(--three-px) 0px;
        background-color: ${brown01}03;

        &::before {
            content: "<${$tagType}>";
            top: 50%;
            left: 0px;
        }

        &::after {
            content: "</${$tagType}>";
            top: 50%;
            right: 0px;
        }

        &::before, &::after {
            font-size: 0.85rem;
            height: fit-content;
            width: fit-content;
            position: absolute;
            color: ${brown01}d3;
            display: grid;
            place-content: center;
            border-radius: 4px;
            border: 1px solid ${brown01};
            padding: var(--three-px);
            background-color: ${brown01}34;
            transform: translate(0px, -50%);
        }

        ${
          $selected
            ? `
            width: 100%;
            text-align: center;
            border-radius: 4px;
            border: 2px solid ${brown01}43;

            &::before, &::after {
              color: ${blue04};
              background-color: ${brown01};
            }

            &::before {
              left: 5px;
            }

            &::after {
              right: 5px;
            }
            `
            : `
          &:hover {
            background-color: ${blue04};
          }
        `
        }
    `}
`;
