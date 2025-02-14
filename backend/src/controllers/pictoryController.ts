import { NextFunction, Request, Response } from "express";
// app
import { io } from "@/app";
// listeners
import { emitEvents, roomCreators } from "@/listeners.ts";
// utils/apis
import { generatePictoryToken } from "@/utils/api/pictory";

export const createPictoryTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { data, error, success } = await generatePictoryToken();

    if (!success) {
      throw error;
    }

    return res
      .status(201)
      .json({ data: { expiresIn: data.expiresIn }, error, success });
  } catch (error) {
    next(error);
  }
};

export const pictoryWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { success, data, job_id } = req.body;

    if (!success) {
      return res.status(200).json({ success: true });
    }

    const { video_generation_success } = emitEvents;

    const { create_job_id_room } = roomCreators;

    io.to(create_job_id_room(job_id)).emit(video_generation_success, {
      data,
      error: "",
      success: true,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
