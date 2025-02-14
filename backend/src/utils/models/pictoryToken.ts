// errors
import { PictoryTokenError } from "../errors";
// interfaces
import { IIDPayload } from "./interfaces";
import {
  ICreatePictoryTokenPayload,
  IPictoryTokenResponse,
} from "./interfaces/pictoryToken";
// models
import PictoryToken from "@/models/PictoryToken";

export const createPictoryToken = async (
  payload: ICreatePictoryTokenPayload
): Promise<IPictoryTokenResponse> => {
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
    const result = await PictoryToken.create(payload);

    if (!result) {
      throw new PictoryTokenError("PictoryToken creation failed!");
    }

    const { _id, accessToken, expiresIn, createdAt, updatedAt } = result;

    response = {
      data: { _id, accessToken, expiresIn, createdAt, updatedAt },
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

export const getPictoryToken = async (): Promise<IPictoryTokenResponse> => {
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
    const result = await PictoryToken.find({});

    if (result.length == 0) {
      throw new PictoryTokenError("PictoryToken is missing in database!");
    }

    const { _id, accessToken, expiresIn, createdAt, updatedAt } = result[0];

    response = {
      data: { _id, accessToken, expiresIn, createdAt, updatedAt },
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

export const updatePictoryToken = async (
  { _id }: IIDPayload,
  updatePayload: ICreatePictoryTokenPayload
): Promise<IPictoryTokenResponse> => {
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
    const result = await PictoryToken.findOneAndUpdate(
      { _id },
      { ...updatePayload },
      { new: true }
    );

    if (!result) {
      throw new PictoryTokenError("PictoryToken update failed!");
    }

    const { accessToken, expiresIn, createdAt, updatedAt } = result;

    response = {
      data: { _id, accessToken, expiresIn, createdAt, updatedAt },
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
