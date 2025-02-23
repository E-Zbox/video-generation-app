import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// config
import cloudinary from "@/config/cloudinary";
// errors
import { RequestBodyError } from "@/utils/errors";
// utils
import { createMedia, deleteMedia } from "@/utils/models/media";

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
