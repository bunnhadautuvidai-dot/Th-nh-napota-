
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerationParams } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const base64ToGenerativePart = (base64Data: string, mimeType: string = 'image/png') => {
    return {
        inlineData: { data: base64Data, mimeType }
    };
};

export const segmentGarment = async (imageFile: File): Promise<string> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const promptPart = {
    text: `Segment the main garment worn by the person in this image. Return an image showing only the segmented garment, perfectly centered on a pure white (#FFFFFF) background. The output image must have a 9:16 aspect ratio, with the garment scaled to fit inside without being cropped.`,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts: [imagePart, promptPart] },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  
  throw new Error("Could not segment garment from image.");
};

export const generateOutfitImages = async (params: GenerationParams): Promise<string[]> => {
  const characterImagePart = base64ToGenerativePart(params.characterImage.split(',')[1]);
  const garmentImagePart = base64ToGenerativePart(params.garmentImage);

  const fullPrompt = `
    Nhiệm vụ: Tạo ảnh nhân vật mặc TRANG PHỤC MỚI từ ảnh "Nhân vật" và ảnh "Trang phục".
    
    Ràng buộc thay trang phục:
    - BẮT BUỘC thay toàn bộ trang phục của người mẫu trong ảnh "Nhân vật" bằng trang phục trong ảnh "Trang phục".
    - KHÔNG được giữ lại, tái sử dụng hay pha trộn bất kỳ chi tiết nào của trang phục ban đầu.
    - Negative prompt: ${params.negativePrompt}
    
    Bố cục & khung hình:
    - Tỷ lệ ảnh: ${params.aspectRatio}, kích thước 2160x3840 px (portrait).
    - Nhân vật đứng ở trung tâm khung hình.
    - Đầu nhân vật cách mép trên ~15% chiều cao ảnh (headroom ≈ 15%).
    
    Chất lượng hình ảnh:
    - High resolution, ultra sharp, detailed face, clean skin texture, crisp garment edges and fabric textures.
    - Ánh sáng dịu, trong trẻo.
    - Nền: ${params.prompt}
    
    Xử lý sau (enhancement):
    - Face enhancement & detail refine.
    - Edge enhancement cho viền trang phục.
    - Apply mild sharpening + super-resolution.
  `;

  const generationPromises: Promise<string>[] = [];

  for (let i = 0; i < params.imageCount; i++) {
    generationPromises.push(
      (async () => {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [characterImagePart, garmentImagePart, { text: fullPrompt }] },
            config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
          });

          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
          }
          throw new Error(`Image generation failed for image ${i + 1}.`);
      })()
    );
  }

  return Promise.all(generationPromises);
};
