import { instance } from ".";
// interfaces
import { IVoiceOverTrackResponse } from "../interfaces/voiceover";

export const getVoiceOverTracks =
  async (): Promise<IVoiceOverTrackResponse> => {
    let response: IVoiceOverTrackResponse = {
      data: [],
      error: "",
      success: false,
    };

    try {
      const result = await instance.get("/user/voiceovers");

      const { data } = result;

      response = {
        ...data,
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
