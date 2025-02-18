import styled from "styled-components";

export const MainTextInput = styled.main`
  height: fit-content;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: calc(var(--ten-px) * 3);

  &:first-of-type {
    margin-left: 0px;
  }
`;

export const Label = styled.label`
  color: #ddd9;
  font-family: Nunito;
  font-size: 1rem;
  font-weight: 400;
`;

export const Input = styled.input`
  outline: none;
  ${({ theme: { brown01, purple01 } }) => `
        color: ${brown01};
        width: 300px;
        max-width: 100%;
        font-size: 1.2rem;
        border-radius: 5px;
        border: 1px solid ${purple01}23;
        background-color: transparent;
        margin-top: var(--seven-px);
        padding: calc(var(--seven-px) * 2);

        &:focus {
          border: 2px solid ${purple01}da;
        }

        &:disabled {
          opacity: 0.7;

          &:focus {
            border: 1px solid ${purple01}22;
            outline: 0px solid ${purple01}22;
          }
        }
    `}
`;
