import OpenAI from "openai";
// interfaces
import { IGenericResponse } from "../models/interfaces";

const { HF_ACCESS_TOKEN, HF_BASE_URL } = process.env;

const client = new OpenAI({
  apiKey: HF_ACCESS_TOKEN,
  baseURL: HF_BASE_URL,
});

export const expandText = async (text: string) => {
  let response: IGenericResponse<any> = {
    data: "",
    error: "",
    success: false,
  };

  try {
    const result = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: text,
        },
        {
          role: "assistant",
          content: `Expand the text to a story. Don't suggest any further prompt and get straight to the story`,
        },
      ],
      model: "google/gemma-2-2b-it",
    });

    if (!result.choices[0].message.content) {
      throw new Error("No content generated. Please try a different query");
    }

    response = {
      data: result.choices[0].message.content!,
      error: "",
      success: true,
    };
  } catch (error) {
    console.log(error);
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};
