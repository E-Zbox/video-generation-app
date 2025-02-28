import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// config
import cloudinary from "@/config/cloudinary";
// errors
import { RequestBodyError } from "@/utils/errors";
// utils
import { createMedia, deleteMedia } from "@/utils/models/media";
import { checkForObjectKeys } from "@/utils/config/check";
import { generateThumbnails, trimVideo } from "@/utils/service/video";

const { ObjectId } = Types;

export const uploadMediaController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.files) {
      throw new RequestBodyError(
        "Missing `media` field with video background file!"
      );
    }

    if (!Array.isArray(req.files)) {
      throw new RequestBodyError("Expected an array of files");
    }

    const createMediaPayload = req.files.map(
      ({ filename: publicId, mimetype, path }) => ({
        mimetype,
        path,
        publicId,
      })
    );

    const { data, error, success } = await createMedia(createMediaPayload);

    if (!success) {
      throw error;
    }

    return res.status(201).json({ data, error, success });
  } catch (error) {
    if (req.files && Array.isArray(req.files)) {
      req.files.map(async ({ filename }) => {
        await cloudinary.api.delete_resources([filename]);
      });
    }
    next(error);
  }
};

export const deleteMediaController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const mediaId = new ObjectId(req.params.mediaId);

    const { data, error, success } = await deleteMedia({ _id: mediaId });

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success });
  } catch (error: any) {
    if (
      error.name == "BSONError" &&
      error.message.includes("24 character hex string")
    ) {
      error = new Error("Invalid `mediaId` parameter passed");
    }
    next(error);
  }
};

export const generateThumbnailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      duration: _duration,
      maxThumbnails: _maxThumbnails,
      videoUrl,
    } = req.body;

    const errorMessage = checkForObjectKeys(
      ["duration", "maxThumbnails", "videoUrl"],
      req.body
    );

    if (errorMessage) {
      throw new RequestBodyError(errorMessage);
    }

    const duration = Number(_duration);

    if (isNaN(duration)) {
      throw new RequestBodyError("Expected `duration` field as seconds");
    }

    const maxThumbnails = Number(_maxThumbnails);

    if (isNaN(maxThumbnails)) {
      throw new RequestBodyError("Expected `maxThumbnails` field as seconds");
    }

    const { data, error, success } = await generateThumbnails(
      videoUrl,
      duration,
      maxThumbnails
    );

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success });
  } catch (error) {
    next(error);
  }
};

export const trimVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { startTime, offset, videoUrl } = req.body;

    const errorMessage = checkForObjectKeys(
      ["startTime", "offset", "videoUrl"],
      req.body
    );

    if (errorMessage) {
      throw new RequestBodyError(errorMessage);
    }

    const offsetInSeconds = Number(offset);

    if (isNaN(offsetInSeconds)) {
      throw new RequestBodyError("Expected `offset` field as seconds");
    }

    const startTimeInSeconds = Number(startTime);

    if (isNaN(startTimeInSeconds)) {
      throw new RequestBodyError("Expected `startTime` field as seconds");
    }

    const { data, error, success } = await trimVideo(
      videoUrl,
      startTimeInSeconds,
      offsetInSeconds
    );

    if (!success) {
      throw error;
    }

    return res
      .status(200)
      .json({ data: `data:video/mp4;base64,${data}`, error, success });
  } catch (error) {
    next(error);
  }
};
