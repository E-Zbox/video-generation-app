// interfaces
import { IGenericResponse } from "../models/interfaces";
// models
import { IMedia } from "@/models/Media";

export interface ITrimVideo extends IMedia {
  base64: string;
}

export interface ITrimVideoResponse extends IGenericResponse<ITrimVideo> {}
