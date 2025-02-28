import styled, { css, keyframes } from "styled-components";

interface IMainModal {
  $animationDuration: number;
  $success: boolean;
}

export const animateModal = keyframes`
    0% {
        opacity: 0;
        transform: translateX(40px);
    }
    5% {
        opacity: 1;
        transform: translateX(0px);
    }
    90% {
        opacity: 1;
        transform: translateX(0px);
    }
    98% {
        opacity: 0.5;
        transform: translateX(35px);
    }
    100% {
        opacity: 0;
        transform: translateX(100px);
    }
`;

export const MainModal = styled.main<IMainModal>`
  ${({
    $animationDuration,
    $success,
    theme: { blue02, blue05, green01, purple01, red01 },
  }) => css`
    --padding: calc(var(--ten-px) * 1.5);
    position: relative;
    height: fit-content;
    width: 350px;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    padding: var(--padding) var(--three-px);
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    margin-top: var(--padding);
    transition: 350ms ease-out;
    background-color: #dededec5;
    box-shadow: 0px 1px 3px #dedfdc0c;
    animation: ${animateModal} ${$animationDuration}ms linear forwards;

    &:first-of-type {
      margin-top: 0px;
    }

    & > div > h4 {
      color: ${$success ? green01 : red01};
    }

    &::before {
      content: "";
      top: 0px;
      left: 0px;
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: -1;
      //   background-image: linear-gradient(
      //     to bottom right,
      //     ${blue05}de,
      //     ${blue05},
      //     ${blue05},
      //     ${blue05}c5,
      //     ${purple01}11
      //   );
      background-color: ${blue05}b5;
    }
  `}
`;

export const Modal = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  & > * {
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

export const ModalText = styled.h4`
  font-family: Inter;
  font-size: 1rem;
  font-weight: bold;
`;

export const ModalBody = styled.p`
  color: #ddd;
  font-family: Nunito;
  font-size: 1.05rem;
  font-weight: 400;
`;
