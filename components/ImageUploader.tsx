
import React, { useState, useCallback, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ImageUploaderProps {
  id: string;
  title: string;
  onFileChange: (file: File) => void;
  previewUrl: string | null;
  isLoading: boolean;
  loadingText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  onFileChange,
  previewUrl,
  isLoading,
  loadingText = "Đang xử lý...",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null | undefined) => {
    if (file && ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      onFileChange(file);
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const baseBorder = 'border-2 border-dashed rounded-xl transition-colors duration-300';
  const borderColor = isDragging ? 'border-blue-500' : 'border-gray-600';

  return (
    <div className="w-full flex flex-col space-y-2">
      <label htmlFor={id} className="text-gray-300 font-medium text-sm">{title}</label>
      <div
        className={`${baseBorder} ${borderColor} bg-gray-900 aspect-[9/16] flex items-center justify-center p-2 relative cursor-pointer`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleChange}
          ref={fileInputRef}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 rounded-xl">
            <SpinnerIcon className="w-8 h-8 text-blue-400" />
            <p className="mt-2 text-sm text-gray-300">{loadingText}</p>
          </div>
        )}
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="object-contain w-full h-full rounded-lg" />
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">Kéo & thả hoặc nhấn để tải ảnh</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
