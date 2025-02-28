import { IGenericResponse } from ".";

export interface IVoiceOverTrack {
  category: string;
  gender: string;
  id: number;
  language: string;
  name: string;
  sample: string;
}

export interface IVoiceOverTrackResponse
  extends IGenericResponse<IVoiceOverTrack[]> {}
