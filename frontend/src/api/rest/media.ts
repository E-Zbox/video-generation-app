import { instance } from ".";
import { INumberResponse } from "../interfaces";
// interfaces>
import { ICreateMediaPayload, IMediaResponse } from "../interfaces/media";
import {
  IStringResponse,
  IThumbnailsResponse,
  ITrimVideoResponse,
} from "../interfaces/video";

export const uploadMedia = async (
  payload: ICreateMediaPayload
): Promise<IMediaResponse> => {
  let response: IMediaResponse = {
    data: {
      _id: "",
      mimetype: "",
      path: "",
      publicId: "",
      createdAt: "",
      updatedAt: "",
    },
    error: "",
    success: false,
  };

  try {
    const { media } = payload;

    const formData = new FormData();

    formData.append("media", media);

    const result = await instance.post("/video/background/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { data: jsonData } = result;

    response = {
      ...jsonData,
    };

    if (jsonData.success) {
      const {
        data: [data],
        error,
        success,
      } = jsonData;

      response = {
        data,
        error,
        success,
      };
    }
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

export const deleteMedia = async (
  mediaId: string
): Promise<INumberResponse> => {
  let response: INumberResponse = {
    data: 0,
    error: "",
    success: false,
  };

  try {
    const result = await instance.delete(`/video/background/delete/${mediaId}`);

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

export const generateThumbnailsFromVideo = async (
  duration: number,
  maxThumbnails: number,
  videoUrl: string
): Promise<IThumbnailsResponse> => {
  let response: IThumbnailsResponse = {
    data: [],
    error: "",
    success: false,
  };

  try {
    const result = await instance.post(
      "/video/background/generate-thumbnails",
      {
        duration,
        maxThumbnails,
        videoUrl,
      }
    );

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

export const trimVideo = async (
  offset: number,
  startTime: number,
  videoUrl: string
): Promise<ITrimVideoResponse> => {
  let response: ITrimVideoResponse = {
    data: {
      _id: "",
      base64: "",
      createdAt: "",
      mimetype: "",
      path: "",
      publicId: "",
      updatedAt: "",
    },
    error: "",
    success: false,
  };

  try {
    const result = await instance.post("/video/background/trim", {
      offset,
      startTime,
      videoUrl,
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
