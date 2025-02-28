import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
// ./
import { readFileAsBase64, timeFormatter } from "./transformer";
// interfaces
import { IStringResponse, IThumbnailsResponse } from "@/api/interfaces/video";
import { IThumbnail } from "../screens/interface";

export const extractImageFromVideo = async (
  ffmpeg: FFmpeg,
  videoFile: string | File,
  startTimeInSeconds: number,
  duration: string = "00:00:01"
): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };

  try {
    const videoFileName =
      typeof videoFile == "string"
        ? `video-${Math.random()}-${Date.now()}.mp4`
        : videoFile.name;

    // let's file to ffmpeg.wasm
    let writeFile = await ffmpeg.writeFile(
      videoFileName,
      await fetchFile(videoFile)
    );

    const filename = `img-${Math.random()}-${Date.now()}.png`;

    let execSignal = await ffmpeg.exec([
      "-threads",
      "1", // use only one thread
      "-ss",
      timeFormatter(startTimeInSeconds),
      "-i",
      videoFileName,
      "-t",
      duration,
      "-vf",
      "scale=150:-1",
      "-frames:v",
      "1", // extract only one frame
      "-q:v",
      "2", // lower quality, less memory usage
      filename,
    ]);

    const data = await ffmpeg.readFile(filename);

    if (data instanceof Uint8Array) {
      let blob = new Blob([data.buffer as BlobPart], {
        type: "image/png",
      });

      let src: string = await readFileAsBase64(blob);

      response = {
        data: src,
        error: "",
        success: true,
      };
    }

    await ffmpeg.deleteFile(filename);

    await ffmpeg.deleteFile(videoFileName);
  } catch (error) {
    console.log(error);
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

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

export const trimVideo = async (
  ffmpeg: FFmpeg,
  videoFile: string | File,
  startTime: number,
  offset: number
): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };

  try {
    const videoFileName =
      typeof videoFile == "string"
        ? `video-${Math.random()}-${Date.now()}.mp4`
        : videoFile.name;

    // let's file to ffmpeg.wasm
    await ffmpeg.writeFile(videoFileName, await fetchFile(videoFile));

    const trimmedVideoFilename = `trimmed-${videoFileName}.mp4`;

    await ffmpeg.exec([
      "-threads",
      "1", // use only one thread
      "-ss",
      timeFormatter(startTime),
      "-i",
      videoFileName,
      "-t",
      timeFormatter(offset),
      "-c:v",
      "copy",
      trimmedVideoFilename,
    ]);

    const data = await ffmpeg.readFile(trimmedVideoFilename);

    if (data instanceof Uint8Array) {
      const dataURL = await readFileAsBase64(
        new Blob([data.buffer as BlobPart], { type: "video/mp4" })
      );

      response = {
        data: dataURL,
        error: "",
        success: true,
      };
    }

    await ffmpeg.deleteFile(trimmedVideoFilename);

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
