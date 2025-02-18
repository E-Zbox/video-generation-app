import styled from "styled-components";

interface IMainVideoControl {
  $icon: string;
}

export const MainVideoControl = styled.p<IMainVideoControl>`
  ${({ $icon }) => `
        --size: 20px;
        outline: none;
        background: none;
        height: var(--size);
        width: var(--size);
        display: grid;
        place-content: center;
        z-index: 1;

        &::before {
            content: \"${"\\" + `${$icon}`}\";
            color: white;
            width: 100%;
            opacity: 0.5;
            font-family: VideoJS;
            font-weight: normal;
            font-size: var(--size);
        }

        &:hover {
            &::before {
                opacity: 1;
            }
        }
    `}
`;
