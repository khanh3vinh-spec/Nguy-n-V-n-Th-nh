import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Helper to convert File to Base64
export const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface GenerateParams {
  sourceImage: File | null;
  refImages: File[];
  isSourceFaceLock: boolean;
  conceptPrompt: string;
  anglePrompt: string;
  ratio: AspectRatio;
  details: string;
}

const extractImage = (response: any): string => {
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
       if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
  }
  throw new Error("No image generated.");
};

export const generateImage = async (params: GenerateParams): Promise<string> => {
  // Use the latest key from process.env which is updated after window.aistudio.openSelectKey()
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key not found. Please select an API Key from the welcome screen.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const parts: any[] = [];

  // 1. Add Source Image
  if (params.sourceImage) {
    const sourcePart = await fileToPart(params.sourceImage);
    parts.push(sourcePart);
  }

  // 2. Add Reference Images
  for (const file of params.refImages) {
    const refPart = await fileToPart(file);
    parts.push(refPart);
  }

  // 3. Construct the prompt
  let promptText = `Generate a high-quality, photorealistic image. 
  
  Concept: ${params.conceptPrompt}.
  Camera Angle: ${params.anglePrompt}.
  Additional Details: ${params.details}.
  `;

  if (params.sourceImage && params.isSourceFaceLock) {
    promptText += `\nIMPORTANT: Use the first image provided as the PRIMARY SUBJECT. You MUST preserve the facial features, identity, and likeness of the person in the first image exactly. The generated person must look exactly like the person in the source image. `;
  } else if (params.sourceImage) {
      promptText += `\nUse the first image as a visual reference for the character. `;
  }

  if (params.refImages.length > 0) {
      promptText += `\nUse the other provided images as style or atmospheric references. `;
  }
  
  // Clean up prompt
  promptText = promptText.trim();
  
  // Add text part
  parts.push({ text: promptText });

  // Helper function to call API
  const callApi = async (modelName: string, isPro: boolean) => {
    const config: any = {
      imageConfig: {
        aspectRatio: params.ratio,
      }
    };
    // Only Pro model supports imageSize
    if (isPro) {
      config.imageConfig.imageSize = "1K";
    }

    return await ai.models.generateContent({
      model: modelName,
      contents: { parts: parts },
      config: config
    });
  };

  try {
    try {
      // Attempt 1: High Quality Pro Model
      const response = await callApi("gemini-3-pro-image-preview", true);
      return extractImage(response);
    } catch (proError: any) {
      // Check for Permission Denied (403)
      const errorStr = JSON.stringify(proError);
      const isPermissionError = proError.message?.includes("403") || 
                                proError.message?.includes("PERMISSION_DENIED") || 
                                errorStr.includes("PERMISSION_DENIED");
      
      if (isPermissionError) {
        console.warn("Gemini 3 Pro permission denied (403). Falling back to Gemini 2.5 Flash Image.");
        // Attempt 2: Fallback to Flash Model
        const response = await callApi("gemini-2.5-flash-image", false);
        return extractImage(response);
      }
      
      // If it's another error, rethrow it
      throw proError;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};