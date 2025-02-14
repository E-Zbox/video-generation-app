import { NextFunction, Request, Response } from "express";
// utils/api
import { generatePictoryToken } from "@/utils/api/pictory";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if access_token has expired and generate new one
    const { data, error, success } = await generatePictoryToken();

    if (!success) {
      throw error;
    }

    req.pictory = {
      accessToken: data.accessToken,
    };
    next();
  } catch (error) {
    next(error);
  }
};
