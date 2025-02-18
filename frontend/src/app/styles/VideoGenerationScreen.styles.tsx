import styled from "styled-components";

interface IMainVideoGeneration {
  $marginTop: string;
}

interface IMainTab {
  $beforeLeft: string;
  $show: boolean;
}

interface ITabText {
  $selected: boolean;
}

interface ITextareaLabel {
  $hide: boolean;
}

interface ITextareaH4 {
  $colorGradient?: string[];
  $fontStyle?: string;
  $fontWeight?: string;
}

interface IVideoControls {
  $show: boolean;
}

export const MainVideoGeneration = styled.main<IMainVideoGeneration>`
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: calc(var(--ten-px) * 2);
  margin-top: ${({ $marginTop }) => $marginTop};
`;

export const MainForm = styled.main`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const Form = styled.form`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  padding: calc(var(--ten-px) * 2);
`;

export const MainExpandText = styled.main`
  --height: 450px;
  --width: 800px;
  height: fit-content;
  width: var(--width);
  overflow: hidden;
  margin-bottom: calc(var(--ten-px) * 2);

  & > div > div > div,
  & > div > div > div > textarea {
    height: var(--height);
    width: var(--width);
  }
`;

export const MainTab = styled.div<IMainTab>`
  overflow: hidden;
  transition: 350ms linear;
  ${({ $beforeLeft, $show, theme: { purple02 } }) =>
    $show
      ? `
    height: fit-content;
    width: 350px;
    max-width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: var(--seven-px);
    margin-bottom: var(--seven-px);

    &::before {
        content: "";
        left: ${$beforeLeft};
        bottom: 0px;
        position: absolute;
        height: 3px;
        width: 50%;
        border-radius: 5px 5px 0px 0px;
        background-color: ${purple02};
    }`
      : `
        height: 0px;
        width: fit-content;
        visibility: hidden;
    `}
`;

export const TabText = styled.h4<ITabText>`
  flex: 1;
  font-family: Nunito;
  font-size: 1rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  padding: var(--ten-px) calc(var(--seven-px) * 2);

  &:nth-of-type(1) {
    margin-right: 2px;

    &::before {
      content: "";
      bottom: 0px;
      right: 0px;
      z-index: -1;
      position: absolute;
    }
  }

  &:nth-of-type(2) {
    &::before {
      content: "";
      bottom: 0px;
      left: 0px;
      z-index: -1;
      position: absolute;
    }
  }

  ${({ $selected, theme: { blue01, brown01, purple02 } }) =>
    $selected
      ? `
    font-weight: bold;
    color: transparent;
    background-clip: text;
    background-image: linear-gradient(to right, ${blue01}, ${purple02});

    &::before {
        height: 100%;
        width: 100%;
        background-color: ${brown01}07;
    }
  `
      : `
    color: #ddd;
    font-weight: 400;

    &:hover {
        background-color: ${brown01}07;
    }

    &::before {
        height: 0px;
        width: 0px;
        background-color: transparent;
    }
  `}
`;

export const ExpandTextScroller = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-x: hidden;
  border-radius: 5px;
`;

export const TextareaContainer = styled.div`
  max-width: 100%;
  display: grid;
  place-content: center;
  position: relative;
`;

export const Textarea = styled.textarea`
  resize: none;
  font-size: 1.4rem;
  font-style: italic;
  background: transparent;
  border-radius: 5px;
  padding: calc(var(--ten-px) * 2);
  ${({ theme: { purple01, purple02 } }) => `
    border: 1px solid ${purple01}22;
    outline: 0px solid ${purple02}32;

    &:focus {
      border: 2px solid ${purple01}72;
      outline: 2px solid ${purple02}82;
    }

    &:disabled {
      opacity: 0.7;

      &:focus {
          border: 1px solid ${purple01}22;
          outline: 0px solid ${purple01}22;
      }
    }
    `}
`;

export const TextareaLabel = styled.div<ITextareaLabel>`
  height: 100%;
  width: 100%;
  left: 0px;
  top: 0px;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  transition: 250ms ease-in;
  ${({ $hide }) =>
    $hide
      ? `
    visibility: hidden;
    opacity: 0.2;
  `
      : `
    visibility: visible;
    opacity: 1;
  `}
`;

export const TextareaH4 = styled.span<ITextareaH4>`
  ${({ $fontStyle, $fontWeight }) => `
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: fit-content;
        flex-wrap: wrap;
        font-family: Roboto;
        font-size: 2.5rem;
        font-style: ${$fontStyle || "italic"};
        font-weight: ${$fontWeight || "400"};
        margin: 0px var(--seven-px);
        text-align: center;
        white-space: normal;
    `}

  ${({ $colorGradient }) => {
    if ($colorGradient) {
      const [first, second] = $colorGradient;
      return `
        color: transparent;
        background-clip: text;
        background-image: linear-gradient(to right, ${first}, ${second});`;
    }
    return "color: white;";
  }}
`;

export const MainAIGenerated = styled.div`
  ${({ theme: { blue03, brown01 } }) => `
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    overflow: hidden;
    background-color: ${blue03}1a;
    padding: calc(var(--ten-px) * 2);
    box-shadow: 0px 0px 3px 1px inset ${brown01}32;
  `}
`;

export const AIGeneratedScroller = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: scroll;
`;

export const FormButton = styled.button`
  border: 0px;
  color: #ddd;
  outline: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: Nunito;
  font-size: 1.3rem;
  font-weight: bolder;
  scale: 0.95;
  border-radius: 5px;
  margin-left: var(--ten-px);
  transition: 350ms ease-in;
  padding: calc(var(--seven-px) * 1.8) calc(var(--ten-px) * 2);
  ${({ theme: { purple01, purple02 } }) => `
    background-image: linear-gradient(to right, ${purple01}, ${purple02});;
  `}

  img {
    margin-left: var(--seven-px);
  }

  &:hover {
    scale: 1;
    transform: translateY(-3px);
  }

  &:active {
    scale: 0.95;
  }

  &:disabled {
    opacity: 0.26;

    &:hover {
      scale: 0.95;
      transform: translate(0px, 0px);
    }

    &:active {
      scale: 0.95;
    }
  }

  &:first-of-type {
    margin-left: 0px;
  }
`;

export const MainVideo = styled.main`
  position: relative;
  height: fit-content;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 10px;
  border: 2px solid #0008;
  border-bottom-color: transparent;
  margin-top: calc(var(--ten-px) * 2);

  & > video {
    width: 100%;
  }

  & > audio {
    display: none;
  }

  & > div {
    border-radius: 0px 0px 5px 5px;
  }
`;

export const VideoControls = styled.div<IVideoControls>`
  ${({ $show, theme: { blue04 } }) => `
  left: 0px;
  bottom: 0px;
  height: 40px;
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: var(--ten-px);
  box-shadow: 0 -1px 1px #aaa1;
  transition: all 0.3s ease-in-out;
  background-color: ${blue04}a3;
  ${
    $show
      ? `
    opacity: 1;
    visibility: visible;
  `
      : `
    opacity: 0;
    visibility: hidden;
  `
  }

  & > * {
    margin: 0px var(--ten-px);
  }
  `}
`;

export const MainTimer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;

  p {
    color: white;
    font-family: Source Sans Pro;
    font-size: 0.9rem;
    margin-right: var(--seven-px);

    &:last-of-type {
      margin: 0px;
    }
  }
`;

export const ProgressBar = styled.div`
  --size: 5px;
  flex-basis: 0;
  flex-grow: 1;
  height: var(--size);
  border-radius: var(--size);
  background-color: #91919366;

  div {
    height: 100%;
    width: 100%;
    position: relative;
    border-radius: var(--size);
    background-color: #fff;

    &::after {
      content: "";
      top: 50%;
      right: 0px;
      position: absolute;
      border-radius: 30px;
      background-color: transparent;
      height: 0px;
      width: 0px;
      transform: translate(0px, -50%);
    }
  }

  &:hover {
    div {
      &::after {
        content: "";
        top: 50%;
        right: 0px;
        position: absolute;
        border-radius: 30px;
        background-color: #fff;
        height: calc(var(--size) * 2);
        width: calc(var(--size) * 2);
        transform: translate(0px, -50%);
      }
    }
  }
`;
