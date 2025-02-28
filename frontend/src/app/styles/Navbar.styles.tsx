import styled from "styled-components";

export const MainNav = styled.main`
  ${({ theme: { brown01 } }) => `
  position: absolute;
  top: 0px;
  left: 0px;
  height: 70px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;
  padding-left: calc(var(--ten-px) * 2);
  box-shadow: 0px 1px 3px 1px ${brown01}12;
  `}
`;

export const Logo = styled.h4`
  ${({ theme: { blue01, purple02 } }) => `
  color: #fff;
  position: relative;
  font-family: Darumadrop One;
  font-size: 2.6rem;
  font-weight: bold;
  letter-spacing: 2px;
  width: fit-content;

  &::after {
    content: "2";
    left: 50%;
    top: 50%;
    height: fit-content;
    width: fit-content;
    font-size: 2rem;
    position: absolute;
    color: transparent;
    background-clip: text;
    background-image: linear-gradient(to right, ${blue01}24, ${purple02}82);
    transform: translate(-20px, -50%);
    z-index: -1;
  }
`}
`;
