import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs-extra";
import path from "path";
import { promisify } from "util";
// interfaces
import { IStringResponse, IStringsResponse } from "../models/interfaces";

const ensureDir = promisify(fs.ensureDir);
const readFile = promisify(fs.readFile);
const unlinkFile = promisify(fs.unlink);

// configure ffmpeg to use the installed path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const trimVideo = async (
  videoUrl: string,
  startTimeInSeconds: number,
  offsetInSeconds: number
): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
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
    response.data = await readFileAsBase64(outputPath);
    response.success = true;

    // Clean up the temporary file
    await unlinkFile(outputPath).catch(() => {
      // Silent catch - file cleanup errors shouldn't affect the overall result
      console.warn(`Failed to delete temporary file: ${outputPath}`);
    });
  } catch (error) {
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
