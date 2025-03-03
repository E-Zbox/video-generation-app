import styled from "styled-components";

export const MainEditTagTool = styled.main`
  // grand-parent already defined height in pixels so as to make overflow,scroll work properly
  --childHeight: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  background-color: #e0e0e005;
  padding: calc(var(--seven-px) * 1.5) calc(var(--seven-px) * 2);

  & > * {
    height: var(--childHeight);
  }
`;

export const TagLabel = styled.div`
  ${({ theme: { blue04, brown01 } }) => `
        width: fit-content;
        border-radius: 5px;
        background-color: red;
        display: grid;
        place-content: center;
        color: ${blue04};
        font-size: 1.4rem;
        background-color: ${brown01};
        padding: 0px calc(var(--ten-px) * 2);
        margin-right: calc(var(--ten-px) * 1.5);
    `}
`;

export const EditTagToolScroller = styled.div`
  ${({ theme: {} }) => `
    flex-basis: 0;
    flex-grow: 1;
    min-width: 0px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  `}
`;

export const AttributeBox = styled.div`
  ${({ theme: { brown01 } }) => `
  color: ${brown01};
  opacity: 0.37;
  height: 100%;
  width: fit-content;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.7rem;
  white-space: nowrap;
  padding: calc(var(--seven-px) * 1.5);
  margin-right: calc(var(--ten-px) * 1.5);

  &:last-of-type {
    margin-right: 0px;
  }
`}
`;

export const AttributeField = styled.label`
  ${({ theme: { brown01 } }) => `
    color: ${brown01};
    margin-right: calc(var(--three-px) * 2);
  `}
`;

export const AttributeInput = styled.input`
  ${({ theme: { blue04, brown01 } }) => `
        height: 100%;
        width: fit-content;
        color: #ffffff;
        font-size: 1.4rem;
        border-radius: 3px;
        padding: 0px var(--ten-px);
        border: 2px solid ${brown01};
        outline: 0px solid ${brown01};
        background-color: #01010112;
        margin-left: calc(var(--three-px) * 2);

        &:focus {
            outline: 2px solid ${brown01};
        }
    `}
`;

export const EditTagButtonContainer = styled.div`
  height: 100%;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0px var(--ten-px);

  & > * {
    margin-right: calc(var(--ten-px) * 2);

    &:last-of-type {
      margin-right: 0px;
    }
  }
`;

export const EditTagButton = styled.button`
  ${({ theme: { blue01 } }) => `
  border: none;
  outline: none;
  border-radius: 5px;
  font-size: 1.1rem;
  color: #ededed;
  scale: 0.95;
  opacity: 0.8;
  background-color: ${blue01};
  padding: calc(var(--ten-px) * 1.5);

  &:hover {
    scale: 1;
    opacity: 1;
  }
  `}
`;
