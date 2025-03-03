import styled from "styled-components";

interface ISceneThumbnail {
  $selected: boolean;
}

export const SceneThumbnail = styled.div<ISceneThumbnail>`
  ${({ $selected, theme: { purple01 } }) => `
    --borderWidth: 4px;
    height: fit-content;
    width: fit-content;
    border-radius: 5px;
    margin: 0px 1px;
    transition: 350ms ease-out;
    ${
      $selected
        ? `
        border: var(--borderWidth) solid ${purple01};
    `
        : `
        border: var(--borderWidth) solid ${purple01}00;

        &:hover {
            opacity: 0.7;
        }
    `
    }

    & > * {
        margin: 0px;
    }
  `}
`;
