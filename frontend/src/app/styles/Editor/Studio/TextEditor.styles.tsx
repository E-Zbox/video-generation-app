import styled from "styled-components";

export const MainTextEditor = styled.main`
  ${({ theme: { blue04 } }) => `
  --bgColor: ${blue04};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: scroll;
  border: 1px solid var(--bgColor);
  background-color: var(--bgColor);
  border-radius: 10px;
  overflow: hidden;
  `}
`;

export const TextEditorContainer = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
