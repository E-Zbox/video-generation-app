import { IGenericResponse } from "../models/interfaces";

export interface IPictoryAccessToken {
  accessToken: string;
  expiresIn: number;
}

export interface IPictoryAccessTokenResponse
  extends IGenericResponse<IPictoryAccessToken> {}

export interface IScene {
  backgroundURI?: string;
  minimumDuration: number;
  splitTextOnNewLine: boolean;
  splitTextOnPeriod: boolean;
  text: string;
  voiceOver: boolean;
}

export interface IBaseVideoPayload {
  videoDescription: string;
  videoName: string;
}

export interface IBrandLogoPayload {
  url: string;
  verticalAlignment: "bottom" | "center" | "top";
  horizontalAlignment: "center" | "left" | "right";
}

export interface IStoryboardResponse
  extends IGenericResponse<{
    data: {
      jobId: string;
    };
    jobId: string;
    success: boolean;
  }> {}
