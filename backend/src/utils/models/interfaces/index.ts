import { Types } from "mongoose";

export interface IGenericResponse<T> {
  data: T;
  error: string;
  success: boolean;
}

export interface IIDPayload {
  _id: Types.ObjectId;
}

export interface INumberResponse extends IGenericResponse<number> {}

export interface IStringResponse extends IGenericResponse<string> {}

export interface IStringsResponse extends IGenericResponse<string[]> {}

export interface IThumbnail {
  src: string;
  startTime: number;
}

export interface IThumbnailsResponse extends IGenericResponse<IThumbnail[]> {}

export interface IRecord {
  [name: string]: any;
}
