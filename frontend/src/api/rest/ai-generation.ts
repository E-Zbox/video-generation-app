import { instance } from ".";
import { IGenericResponse } from "../interfaces";
// interfaces
import {
  IAudioSettingsPayload,
  IGenerateVideoPayload,
  IOutputSettingsPayload,
  IScene,
  IStringResponse,
} from "../interfaces/video";

export const serverIsAlive = async (): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };
  try {
    const result = await instance.get("/health");

    const { data } = result;

    response = {
      ...data,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

export const expandText = async (text: string): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };
  try {
    const result = await instance.post("/user/expand/text", {
      text,
    });

    const { data } = result;

    response = {
      ...data,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

export const generateVideo = async (
  payload: IGenerateVideoPayload
): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };
  try {
    const result = await instance.post("/user/video/generate", {
      ...payload,
    });

    const { data } = result;

    response = {
      ...data,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

export const getDownloadableVideo = async (payload: {
  audioSettings: IAudioSettingsPayload;
  outputSettings: IOutputSettingsPayload;
  scenes: IScene[];
}): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };

  try {
    const {
      audioSettings: { audioId, audioSrc, tts },
      outputSettings: { videoDescription, videoName, videoTitle },
      scenes,
    } = payload;

    const result = await instance.post("/user/video/download", {
      audioId,
      audioSrc,
      tts,
      videoDescription,
      videoName,
      videoTitle,
      scenes,
    });

    const { data } = result;

    response = {
      ...data,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

export const monitorVideoStatus = async (
  jobId: string
): Promise<IGenericResponse<any>> => {
  let response: IGenericResponse<any> = {
    data: "",
    error: "",
    success: false,
  };
  try {
    const result = await instance.get(`/user/video/monitor/${jobId}`);

    const { data } = result;

    response = {
      ...data,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};
