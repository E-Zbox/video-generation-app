import {
  IStoryboardAudio,
  IStoryboardOutput,
  IStoryboardScene,
} from "@/app/store/interfaces/storyboard";
import { IGenericResponse } from ".";
import { IThumbnail } from "@/app/screens/interface";

export interface IGenerateVideoPayload {
  brandLogoHorizontalAlignment: string;
  brandLogoVerticalAlignment: string;
  brandLogoURL: string;
  minimumDuration: number;
  speaker?: string;
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
  audioId: string;
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
  loop_video: boolean;
  mute: boolean;
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
    // time: number;
  };
  time: number;
  sub_scenes: ISubScene[];
}

export interface IJobId {
  jobId: string;
}

export interface IVideoRender {
  jobId: string;
  txtFile: string;
  audioURL: string;
  thumbnail: string;
  videoDuration: number;
  videoURL: string;
  vttFile: string;
  srtFile: string;
  shareVideoURL: string;
  status: "completed" | "in-progress";
}

export interface ITrimVideo {
  _id: string;
  base64: string;
  mimetype: string;
  path: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IJobIdResponse extends IGenericResponse<IJobId> {}

export interface ITrimVideoResponse extends IGenericResponse<ITrimVideo> {}

export interface IVideoGenerationResponse
  extends IGenericResponse<IVideoGeneration> {}

export interface IVideoRenderResponse extends IGenericResponse<IVideoRender> {}
