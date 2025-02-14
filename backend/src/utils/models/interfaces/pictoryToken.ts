import { IGenericResponse } from ".";
// models
import { IPictoryToken } from "@/models/PictoryToken";

export interface ICreatePictoryTokenPayload {
  accessToken: string;
  expiresIn: number;
}

export interface IPictoryTokenResponse
  extends IGenericResponse<IPictoryToken> {}
