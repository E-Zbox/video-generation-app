import styled from "styled-components";

export const MainSoundProgressBar = styled.main`
  ${({ theme: { purple01 } }) => `
    --size: 5px;
  left: 0px;
  bottom: 10px;
  width: 100%;
  height: var(--size);
  position: absolute;
  border-radius: 5px;
  background-color: #fefefe5b;

  div {
    height: 100%;
    width: 0px;
    position: relative;
    border-radius: var(--size);
    background-color: #fff;
    background-color: ${purple01}9d;

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
    --size: 8px;

    div {
      &::after {
        content: "";
        top: 50%;
        right: 0px;
        position: absolute;
        border-radius: 30px;
        background-color: ${purple01};
        height: calc(var(--size) * 2);
        width: calc(var(--size) * 2);
        transform: translate(0px, -50%);
      }
    }
  }
  `}
`;
