
import { GoogleGenAI, Type } from "@google/genai";
import { Task, SubTask } from "./types";

// Always use a named parameter and process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const breakdownTask = async (taskTitle: string): Promise<SubTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following productivity task into 3-5 actionable sub-steps. Assign a point value (10-50) to each based on difficulty. Task: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.NUMBER }
            },
            required: ["title", "points"]
          }
        }
      }
    });

    // Access the .text property directly (do not call as a method).
    const data = JSON.parse(response.text || '[]');
    return data.map((item: any, index: number) => ({
      id: `sub-${Date.now()}-${index}`,
      title: item.title,
      points: item.points,
      completed: false
    }));
  } catch (error) {
    console.error("Error breaking down task:", error);
    return [];
  }
};

export const getCoachAdvice = async (points: number, height: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a motivational Mountain Climbing Coach. A user has ${points} focus points and has climbed ${height} meters today. Give a short, punchy, climbing-themed motivational quote or advice (max 20 words).`,
    });
    // Access the .text property directly.
    return response.text || "Keep climbing, the view is better at the top!";
  } catch (error) {
    return "The summit is within reach!";
  }
};
