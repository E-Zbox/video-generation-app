import styled from "styled-components";

interface ITrimBox {
  $left: string;
  $width: string;
}

interface ITrimThumbnail {
  $bgImg: string;
}

export const MainTrimTool = styled.main`
  // grand-parent already defined height in pixels so as to make overflow,scroll work properly
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  h4 {
    font-size: 3rem;
  }
`;

export const TrimScroller = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  min-width: 0px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow-x: scroll;
`;

export const TrimContainer = styled.div`
  height: 100%;
  width: fit-content;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
`;

export const TrimThumbnail = styled.div<ITrimThumbnail>`
  ${({ $bgImg, theme: { blue05 } }) => `
    aspect-ratio: 3 / 2;
    height: 150px;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    position: relative;
    border: 0px solid transparent;
    transition: 250ms ease-in-out;
    background-image: url(${$bgImg});
    background-position: left top;
    background-repeat: no-repeat;
    background-size: cover;

    &::before {
      content: "";
      left: 0px;
      top: 0px;
      height: 100%;
      width: 100%;
      position: absolute;
      background-color: transparent;
    }

    &:hover {
      border: 1px solid ${blue05};

      &::before {
        background-color: #ddd5;
      }
    }

    span {
      color: #fff;
      background-color: ${blue05}c5;
      border-radius: 3px;
      padding: var(--seven-px);
    }
  `}
`;

export const TrimBox = styled.div<ITrimBox>`
  ${({ $left, $width, theme: { purple01 } }) => `
  --bgColor: ${purple01}c7;
  --borderColor: ${purple01};
  --borderWidth: 3px;
  left: ${$left};
  height: 100%;
  width: ${$width};
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 15px;
  border: var(--borderWidth) solid var(--borderColor);

  span {
    width: 15px;
    height: 80%;
    cursor: ew-resize;
    border-radius: 3px;
    transform: translateX(calc(var(--borderWidth) * -1));
    background-color: var(--bgColor);

    &:nth-of-type(2) {
      transform: translateX(var(--borderWidth));
    }
  }
  `}
`;

export const TrimButtonContainer = styled.div`
  height: 100%;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px var(--seven-px);
`;

export const TrimButton = styled.button`
  ${({ theme: { blue01 } }) => `
    border: none;
    outline: none;
    height: 50px;
    width: 100%;
    scale: 0.98;
    opacity: 1;
    text-align: center;
    border-radius: 5px;
    font-size: 1.05rem;
    color: #fff;
    background-color: ${blue01};
    margin-bottom: calc(var(--ten-px) * 2);

    &:nth-of-type(2) {
      margin-bottom: 0px;
    }

    &:hover {
      scale: 1.05;
      opacity: 1;
    }

    &:active {
      scale: 0.98;
    }
  `}
`;

export const CancelTrimButton = styled(TrimButton)`
  background-color: #9e9e9e9f;
`;
