import styled from "styled-components";

interface IPlayButton {
  $icon: string;
}

export const MainMediaEditor = styled.main`
  flex-basis: 0;
  flex-grow: 1;
  min-height: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #4448;
  margin: var(--ten-px) 0px;

  video {
    height: 100%;
    width: 100%;
  }

  & > button {
    visibility: hidden;
  }

  &:hover {
    & > button {
      visibility: visible;
    }
  }
`;

export const PlayButton = styled.button<IPlayButton>`
  ${({ $icon, theme: { brown01, purple02 } }) => `
        --size: 80px;
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        outline: none;
        background: none;
        height: var(--size);
        width: var(--size);
        display: grid;
        place-content: center;
        z-index: 1;
        border: none;
        outline: none;
        border-radius: 50px;
        visibility: hidden;
        transition: 350ms ease-out;
        background-color:rgba(243, 239, 239, 0.05);

        &::before {
            content: \"${"\\" + `${$icon}`}\";
            color: white;
            width: 100%;
            opacity: 0.85;
            font-family: VideoJS;
            font-weight: normal;
            font-size: var(--size);
            color: transparent;
            background-clip: text;
            background-image: linear-gradient(to bottom right, #fff, ${brown01}, ${brown01}67, #2223);
        }

        &:hover {
            scale: 1.1;
            background-color:rgba(243, 239, 239, 0.07);
            
            &::before {
                opacity: 1;
            }
        }
    `}
`;
