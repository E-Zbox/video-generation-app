import {
  IStoryboardAudio,
  IStoryboardOutput,
  IStoryboardScene,
} from "@/app/store/interfaces/storyboard";
import { IGenericResponse } from ".";
import { IThumbnail } from "@/app/screens/interface";

export interface IGenerateVideoPayload {
  brandLogoURL: string;
  minimumDuration: number;
  text: string;
  videoDescription: string;
  videoName: string;
}

export interface IStringResponse extends IGenericResponse<string> {}

export interface IThumbnailsResponse extends IGenericResponse<IThumbnail[]> {}

interface IVideoGenerationScene {
  background: {
    src: {
      url: string;
      // ... some data got omitted!
    }[];
  };
  time: number;
}

export interface IVideoGeneration {
  renderParams: {
    audio: IStoryboardAudio;
    output: IStoryboardOutput;
    scenes: IStoryboardScene[];
  };
}

export interface IAudioSettingsPayload {
  audioId: number;
  audioSrc: string;
  tts: string;
}

export interface IOutputSettingsPayload {
  videoDescription: string;
  videoName: string;
  videoTitle: string;
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
  text_bg_animation: IAnimation;
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
    src: IBackgroundSrc;
    color: string;
    bg_animation: {
      animation: string;
    };
    time: number;
  };
  time: number;
  sub_scenes: ISubScene[];
}

export interface IVideoRender {
  txtFile: string;
  audioURL: string;
  thumbnail: string;
  videoDuration: number;
  videoURL: string;
  vttFile: string;
  srtFile: string;
  shareVideoURL: string;
  status: string;
}

export interface IVideoGenerationResponse
  extends IGenericResponse<IVideoGeneration> {}

export interface IVideoRenderResponse extends IGenericResponse<IVideoRender> {}
