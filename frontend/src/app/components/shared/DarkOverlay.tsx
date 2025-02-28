import React, { ReactNode } from "react";
// styles
import { PositionContainer } from "@/app/styles/shared/Container.styles";

const DarkOverlay = ({ children }: { children: ReactNode }) => {
  return (
    <PositionContainer
      $height="100%"
      $width="100%"
      $left="0px"
      $top="0px"
      $justifyContent="center"
      $miscellanous="background-color: #0009;"
    >
      {children}
    </PositionContainer>
  );
};

export default DarkOverlay;
