import styled from "styled-components";
// .
import { CustomImage } from "./shared/Image.styles";

interface ICopyImage {
  $show: boolean;
}

export const MainCard = styled.div`
  height: fit-content;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  margin-top: var(--ten-px);

  &:first-of-type {
    margin-top: 0px;
  }

  img {
    margin-bottom: var(--ten-px);
  }
`;

export const CardText = styled.h4`
  ${({ theme: { blue01, blue05, brown01 } }) => `
    --padding: calc(var(--ten-px) * 2);
    color: ${blue01};
    font-family: Poppins;
    font-size: 0.9rem;
    font-weight: 400;
    letter-spacing: 1px;
    background-color: ${blue05};
    border: 1px dashed ${brown01}22;
    margin-left: var(--ten-px);
    flex-grow: 1; /* Fills remaining width */
    flex-basis: 0; /* Starts with no initial width */
    border-radius: 5px;
    padding: var(--padding);
    position: relative;

    & > img {
        top: var(--padding);
        right: var(--padding);
    }
  `}
`;

export const CopyImage = styled(CustomImage)<ICopyImage>`
  position: absolute;
  ${({ $show, $size }) =>
    $show
      ? `
    height: ${$size};
    width: ${$size};
    opacity: 0.7;
    visibility: visible;
    padding: var(--seven-px);
    border: 1px dashed #ddd5;
    background-color: #ddd2;
    border-radius: 3px;

    &:hover {
        opacity: 1;
    }
  `
      : `
    height: 10px;
    width: 10px;
    opacity: 0;
    visibility: none;
  `}
`;
