import styled from "styled-components";

interface ICustomImage {
  $hover?: boolean;
  $size?: string;
}

export const CustomImage = styled.img<ICustomImage>`
  --size: ${({ $size }) => $size || "24px"};
  height: var(--size);
  width: var(--size);

  ${({ $hover }) =>
    $hover
      ? `
    opacity: 0.7;

    &:hover {
      opacity: 1;
      scale: 1.05
    }

    &:active {
      scale: 1;
    }
  `
      : ``}
`;
