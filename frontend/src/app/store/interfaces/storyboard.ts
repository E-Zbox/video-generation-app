export interface IStoryboardAudio {
  video_volume: number;
  audio_id: string;
  audio_library: string;
  src: string;
  track_volume: number;
  tts?: string;
}

export interface IStoryboardOutput {
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
  loop_video: boolean;
  mute: boolean;
}

export interface IAnimation {
  animation: string;
  source: string;
  speed: number;
  type: string;
}

interface IDisplayItem {
  type: string;
  src: string;
  id: string;
  location: {
    preset: string;
    width: string;
  };
  visualType: string;
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
  displayItems: IDisplayItem[];
  text_lines: ITextLine[];
  // font: {}
}

export interface IStoryboardScene {
  background: {
    src: IBackgroundSrc[];
    color: string;
    bg_animation: {
      animation: string;
    };
  };
  time: number;
  sub_scenes: ISubScene[];
  music: boolean;
  tts: boolean;
  subtitle: boolean;
  subtitles: { text: string; time: number }[];
}

export interface IStoryboard {
  audio: IStoryboardAudio;
  output: IStoryboardOutput;
  scenes: IStoryboardScene[];
}
