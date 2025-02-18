import styled from "styled-components";

export const MainApp = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  overflow: hidden;
  padding: calc(var(--ten-px) * 2);
  background: ${({ theme: { black03, purple03 } }) =>
    `radial-gradient(ellipse at bottom center, ${purple03}, ${black03})`};

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
