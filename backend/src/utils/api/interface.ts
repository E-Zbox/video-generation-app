import { IGenericResponse } from "../models/interfaces";

export interface IPictoryAccessToken {
  accessToken: string;
  expiresIn: number;
}

export interface IPictoryAccessTokenResponse
  extends IGenericResponse<IPictoryAccessToken> {}

export interface IGenerateVideoScene {
  backgroundUri?: string;
  minimumDuration: number;
  splitTextOnNewLine: boolean;
  splitTextOnPeriod: boolean;
  text: string;
  voiceOver: boolean;
}

export interface IBaseVideoPayload {
  videoDescription: string;
  videoName: string;
}

export interface IBrandLogoPayload {
  url: string;
  verticalAlignment: "bottom" | "center" | "top";
  horizontalAlignment: "center" | "left" | "right";
}

export interface IAudioSettings {
  video_volume: number;
  audio_id: number;
  audio_library: string;
  src: string;
  track_volume: number;
  tts: string;
}

export interface IOutputSettings {
  name: string;
  description: string;
  format: string;
  title: string;
  height: number;
  width: number;
}

export interface IBackgroundSrc {
  url: string;
  type: string;
  library: string;
  loop_video: true;
  mute: true;
}

export interface IAnimation {
  animation: string;
  source: string;
  speed: number;
  type: string;
}

export interface ITextLine {
  text: string;
  text_animation: IAnimation[];
  text_bg_animation: IAnimation[];
}

export interface ISubScene {
  time: number;
  location: {
    start_x: number;
    start_y: number;
  };
  text_lines: ITextLine[];
  // font: {}
}

export interface IScene {
  background: {
    src: IBackgroundSrc[];
    color: string;
    bg_animation: {
      animation: string;
    };
    time: number;
  };
  time: number;
  sub_scenes: ISubScene[];
}

export interface IVoiceOverTrack {
  // accent: string;
  // category: string;
  // engine: string;
  gender: string;
  id: number;
  language: string;
  name: string;
  sample: string;
  // service: string;
  // ssmlHelp: string;
  // ssmlSupportCategory: string;
}

export interface IStoryboardResponse
  extends IGenericResponse<{
    data: {
      jobId: string;
    };
    jobId: string;
    success: boolean;
  }> {}

export interface IRenderVideoResponse
  extends IGenericResponse<{
    jobId: string;
  }> {}

export interface IVoiceOverTrackResponse
  extends IGenericResponse<IVoiceOverTrack[]> {}
