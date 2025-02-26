import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// api
import { expandText } from "@/utils/api/openai";
import {
  generateDownloadableVideo,
  generateVideo,
  getVoiceOverTracks,
  monitorVideoStatus,
} from "@/utils/api/pictory";
// config
import { checkForObjectKeys } from "@/utils/config/check";
// errors
import { RequestBodyError } from "@/utils/errors";
import { IScene } from "@/utils/api/interface";

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
      brandLogoHorizontalAlignment,
      brandLogoVerticalAlignment,
      brandLogoURL,
      minimumDuration: _minimumDuration,
      text,
      videoDescription,
      videoName,
    } = req.body;

    let { speaker } = req.body;

    const errorMessage = checkForObjectKeys(
      [
        "brandLogoHorizontalAlignment",
        "brandLogoVerticalAlignment",
        "brandLogoURL",
        "minimumDuration",
        "text",
        "videoDescription",
        "videoName",
      ],
      req.body
    );

    if (errorMessage) {
      throw new RequestBodyError(errorMessage);
    }

    // check if url is valid
    new URL(brandLogoURL);

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

    if (!speaker) {
      speaker = "Ivy (child)";
    }

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
      ],
      {
        horizontalAlignment: brandLogoHorizontalAlignment,
        url: brandLogoURL,
        verticalAlignment: brandLogoVerticalAlignment,
      }
    );

    if (!success) {
      throw error;
    }

    const { jobId } = data;

    return res.status(201).json({ data: jobId, error: "", success: true });
  } catch (error: any) {
    if (error.message == "Invalid URL") {
      next(new Error("Invalid url passed to brandLogoURL"));
    }
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

export const generateDownloadableVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      audioId,
      audioSrc,
      scenes,
      tts,
      videoDescription,
      videoName,
      videoTitle,
    } = req.body;

    const errorMessage = checkForObjectKeys(
      [
        "audioId",
        "audioSrc",
        "scenes",
        "tts",
        "videoDescription",
        "videoName",
        "videoTitle",
      ],
      req.body
    );

    if (errorMessage) {
      throw new RequestBodyError(errorMessage);
    }

    if (!Array.isArray(scenes)) {
      throw new RequestBodyError("Expected `scenes` field as array!");
    }

    // loop through and ensure each element in scenes is a valid scene
    scenes.every((scene: IScene) => {
      let errorMessage = checkForObjectKeys(
        ["background", "sub_scenes", "time"],
        scene
      );

      if (errorMessage) {
        throw new RequestBodyError(errorMessage);
      }

      // ensure all values in scene.background are present
      errorMessage = checkForObjectKeys(
        ["src", "color", "bg_animation", "time"],
        scene.background
      );

      if (errorMessage) {
        throw new RequestBodyError(errorMessage);
      }

      // ensure animation field exists in scene.background.bg_animation
      errorMessage = checkForObjectKeys(
        ["animation"],
        scene.background.bg_animation
      );

      if (errorMessage) {
        throw new RequestBodyError(errorMessage);
      }

      // check that all the fields required in scene.background.src are present
      errorMessage = checkForObjectKeys(
        ["url", "type", "library", "loop_video", "mute"],
        scene.background.src
      );

      if (errorMessage) {
        throw new RequestBodyError(errorMessage);
      }

      // loop through sub_scenes and ensure all the fields are present
      scene.sub_scenes.every((sub_scene) => {
        let errorMessage = checkForObjectKeys(
          ["time", "location", "text_lines"],
          sub_scene
        );

        if (errorMessage) {
          throw new RequestBodyError(errorMessage);
        }

        errorMessage = checkForObjectKeys(
          ["start_x", "start_y"],
          sub_scene.location
        );

        if (errorMessage) {
          throw new RequestBodyError(errorMessage);
        }

        // loop through text_lines and ensure all fields are present
        sub_scene.text_lines.every((text_line) => {
          let errorMessage = checkForObjectKeys(
            ["text", "text_animation", "text_bg_animation"],
            text_line
          );

          if (errorMessage) {
            throw new RequestBodyError(errorMessage);
          }

          errorMessage = checkForObjectKeys(
            ["animation", "source", "speed", "type"],
            text_line.text_bg_animation
          );

          if (errorMessage) {
            throw new RequestBodyError(errorMessage);
          }

          // loop through every text_animation element and ensure all animation fields are present
          text_line.text_animation.every((animation) => {
            let errorMessage = checkForObjectKeys(
              ["animation", "source", "speed", "type"],
              text_line.text_bg_animation
            );

            if (errorMessage) {
              throw new RequestBodyError(errorMessage);
            }
          });
        });
      });
    });

    const { accessToken } = req.pictory;

    const { data, error, success } = await generateDownloadableVideo(
      accessToken,
      {
        video_volume: 1,
        audio_id: audioId,
        audio_library: "track",
        src: audioSrc,
        track_volume: 0.5,
        tts,
      },
      {
        description: videoDescription,
        format: "mp4",
        name: videoName,
        height: 1080,
        width: 1920,
        title: videoTitle,
      },
      scenes
    );

    if (!success) {
      throw error;
    }

    const { jobId } = data;

    return res.status(200).json({ data: jobId, error, success });
  } catch (error) {
    next(error);
  }
};

export const getVoiceOverTracksController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { accessToken } = req.pictory;

    const { data, error, success } = await getVoiceOverTracks(accessToken);

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success });
  } catch (error) {
    next(error);
  }
};
