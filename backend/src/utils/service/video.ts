import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs-extra";
import path from "path";
import { promisify } from "util";
// interfaces
import { ITrimVideoResponse } from "./interface";
import {
  IStringResponse,
  IThumbnail,
  IThumbnailsResponse,
} from "../models/interfaces";
// utils/models
import { createMedia } from "../models/media";
import { uploadToCloudinary } from "../api/cloudinary";
import cloudinary from "@/config/cloudinary";

const ensureDir = promisify(fs.ensureDir);
const readFile = promisify(fs.readFile);
const unlinkFile = promisify(fs.unlink);

// configure ffmpeg to use the installed path
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const generateThumbnails = async (
  videoUrl: string,
  duration: number,
  maxThumbnails: number
): Promise<IThumbnailsResponse> => {
  let response: IThumbnailsResponse = {
    data: [],
    error: "",
    success: false,
  };

  const outputDir = path.join(__dirname, "../../../output/generate-thumbnail");

  try {
    await ensureDir(outputDir);

    maxThumbnails = Math.min(duration, maxThumbnails);

    let offset = duration / maxThumbnails;

    const data: IThumbnail[] = [];

    for (let index = 0; index < maxThumbnails; index++) {
      let startTimeInSeconds = index * offset;
      let filename = `thumbnail-${Math.random()}-${Date.now()}.png`;
      let outputPath = path.join(outputDir, filename);

      // Convert ffmpeg processing to Promise
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoUrl)
          .screenshot({
            count: 1,
            filename,
            folder: outputDir,
            timemarks: [startTimeInSeconds],
            size: "150x?", // 150px width, height auto
            fastSeek: true, // for better performance
          })
          .on("end", () => resolve())
          .on("error", (err) => reject(err));
      });

      let src = await readFileAsBase64(outputPath);

      data.push({ src: `data:image/png;base64,${src}`, startTimeInSeconds });

      // Clean up the temporary file
      await unlinkFile(outputPath).catch(() => {
        // Silent catch - file cleanup errors shouldn't affect the overall result
        console.warn(`Failed to delete temporary file: ${outputPath}`);
      });
    }

    response = {
      data,
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

export const trimVideo = async (
  videoUrl: string,
  startTimeInSeconds: number,
  offsetInSeconds: number
): Promise<ITrimVideoResponse> => {
  let response: ITrimVideoResponse = {
    data: {
      base64: "",
      createdAt: new Date(),
      mimetype: "",
      path: "",
      publicId: "",
      updatedAt: new Date(),
    },
    error: "",
    success: false,
  };

  const outputDir = path.join(__dirname, "../../../output/trim-video");

  try {
    await ensureDir(outputDir);
    const outputFileName = `trimmed-${Date.now()}.mp4`;

    const outputPath = path.join(outputDir, outputFileName);

    // Convert ffmpeg processing to Promise
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoUrl)
        .noAudio()
        .setStartTime(startTimeInSeconds)
        .setDuration(offsetInSeconds)
        .outputOptions([
          "-threads 1", // Use only one thread
          "-c:v copy", // Copy video codec without re-encoding
        ])
        .output(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });

    // Read the file as base64 after ffmpeg has finished
    const base64 = await readFileAsBase64(outputPath);

    // upload to cloudinary and upload
    const cloudinaryResponse = await uploadToCloudinary(outputPath);

    if (!cloudinaryResponse.success) {
      throw cloudinaryResponse.error;
    }

    // in case Media upload fails, we want to delete the uploaded trimmed video from cloudinary
    response.data.publicId = cloudinaryResponse.data.publicId;

    const newMediaResponse = await createMedia([
      { ...cloudinaryResponse.data },
    ]);

    if (!newMediaResponse.success) {
      throw newMediaResponse.error;
    }

    response = {
      data: {
        ...newMediaResponse.data[0],
        base64: `data:video/mp4;base64,${base64}`,
      },
      error: "",
      success: true,
    };

    // Clean up the temporary file
    await unlinkFile(outputPath).catch(() => {
      // Silent catch - file cleanup errors shouldn't affect the overall result
      console.warn(`Failed to delete temporary file: ${outputPath}`);
    });
  } catch (error) {
    const { publicId } = response.data;
    if (publicId.length) {
      await cloudinary.api.delete_resources([publicId]);
    }
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

export const readFileAsBase64 = async (filename: string): Promise<string> => {
  const binaryData = await readFile(filename);

  return Buffer.from(binaryData).toString("base64");
};
