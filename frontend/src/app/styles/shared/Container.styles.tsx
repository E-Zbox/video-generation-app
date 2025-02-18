import styled from "styled-components";

interface IMainContainer {
  $height?: string;
  $flexDirection?: string;
  $flexWrap?: string;
  $justifyContent?: string;
  $alignItems?: string;
  $padding?: string;
  $heightXS?: string;
  $flexDirectionXS?: string;
  $justifyContentXS?: string;
  $alignItemsXS?: string;
  $paddingXS?: string;
  $miscellanous?: string;
}

interface IDivContainer {
  // dimensions
  $height?: string;
  $width?: string;
  // flex
  $flexDirection?: string;
  $flexWrap?: string;
  $justifyContent?: string;
  $alignItems?: string;
  // margin
  $margin?: string;
  // padding
  $padding?: string;
  // miscellanous
  $miscellanous?: string;
}

interface IPositionContainer {
  $position?: string;
  $top?: string;
  $left?: string;
  // dimensions
  $height?: string;
  $width?: string;
  // flex
  $flexDirection?: string;
  $flexWrap?: string;
  $justifyContent?: string;
  $alignItems?: string;
  // margin
  $margin?: string;
  // padding
  $padding?: string;
  // miscellanous
  $miscellanous?: string;
}

export const MainContainer = styled.main<IMainContainer>`
  width: 100%;
  height: ${({ $height }) => $height || "fit-content"};
  display: flex;
  flex-wrap: ${({ $flexWrap }) => $flexWrap || "nowrap"};
  flex-direction: ${({ $flexDirection }) => $flexDirection || "column"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "flex-start"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  padding: ${({ $padding }) => $padding || "0px"};

  @media (max-width: ${({ theme: { devices } }) => devices.xs}) {
    height: ${({ $heightXS }) => $heightXS || "fit-content"};
    flex-direction: ${({ $flexDirectionXS }) => $flexDirectionXS || "column"};
    justify-content: ${({ $justifyContentXS }) =>
      $justifyContentXS || "flex-start"};
    align-items: ${({ $alignItemsXS }) => $alignItemsXS || "center"};
    padding: ${({ $paddingXS }) => $paddingXS || "0px"};
  }
`;

export const DivContainer = styled.div<IDivContainer>`
  height: ${({ $height }) => $height || "fit-content"};
  width: ${({ $width }) => $width || "70%"};
  display: flex;
  flex-wrap: ${({ $flexWrap }) => $flexWrap || "nowrap"};
  flex-direction: ${({ $flexDirection }) => $flexDirection || "column"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "flex-start"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  margin: ${({ $margin }) => $margin || "0px"};
  padding: ${({ $padding }) => $padding || "0px"};
  ${({ $miscellanous }) => $miscellanous};
`;

export const PositionContainer = styled.div<IPositionContainer>`
  position: ${({ $position }) => $position || "absolute"};
  top: ${({ $top }) => $top || "0px"};
  left: ${({ $left }) => $left || "0px"};
  height: ${({ $height }) => $height || "fit-content"};
  width: ${({ $width }) => $width || "70%"};
  display: flex;
  flex-wrap: ${({ $flexWrap }) => $flexWrap || "nowrap"};
  flex-direction: ${({ $flexDirection }) => $flexDirection || "column"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "flex-start"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  margin: ${({ $margin }) => $margin || "0px"};
  padding: ${({ $padding }) => $padding || "0px"};
  ${({ $miscellanous }) => $miscellanous}
`;
