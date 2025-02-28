import { IGenericResponse } from ".";

export interface ICreateMediaPayload {
  media: File;
}

export interface IMedia {
  _id: string;
  mimetype: string;
  path: string;
  publicId: string;
  createdAt: "";
  updatedAt: "";
}

export interface IMediaResponse extends IGenericResponse<IMedia> {}
