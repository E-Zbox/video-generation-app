import styled from "styled-components";

export const MainApp = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  // padding: calc(var(--ten-px) * 2);
  background: ${({ theme: { purple02 } }) =>
    `radial-gradient(ellipse at bottom center, #000, ${purple02}11)`};

  &::before {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-color: ${({ theme: { black03 } }) => `${black03}23`};
  }

  & > * {
    z-index: 1;
  }
`;
