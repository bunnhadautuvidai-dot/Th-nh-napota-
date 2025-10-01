
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import SettingsPanel from './components/SettingsPanel';
import ResultsPanel from './components/ResultsPanel';
import type { AspectRatio } from './types';
import { segmentGarment, generateOutfitImages } from './services/geminiService';

const App: React.FC = () => {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [processedGarmentImage, setProcessedGarmentImage] = useState<string | null>(null);
  const [isProcessingGarment, setIsProcessingGarment] = useState(false);

  const [prompt, setPrompt] = useState(
    "A bright and airy living room with soft, natural morning light, with a simple, modern decor and a slightly blurred background to keep the focus on the model."
  );
  const negativePrompt = "original outfit, unchanged clothes, partial transfer, keep old outfit, text, watermarks, blurry, low quality";

  const [imageCount, setImageCount] = useState(4);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  }

  const handleCharacterImageChange = useCallback(async (file: File) => {
    const base64 = await fileToBase64(file);
    setCharacterImage(base64);
  }, []);

  const handleGarmentImageChange = useCallback(async (file: File) => {
    setGarmentImage(file);
    setIsProcessingGarment(true);
    setError(null);
    setProcessedGarmentImage(null);
    try {
      const processedData = await segmentGarment(file);
      setProcessedGarmentImage(processedData);
    } catch (err) {
      console.error(err);
      setError("Failed to process garment image. Please try again.");
    } finally {
      setIsProcessingGarment(false);
    }
  }, []);

  const handleGenerate = async () => {
    if (!characterImage || !processedGarmentImage || !prompt) {
        setError("Please provide all inputs before generating.");
        return;
    }
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
        const results = await generateOutfitImages({
            characterImage,
            garmentImage: processedGarmentImage,
            prompt,
            negativePrompt,
            imageCount,
            aspectRatio
        });
        setGeneratedImages(results);
    } catch (err) {
        console.error(err);
        setError("An error occurred during image generation. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setCharacterImage(null);
    setGarmentImage(null);
    setProcessedGarmentImage(null);
    setGeneratedImages([]);
    setError(null);
    setPrompt("A bright and airy living room with soft, natural morning light, with a simple, modern decor and a slightly blurred background to keep the focus on the model.");
    setImageCount(4);
    setAspectRatio('9:16');
  };
  
  const isGenerateDisabled = !characterImage || !processedGarmentImage || !prompt;

  return (
    <div className="min-h-screen bg-[#131314] text-gray-200 font-sans p-4 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-wider">
          Sao Chép Trang Phục
        </h1>
        <p className="text-gray-400 mt-2">AI-Powered Virtual Try-On</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col md:flex-row lg:flex-col gap-8">
            <ImageUploader 
                id="character-uploader"
                title="Tải ảnh nhân vật"
                onFileChange={handleCharacterImageChange}
                previewUrl={characterImage}
                isLoading={false}
            />
            <ImageUploader 
                id="garment-uploader"
                title="Tải ảnh trang phục"
                onFileChange={handleGarmentImageChange}
                previewUrl={processedGarmentImage ? `data:image/png;base64,${processedGarmentImage}` : null}
                isLoading={isProcessingGarment}
                loadingText="Đang tách..."
            />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-4">
            <SettingsPanel 
                prompt={prompt}
                setPrompt={setPrompt}
                imageCount={imageCount}
                setImageCount={setImageCount}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
                onReset={handleReset}
                isGenerateDisabled={isGenerateDisabled}
            />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5">
            <ResultsPanel images={generatedImages} isGenerating={isGenerating} imageCount={imageCount} />
        </div>
      </main>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-800 text-white p-4 rounded-lg shadow-lg animate-pulse">
            <p><strong>Lỗi:</strong> {error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
