import styled from "styled-components";

interface IMainMedia {
  $bgImg: string;
  $selected?: boolean;
}

export const MainMedia = styled.main<IMainMedia>`
  ${({ $bgImg, $selected, theme: { blue05, brown01 } }) => `
  height: var(--mediaTrayVideoSize);
  width: var(--mediaTrayVideoSize);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  align-self: flex-start;
  border-radius: 5px;
  overflow: hidden;
  background-image: url(${$bgImg});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 1px 1px 3px 0px #8882;
  transition: 350ms ease-out;
  margin: 0px var(--three-px) calc(var(--ten-px) * 2) var(--three-px);

  span {
    color: white;
    font-size: 0.9rem;
    border-radius: 3px;
    margin-left: var(--three-px);
    margin-bottom: var(--three-px);
    padding: var(--three-px) var(--seven-px);
    background-color: ${blue05}89;
  }

  video {
    display: none;
  }

  ${
    $selected
      ? `
    &::before {
      --size: 14px;
      content: "";
      height: var(--size);
      width: var(--size);
      top: 10px;
      left: 10px;
      position: absolute;
      background-color: ${brown01};
      border-radius: 30px;
    }
  `
      : `
    &::before {
      --size: 0px;
      content: "";
      top: var(--size);
      left: var(--size);
      position: absolute;
    }
      `
  }
  `}
`;

export const ActionButton = styled.button`
  ${({ theme: { brown01 } }) => `
  border: none;
  outline: none;
  display: grid;
  place-content: center;
  top: 50%;
  right: 50%;
  position: absolute;
  border-radius: 30px;
  padding: calc(var(--ten-px) * 2);
  transform: translate(50%, -50%);
  background: linear-gradient(to bottom left, ${brown01}9a, #000);

  img {
    scale: 1.05;
  }

  &:hover {
    img {
        scale: 1.2;
    }
  }

  &:active {
    scale: 0.95;
  }
  `}
`;

export const CancelButton = styled(ActionButton)`
  opacity: 0.7;
  font-family: Nunito;
  font-size: 0.9rem;
  font-weight: bold;
  top: 3px;
  right: 3px;
  color: #000;
  width: fit-content;
  position: absolute;
  background: #ddd;
  text-transform: uppercase;
  transform: translate(0px, 0px);
  padding: var(--three-px) calc(var(--seven-px) * 1.2);

  &:hover {
    opacity: 1;
    scale: 1.05;
  }

  &:active {
    scale: 1;
  }
`;
