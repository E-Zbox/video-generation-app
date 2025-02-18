export interface IGenericResponse<T> {
  data: T;
  error: string;
  success: boolean;
}

export interface IGenerateVideoPayload {
  brandLogoURL: string;
  minimumDuration: number;
  text: string;
  videoDescription: string;
  videoName: string;
}

export interface IStringResponse extends IGenericResponse<string> {}

interface IScene {
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
    audio: {
      tts: string;
      // ... some other data got omitted!
    };
    output: {
      name: string;
      description: string;
      title: string;
    };
    scenes: IScene[];
  };
}

export interface IVideoGenerationResponse
  extends IGenericResponse<IVideoGeneration> {}
