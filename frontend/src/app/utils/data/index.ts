import checkIcon from "../../../../public/icons8-check-48.png";
import copyIcon from "../../../../public/icons8-copy-24.png";
import loaderIcon from "../../../../public/loader.gif";
import loaderTwoIcon from "../../../../public/loader-2.gif";
import loaderThreeIcon from "../../../../public/loader-3.gif";
// screens
import modal from "./modal";
import subScene from "./sub-scene";
import videoEditor from "./video-editor";
import videoGeneration from "./video-generation";

export const devices = {};

export const screens = {
  default: {
    assets: { checkIcon, copyIcon, loaderIcon, loaderThreeIcon, loaderTwoIcon },
  },
  modal,
  subScene,
  videoEditor,
  videoGeneration,
};

export const theme = {
  blue01: "#487ca3",
  blue02: "#405d77",
  blue03: "#39546d",
  blue04: "#283e52",
  blue05: "#171d26",
  brown01: "#d1bb91",
  brown02: "#6a4e39",
  green01: "#21AA05",
  green02: "$44bb55",
  green03: "#77ff88",
  purple01: "#7f31c5",
  purple02: "#8f31f5",
  red01: "#AA2105",
  teal: "#65a7b7",
};
