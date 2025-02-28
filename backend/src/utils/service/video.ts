import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs-extra";
import path from "path";
import { promisify } from "util";
// interfaces
import {
  IStringResponse,
  IStringsResponse,
  IThumbnail,
  IThumbnailsResponse,
} from "../models/interfaces";

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

    maxThumbnails = Math.min(maxThumbnails, 50);

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

/*
  export const generateThumbnailsFromVideo = async (
  ffmpeg: FFmpeg,
  videoFile: string | File,
  duration: number
): Promise<IThumbnailsResponse> => {
  let response: IThumbnailsResponse = {
    data: [],
    error: "",
    success: false,
  };
  try {
    console.log("start of thumbnails generation from video");
    console.log(await ffmpeg.listDir("/"));
    console.log({ videoFile, duration });
    const videoFileName =
      typeof videoFile == "string"
        ? `video-${Math.random()}-${Date.now()}.mp4`
        : videoFile.name;

    // let's file to ffmpeg.wasm
    let writeFile = await ffmpeg.writeFile(
      videoFileName,
      await fetchFile(videoFile)
    );

    let MAX_NUMBER_OF_IMAGES = 20;

    let NUMBER_OF_IMAGES = Math.min(duration, MAX_NUMBER_OF_IMAGES);

    // let offset = duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;
    let offset = duration / NUMBER_OF_IMAGES;

    const arrayOfImageURIs: IThumbnail[] = [];

    console.log({ NUMBER_OF_IMAGES, offset, duration, MAX_NUMBER_OF_IMAGES });

    for (let index = 0; index < NUMBER_OF_IMAGES; index++) {
      let startTimeInSeconds = Math.round(index * offset);

      if (startTimeInSeconds + offset > duration && offset > 1) {
        console.log("something happened here");
        console.log({ startTimeInSeconds, offset, duration });
        offset = 0;
      }

      const filename = `img-${Math.random()}-${Date.now()}.png`;

      ffmpeg
        .exec([
          "-threads",
          "1", // use only one thread
          "-ss",
          timeFormatter(startTimeInSeconds),
          "-i",
          videoFileName,
          "-t",
          "00:00:01",
          "-vf",
          "scale=150:-1",
          "-frames:v",
          "1", // extract only one frame
          "-q:v",
          "2", // lower quality, less memory usage
          filename,
        ])
        .then((res) => {
          console.log({ res, index });
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      const data = await ffmpeg.readFile(filename);

      if (data instanceof Uint8Array) {
        let blob = new Blob([data.buffer as BlobPart], {
          type: "image/png",
        });

        let src: string = await readFileAsBase64(blob);

        arrayOfImageURIs.push({ src, startTimeInSeconds });
      }

      await ffmpeg.deleteFile(filename);

      console.log(`${index} / ${NUMBER_OF_IMAGES}`);
    }

    response = {
      data: arrayOfImageURIs,
      error: "",
      success: true,
    };

    await ffmpeg.deleteFile(videoFileName);
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};
*/
