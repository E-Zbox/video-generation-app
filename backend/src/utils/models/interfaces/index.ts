import { Types } from "mongoose";

export interface IGenericResponse<T> {
  data: T;
  error: string;
  success: boolean;
}

export interface IIDPayload {
  _id: Types.ObjectId;
}

export interface IRecord {
  [name: string]: any;
}
