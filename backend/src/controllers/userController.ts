import { NextFunction, Request, Response } from "express";
// api
import { expandText } from "@/utils/api/openai";
import { generateVideo, monitorVideoStatus } from "@/utils/api/pictory";
// config
import { checkForObjectKeys } from "@/utils/config/check";
// errors
import { RequestBodyError } from "@/utils/errors";

export const expandTextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { text } = req.body;

    const errorMessage = checkForObjectKeys(["text"], req.body);

    if (errorMessage) {
      throw new RequestBodyError(errorMessage);
    }

    const { data, error, success } = await expandText(text);

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success });
  } catch (error) {
    next(error);
  }
};

export const generateVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      minimumDuration: _minimumDuration,
      text,
      videoDescription,
      videoName,
    } = req.body;

    const errorMessage = checkForObjectKeys(
      ["minimumDuration", "text", "videoDescription", "videoName"],
      req.body
    );

    if (errorMessage) {
      throw new RequestBodyError(errorMessage);
    }

    const minimumDuration = Number(_minimumDuration);

    if (isNaN(minimumDuration)) {
      throw new RequestBodyError(
        "Expected a number passed in `minimumDuration` field."
      );
    }

    if (minimumDuration < 10) {
      throw new RequestBodyError("Minimum length for `minimumDuration` is 10.");
    }

    if (videoDescription.length > 100) {
      throw new RequestBodyError(
        "videoDescription length must be less than or equal to 100 characters long"
      );
    }

    const { accessToken } = req.pictory;

    const { data, error, success } = await generateVideo(
      accessToken,
      {
        videoDescription,
        videoName,
      },
      [
        {
          minimumDuration,
          splitTextOnNewLine: true,
          splitTextOnPeriod: true,
          text,
          voiceOver: true,
        },
      ]
    );

    if (!success) {
      throw error;
    }

    const { jobId } = data;

    return res.status(201).json({ data: jobId, error: "", success: true });
  } catch (error) {
    next(error);
  }
};

export const monitorVideoStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { jobId } = req.params;

    const { accessToken } = req.pictory;

    const { data, error, success } = await monitorVideoStatus(
      accessToken,
      jobId
    );

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success });
  } catch (error) {
    next(error);
  }
};
