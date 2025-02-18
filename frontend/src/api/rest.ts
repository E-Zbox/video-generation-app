import { instance } from ".";
// interfaces
import { IGenerateVideoPayload, IStringResponse } from "./interface";

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
