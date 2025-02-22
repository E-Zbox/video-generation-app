import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// config
import cloudinary from "@/config/cloudinary";
// errors
import { RequestBodyError } from "@/utils/errors";
// utils
import { createMedia, deleteMedia } from "@/utils/models/media";

const { ObjectId } = Types;

export const videoBackgroundUploadController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.file) {
      throw new RequestBodyError(
        "Missing `videoBackground` field with video background file!"
      );
    }

    const { filename: publicId, mimetype, path } = req.file;

    const { data, error, success } = await createMedia({
      mimetype,
      path,
      publicId,
    });

    if (!success) {
      throw error;
    }

    return res.status(201).json({ data, error, success });
  } catch (error) {
    if (req.file) {
      const { filename } = req.file;

      await cloudinary.api.delete_resources([filename]);
    }
    next(error);
  }
};

export const deleteVideoBackgroundController = async (
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
