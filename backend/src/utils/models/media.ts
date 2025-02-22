import { IIDPayload, INumberResponse } from "./interfaces";
import { ICreateMediaPayload, IMediaResponse } from "./interfaces/media";
// config
import cloudinary from "@/config/cloudinary";
// errors
import { MediaError } from "../errors";
// models
import Media from "@/models/Media";

export const createMedia = async (
  payload: ICreateMediaPayload
): Promise<IMediaResponse> => {
  let response: IMediaResponse = {
    data: {
      mimetype: "",
      path: "",
      publicId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    error: "",
    success: false,
  };
  try {
    const result = await Media.create(payload);

    if (!result) {
      throw new MediaError("Media creation failed!");
    }

    const { _id, mimetype, path, publicId, createdAt, updatedAt } = result;

    response = {
      data: { _id, mimetype, path, publicId, createdAt, updatedAt },
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: ``,
    };
  } finally {
    return response;
  }
};

export const deleteMedia = async (
  payload: IIDPayload
): Promise<INumberResponse> => {
  let response: INumberResponse = {
    data: 0,
    error: "",
    success: false,
  };

  try {
    const mediaExists = await Media.findOne(payload);

    if (!mediaExists) {
      throw new MediaError(
        `Media with payload ${JSON.stringify(payload)} does not exist!`
      );
    }

    const result = await Media.deleteOne(payload);

    if (!result) {
      throw new MediaError("Media deletion failed!");
    }

    await cloudinary.api.delete_resources([mediaExists.publicId]);

    response = {
      data: 1,
      error: "",
      success: true,
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
