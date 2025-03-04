import { GoogleGenerativeAI } from "@google/generative-ai";
import { IStringResponse } from "../models/interfaces";

const { GEMINI_API_KEY } = process.env;

const googleGenAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

export const expandText = async (text: string): Promise<IStringResponse> => {
  let response: IStringResponse = {
    data: "",
    error: "",
    success: false,
  };

  try {
    const model = googleGenAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
      systemInstruction: `Expand the text to a story. Don't suggest any further prompt and get straight to the story`,
    });

    const data = result.response.text();

    response = {
      data,
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
