// interfaces/
import { IRecord } from "../models/interfaces";

export const checkForObjectKeys = (
  expectedKeys: string[],
  object: IRecord
): string => {
  let errorMessage = "";
  const objectKeys = Object.getOwnPropertyNames(object);
  const objectKeysLength = objectKeys.length;

  expectedKeys.forEach((key, index) => {
    if (!objectKeys.includes(key)) {
      errorMessage = `${errorMessage}\`${key}\` property is required.${
        index !== objectKeysLength - 1 ? " " : ""
      }`;
    }
  });

  return errorMessage;
};

export const checkIsValidEmail = async (email: string): Promise<boolean> => {
  const { ABSTRACTAPI_API_KEY } = process.env;

  const result = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACTAPI_API_KEY!}&email=${email}`
  );

  const response = await result.json();

  return response.is_smtp_valid.value;
};
