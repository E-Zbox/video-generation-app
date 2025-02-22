// interfaces
import {
  IBaseVideoPayload,
  IBrandLogoPayload,
  IPictoryAccessTokenResponse,
  IScene,
  IStoryboardResponse,
} from "./interface";
import { IPictoryTokenResponse } from "../models/interfaces/pictoryToken";
// ../models
import {
  createPictoryToken,
  getPictoryToken,
  updatePictoryToken,
} from "../models/pictoryToken";
import { IGenericResponse } from "../models/interfaces";

const {
  LIVE_API_BASE_URL,
  PICTORY_BASE_URL,
  PICTORY_CLIENT_ID,
  PICTORY_CLIENT_SECRET,
  PICTORY_USER_ID,
} = process.env;

const createAccessToken = async (): Promise<IPictoryAccessTokenResponse> => {
  let response: IPictoryAccessTokenResponse = {
    data: {
      accessToken: "",
      expiresIn: 0,
    },
    error: "",
    success: false,
  };

  try {
    const result = await fetch(`${PICTORY_BASE_URL}/oauth2/token`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: PICTORY_CLIENT_ID,
        client_secret: PICTORY_CLIENT_SECRET,
      }),
      method: "POST",
    });

    const data = await result.json();

    if (data.code) {
      console.log(data);
      throw data.message;
    }

    const { access_token: accessToken, expires_in: expiresIn } = data;

    response = {
      data: {
        accessToken,
        expiresIn,
      },
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

export const generatePictoryToken =
  async (): Promise<IPictoryTokenResponse> => {
    let response: IPictoryTokenResponse = {
      data: {
        accessToken: "",
        expiresIn: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      error: "",
      success: false,
    };

    try {
      // check if token exists
      const tokenExists = await getPictoryToken();

      if (tokenExists.success) {
        const ONE_MINUTE = 60 * 1000;

        // check if has expired
        const expiryTime =
          Number(tokenExists.data.updatedAt) + tokenExists.data.expiresIn;
        if (Date.now() > expiryTime - ONE_MINUTE) {
          const {
            data: { accessToken, expiresIn },
            error,
            success,
          } = await createAccessToken();

          if (!success) {
            throw error;
          }

          response = await updatePictoryToken(
            { _id: tokenExists.data._id! },
            { accessToken, expiresIn: expiresIn * 1000 }
          );
        } else {
          response = tokenExists;
        }
      } else {
        if (tokenExists.error.includes("MongooseError")) {
          throw tokenExists.error;
        }

        const newAccessToken = await createAccessToken();

        if (!newAccessToken.success) {
          throw newAccessToken.error;
        }

        console.log("newAccessToken");
        console.log(newAccessToken);

        const { accessToken, expiresIn } = newAccessToken.data;

        response = await createPictoryToken({
          accessToken,
          expiresIn: expiresIn * 1000,
        });
      }
    } catch (error) {
      response = {
        ...response,
        error: `${error}`,
      };
    } finally {
      return response;
    }
  };

export const generateVideo = async (
  accessToken: string,
  { videoName, videoDescription }: IBaseVideoPayload,
  scenes: IScene[],
  brandLogo: IBrandLogoPayload,
  speaker = "Ivy (child)",
  speed = "100"
): Promise<IStoryboardResponse> => {
  let response: IStoryboardResponse = {
    data: {
      data: {
        jobId: "",
      },
      jobId: "",
      success: false,
    },
    error: "",
    success: false,
  };

  try {
    const result = await fetch(`${PICTORY_BASE_URL}/video/storyboard`, {
      headers: {
        Accept: "application/json",
        Authorization: accessToken,
        "Content-Type": "application/json",
        "X-Pictory-User-Id": PICTORY_USER_ID!,
      },
      body: JSON.stringify({
        audio: {
          aiVoiceOver: {
            speaker: speaker,
            speed: speed,
            amplifyLevel: "1",
          },
          autoBackgroundMusic: true,
          backGroundMusicVolume: 0.5,
        },
        brandLogo: brandLogo,
        videoName: videoName,
        videoDescription: videoDescription,
        language: "en",
        videoWidth: "1080",
        videoHeight: "1920",
        scenes: scenes,
        // scenes: [
        //   {
        //     minimumDuration: 120, // probably in seconds
        //     text: "Young Caius was obsessed with maps.  He spent hours poring over ancient charts, dreaming of exploring the uncharted territories beyond his village.  He longed to create his own map, a true representation of the world as he saw it. But Caius was plagued by fear.  He was afraid of the unknown, afraid of failure, afraid of what others might think.  He confided in his grandfather, a seasoned traveler.  'How did you overcome your fear?' Caius asked. His grandfather chuckled.  'Fear never truly goes away, Caius,' he said.  'But you can choose what you do with it.  You can let it paralyze you, or you can use it as fuel.  I chose the latter.' Caius took his grandfather's words to heart.  He started small, mapping the fields around his village, then the nearby forest.  Each step was challenging, filled with doubts and setbacks.  He got lost, made mistakes, and faced criticism from those who didn't understand his passion. But Caius persevered.  He learned from his mistakes, sought advice from experienced cartographers, and slowly, painstakingly, expanded his map.  Years passed, and Caius's map grew, encompassing vast regions, detailed coastlines, and intricate mountain ranges.  It wasn't just a map; it was a testament to his courage, his dedication, and his unwavering pursuit of his dream. Caius's map became renowned throughout the land.  It wasn't just a geographical representation, but an inspiration to others, a symbol of what could be achieved when one dared to overcome fear and follow their passion.",
        //     voiceOver: true,
        //     splitTextOnNewLine: true,
        //     splitTextOnPeriod: true,
        //   },
        // ],
        webhook: `${LIVE_API_BASE_URL}/pictory/webhook`,
      }),
      method: "POST",
    });

    const data = await result.json();

    if (!data.success) {
      console.log(data);
      throw new Error("Some error occurred while generating video!");
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

export const monitorVideoStatus = async (
  accessToken: string,
  jobId: string
): Promise<IGenericResponse<any>> => {
  let response: IGenericResponse<any> = {
    data: "in-progress",
    error: "",
    success: false,
  };

  try {
    const result = await fetch(`${PICTORY_BASE_URL}/jobs/${jobId}`, {
      headers: {
        Accept: "application/json",
        Authorization: accessToken,
        "Content-Type": "application/json",
        "X-Pictory-User-Id": PICTORY_USER_ID!,
      },
      method: "GET",
    });

    const _result = await result.json();

    const { data, success } = _result;

    if (!success) {
      if (data.error_message == "JOB_NOT_FOUND") {
        throw new Error("Job not found!");
      }

      throw data.error_message;
    }

    response = {
      data, // check if data is string (in-progress) or object
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

export const getVoiceOverTracks = async () => {};
