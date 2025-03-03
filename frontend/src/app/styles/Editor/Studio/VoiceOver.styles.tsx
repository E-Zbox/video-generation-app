import styled from "styled-components";

interface IVoiceOption {
  $isMale: boolean;
  $selected: boolean;
}

export const VoiceOption = styled.h4<IVoiceOption>`
  ${({ $isMale, $selected, theme: { blue02, blue04, green03, purple02 } }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-family: Nunito;
    font-size: 0.95rem;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 1px;
    cursor: pointer;
    background-color: ${blue04}42;
    padding: calc(var(--seven-px) * 1.4) calc(var(--seven-px) * 2);
    padding-right: calc(var(--ten-px) * 2);

    ${
      $selected
        ? `
        position: relative;

        &::before {
            --size: 14px;
            content: "";
            right: 25px;
            top: 50%;
            height: var(--size);
            width: var(--size);
            position: absolute;
            border-radius: 30px;
            transform: translate(0, -50%);
            background-color: ${green03};
        }
    `
        : `
        &:hover {
            background-color: ${blue04}f2;
        }

        &:active {
            scale: 0.98;
        }`
    }

    div {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        & > img {
            margin-right: calc(var(--three-px) * 2);
        }
    }

    span {
        color: ${$isMale ? blue02 : purple02};
        font-size: 0.58rem;
        font-weight: 500;
        border-radius: 30px;
        padding: var(--three-px) var(--seven-px);
        margin-top: var(--seven-px);
        border: 1px solid ${$isMale ? blue02 : purple02};
    }

    &:last-of-type {
        margin-bottom: 0px;
    }
`}
`;
