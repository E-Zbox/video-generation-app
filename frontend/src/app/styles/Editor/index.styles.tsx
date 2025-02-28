import styled from "styled-components";

interface IMainEditor {
  $marginTop: string;
}

export const MainEditor = styled.main<IMainEditor>`
  ${({ $marginTop, theme: { blue05 } }) => `
    
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  border-top: 0px;
  margin-top: ${$marginTop};
  padding-top: var(--seven-px);
  padding-right: var(--seven-px);
  background-color: ${blue05}34;
  
  &::before {
    content: "";
    left: 0px;
    top: 0px;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-color: #dedede09;
    }
  `}

  & > * {
    margin-right: var(--seven-px);

    &:last-child {
      margin-right: 0px;
    }
  }
`;
