import { IGenericResponse } from ".";
// models
import { IMedia } from "@/models/Media";

export interface ICreateMediaPayload {
  mimetype: string;
  path: string;
  publicId: string;
}

export interface IMediaResponse extends IGenericResponse<IMedia> {}
