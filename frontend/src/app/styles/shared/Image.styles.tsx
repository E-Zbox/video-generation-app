import styled from "styled-components";

interface ICustomImage {
  $size?: string;
}

export const CustomImage = styled.img<ICustomImage>`
  --size: ${({ $size }) => $size || "24px"};
  height: var(--size);
  width: var(--size);
`;
