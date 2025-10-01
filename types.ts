
export type AspectRatio = "1:1" | "9:16" | "16:9";

export interface GenerationParams {
  characterImage: string;
  garmentImage: string;
  prompt: string;
  negativePrompt: string;
  imageCount: number;
  aspectRatio: AspectRatio;
}
