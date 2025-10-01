
import React from 'react';
import type { AspectRatio } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';

interface SettingsPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  imageCount: number;
  setImageCount: (count: number) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onReset: () => void;
  isGenerateDisabled: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  prompt,
  setPrompt,
  imageCount,
  setImageCount,
  aspectRatio,
  setAspectRatio,
  isGenerating,
  onGenerate,
  onReset,
  isGenerateDisabled,
}) => {
  const aspectRatios: AspectRatio[] = ["1:1", "9:16", "16:9"];

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl flex flex-col space-y-6 h-full">
      <div className="flex flex-col space-y-2">
        <label htmlFor="prompt" className="text-gray-300 font-medium text-sm">Tóm Tắt Sáng Tạo</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Bối cảnh người mẫu đang ở view phòng khách sáng sớm màu nhẹ nhàng… The image must be high resolution, ultra sharp, with a detailed face, aspect ratio 9:16 (2160×3840 px)."
          className="w-full h-48 bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 resize-none text-sm"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="imageCount" className="text-gray-300 font-medium text-sm">Cài Đặt Đầu Ra</label>
        <select
          id="imageCount"
          value={imageCount}
          onChange={(e) => setImageCount(Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        >
          <option value={1}>1 ảnh</option>
          <option value={2}>2 ảnh</option>
          <option value={4}>4 ảnh</option>
          <option value={8}>8 ảnh</option>
        </select>
      </div>

      <div className="flex flex-col space-y-2">
         <label className="text-gray-300 font-medium text-sm">Tỷ lệ khung hình</label>
        <div className="grid grid-cols-3 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`py-2 px-4 rounded-lg transition-colors duration-300 ${
                aspectRatio === ratio
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-grow"></div>

      {isGenerateDisabled && !isGenerating && (
         <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md">
            Vui lòng tải ảnh và nhập mô tả để tạo ảnh.
        </p>
      )}

      <div className="flex flex-col space-y-3">
        <button
          onClick={onGenerate}
          disabled={isGenerating || isGenerateDisabled}
          className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          {isGenerating ? <SpinnerIcon className="w-6 h-6" /> : "Tạo lại"}
        </button>
        <button
          onClick={onReset}
          disabled={isGenerating}
          className="w-full bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Làm lại từ đầu
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
