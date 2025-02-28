import styled, { css, keyframes } from "styled-components";

interface IMainMediaTray {
  $show: boolean;
}

interface ITrayTab {
  $left: string;
}

interface ITrayTitle {
  $selected: boolean;
}

const shrinkWidth = keyframes`
    from {
        opacity: 1;
        visibility: visible;
        width: 300px;
    }
    to {
        opacity: 0;
        visibility: hidden;
        width: 20px;
    }
`;

export const MainMediaTray = styled.main<IMainMediaTray>`
  ${({ $show, theme: { brown01, blue05 } }) => css`
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: ${blue05};

    ${$show
      ? `
        width: 300px;
        max-width: 100%;
    `
      : `
        animation: ${shrinkWidth} 1300ms linear forwards;
    `}
  `}
`;

export const TrayTab = styled.div<ITrayTab>`
  ${({ $left, theme: { brown01 } }) => `
        width: 100%;
        height: 70px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        border-bottom: 1px solid #8884;

        & > h1 {
            flex: 1;
        }

        &::before {
            content: "";
            bottom: 0px;
            left: ${$left};
            height: 2px;
            width: 49%;
            position: absolute;
            transition: 250ms ease-in;
            background-color: ${brown01};
            border-radius: 10px 10px 0px 0px;
        }
    `}
`;

export const TrayTitle = styled.h1<ITrayTitle>`
  font-family: Nunito;
  font-size: 1rem;
  text-align: center;
  height: 100%;
  display: grid;
  place-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  ${({ $selected, theme: { brown01 } }) =>
    $selected
      ? `
        color: ${brown01};
        font-weight: bold;
        opacity: 1;
    `
      : `
        color: #ddd;
        fon-weight: 200;
        opacity: 0.7;

        &::before {
            content: "";
            right: 0px;
            bottom: 0px;
            height: 0px;
            width: 100%;
            position: absolute;
            border-radius: 30px;
            transition: 250ms linear;
            transform: translateY(50%);
            background-color: ${brown01}0a;
        }

        &:hover {
            &::before {
                height: 300%;
            }
        }

        &:active {
            scale: 0.95;
        }
    `}
`;

export const TrayScroller = styled.main`
  flex-basis: 0;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: hidden;
`;

export const UploadButton = styled.label`
  ${({ theme: { brown01 } }) => `
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 30px;
    border: none;
    outline: none;
    font-size: 1rem;
    font-weight: bold;
    width: 130px;
    box-shadow: 0px 1px 3px outset #fff1;
    padding: calc(var(--ten-px) * 1.2) calc(var(--seven-px) * 2);
    background: linear-gradient(to bottom left, ${brown01}, #222);

    & > input {
        display: none;
    }

    &:hover {
        scale: 1.05;
    }

    &:active {
        scale: 1;
    }
  `}
`;
