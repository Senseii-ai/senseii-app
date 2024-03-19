import OpenAI from "openai";
import { Response } from "express";
import { IAuthRequest } from "../middlewares/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = async (req: IAuthRequest, res: Response) => {
  try {
    console.log(" I was executed")
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
      ],
      model: "gpt-4-turbo-preview",
    });

    console.log(completion.choices[0]);
    return res
      .status(200)
      .json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
