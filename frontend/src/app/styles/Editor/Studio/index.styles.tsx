import styled from "styled-components";

interface ISettingsButton {
  $selected?: boolean;
}

interface ILogoInput {
  $loadFailed: boolean;
}

interface ISelect {
  $selected: boolean;
}

export const MainStudio = styled.main`
  ${({ theme: { blue05, purple01 } }) => `
    height: 100%;
    flex-basis: 0;
    flex-grow: 1;
    min-width: 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    // background: linear-gradient(to left bottom, #0c0c0c0c, ${blue05}8c, ${blue05});
  `}
`;

export const VideoStudio = styled.main`
  ${({ theme: { blue05 } }) => `
    flex-basis: 0;
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    border-radius: 5px;
    background-color: ${blue05};
    margin-bottom: var(--ten-px);
    padding: calc(var(--seven-px) * 1.5);
  `}
`;

export const SettingsTray = styled.div`
  height: 60px;
  width: fit-content;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 5px;
  padding: var(--ten-px);
  border: none;
  outline: none;
  appearance: none;
  overflow-x: scroll;
  background-color: #ffffff13;

  & > div > * {
    white-space: nowrap;
    margin: 0px calc(var(--three-px) * 2);
  }
`;

export const SettingsButton = styled.button<ISettingsButton>`
  ${({ $selected, theme: { blue01, green03 } }) => `
  border: none;
  outline: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  font-family: Nunito;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  height: 100%;
  color: ${blue01};
  padding: 0px var(--seven-px);
  background-color: transparent;

  ${
    $selected
      ? `
    background-color: #7772;
    position: relative;
    padding-right: calc(var(--ten-px) * 3);

    &::before {
      --size: 14px;
      content: "";
      right: 10px;
      top: 50%;
      height: var(--size);
      width: var(--size);
      position: absolute;
      border-radius: 30px;
      transform: translate(0, -50%);
      background-color: ${green03};
    }
  `
      : ``
  }

  & > * {
    margin: 0px var(--seven-px);
  }

  & > select {
    margin: 0px;
  }

  &:hover {
    background-color: #7772;
  }

  &:active {
    scale: 0.98;
  }

  &:disabled {
    opacity: 0.5;

    &:hover {
      background-color: transparent;
    }

    &:active {
      scale: 1;
    }
  }
`}
`;

export const MainLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: fit-content;
  // position: relative;
`;

export const LogoInput = styled.input<ILogoInput>`
  ${({ $loadFailed }) => `
  position: absolute;
  height: 50px;
  width: 250px;
  font-size: 1rem;
  font-family: Poppins;
  font-weight: 400;
  outline: 0px;
  color: black;
  z-index: 2;
  border-radius: 5px;
  padding: 0px var(--ten-px);
  background-color: white;
  border: ${$loadFailed ? `2px solid red` : "0px solid transparent"};
  box-shadow: 1px 1px 3px #0003 inset;

  &:focus {
    box-shadow: 1px 1px 3px 1px #000c inset;
  }
  `}
`;

export const Select = styled.div<ISelect>`
  ${({ $selected, theme: { blue01, green02, green03 } }) => `
    display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-family: Nunito;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  color: ${blue01};
  padding: calc(var(--seven-px) * 1.4);
  ${
    $selected
      ? `
    color: ${green02};
    position: relative;
    padding-right: calc(var(--ten-px) * 3);

    &::before {
        --size: 14px;
        content: "";
        right: 10px;
        top: 50%;
        height: var(--size);
        width: var(--size);
        position: absolute;
        border-radius: 30px;
        transform: translate(0, -50%);
        background-color: ${green03};
    }
  `
      : ``
  }

  & > img {
    margin-right: var(--seven-px);
  }

  &:hover {
    background-color: #7772;
  }

  audio {
      display: none;
  }

  &:active {
    scale: 0.98;
  }
  `}
`;

export const MainVoiceOver = styled.main`
  ${({ theme: { blue03 } }) => `
  right: 20px;
  top: 50%;
  height: 400px;
  width: 300px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  // border: 1px solid green;
  border-radius: 5px;
  box-shadow: 0px 1px 4px #ddd2;
  transform: translate(0px, -50%);
  background-color: ${blue03}28;
  `}
`;

export const VoiceOverTitle = styled.div`
  ${({ theme: { blue01, blue03 } }) => `
  width: 100%;
  padding: var(--ten-px);
  position: relative;
  box-shadow: 0px 1px 4px #cdcdcd16;

  h4 {
    z-index: 1;
    color: ${blue01};
    font-family: Nunito;
    font-size: 1.2rem;
    position: sticky;
  }

  &::before {
    content: "";
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    z-index: 0;
    position: absolute;
    background-color: #0e0e0e89;
  }
  `}
`;

export const VoiceOverScroller = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

export const OptionHeader = styled.h4`
  color: #999;
  font-family: Poppins;
  font-size: 0.9rem;
  font-weight: 600;
  width: 100%;
  background-color: #02020240;
  padding: var(--seven-px) calc(var(--seven-px) * 2);
`;

export const Option = styled.h4`
  ${({ theme: { blue02, blue04, purple02 } }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-family: Nunito;
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 1px;
    cursor: pointer;
    background-color: ${blue04}02;
    padding: calc(var(--seven-px) * 2);

    div {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        & > img {
            margin-right: calc(var(--three-px) * 2);
        }
    }

    span {
        color: ${blue02};
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 30px;
        padding: var(--three-px) var(--ten-px);
        margin-top: var(--seven-px);
        border: 1px solid ${blue02};
    }

    &:last-of-type {
        margin-bottom: 0px;
    }

    &:hover {
        background-color: ${blue04}f2;
    }

    &:active {
        scale: 0.98;
    }
`}
`;

export const ReplaceButton = styled.button`
  ${({ theme: { blue01 } }) => `
    color: ${blue01};
    border: none;
    outline: none;
    border-radius: 5px;
    font-family: Nunito;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    opacity: 0.8;
    background-color: #fefefe;
    padding: calc(var(--seven-px) * 1.3) calc(var(--ten-px) * 1.4);

    &:hover {
      opacity: 1;
    }

    &:active {
      scale: 0.95;
    }
  `}
`;

export const PictoryButton = styled.button`
  border: 0px;
  color: #ddd;
  outline: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: Nunito;
  font-size: 1rem;
  font-weight: bolder;
  border-radius: 5px;
  scale: 0.95;
  transition: 350ms ease-in;
  padding: calc(var(--seven-px) * 1) calc(var(--ten-px) * 1);
  ${({ theme: { purple01, purple02 } }) => `
    background-image: linear-gradient(to right, ${purple01}, ${purple02});;
  `}

  img {
    margin-left: var(--seven-px);
  }

  &:hover {
    scale: 1;
  }

  &:active {
    scale: 0.95;
  }
`;

export const MainScene = styled.main`
  ${({ theme: { purple01 } }) => `
  --height: 170px;
  height: var(--height);
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  background-color: #ffffff03;

  & > div > * {
    height: var(--height);
  }
  `}
`;

export const SceneScroller = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: scroll;
`;

export const SceneContainer = styled.div`
  height: 100%;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
  position: relative;
  justify-content: flex-start;
`;

export const SoundPlayer = styled.div`
  height: 100%;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0px var(--ten-px);
  background-color: rgba(243, 239, 239, 0.05);
`;

export const SoundTimer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  left: 50%;
  bottom: 6px;
  position: absolute;
  transform: translate(-50%, 0px);

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
