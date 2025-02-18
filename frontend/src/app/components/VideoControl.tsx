"use client";
import React from "react";
// styles
import { MainVideoControl } from "../styles/VideoControl.styles";

interface IProps {
  icon: string;
  handleClick: () => void;
}

const VideoControl = (props: IProps) => {
  const { icon, handleClick } = props;

  return (
    <MainVideoControl $icon={icon} onClick={handleClick}></MainVideoControl>
  );
};

export default VideoControl;
