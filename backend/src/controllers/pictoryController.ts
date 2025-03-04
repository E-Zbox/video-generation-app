import { NextFunction, Request, Response } from "express";
// app
import { io } from "@/app";
// listeners
import { emitEvents, roomCreators } from "@/listeners";
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

    const {
      video_generation_failed,
      video_generation_success,
      video_render_failed,
      video_render_success,
    } = emitEvents;

    const { create_video_generation_room, create_video_render_room } =
      roomCreators;

    console.log("webhook got called");
    console.log({ job_id, success });

    if (!success) {
      // emit to both rooms
      io.to(create_video_generation_room(job_id)).emit(
        video_generation_failed,
        {
          data: { jobId: job_id },
          error: "",
          success: true,
        }
      );

      io.to(create_video_render_room(job_id)).emit(video_render_failed, {
        data: {
          jobId: job_id,
        },
        error: "",
        success: true,
      });
      return res.status(200).json({ success: true });
    }

    if (data.renderParams) {
      io.to(create_video_generation_room(job_id)).emit(
        video_generation_success,
        {
          data,
          error: "",
          success: true,
        }
      );
    }

    if (data.status == "completed") {
      io.to(create_video_render_room(job_id)).emit(video_render_success, {
        data: {
          jobId: job_id,
          ...data,
        },
        error: "",
        success: true,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
