
import React from 'react';
import DownloadIcon from './icons/DownloadIcon';
import ViewIcon from './icons/ViewIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ResultsPanelProps {
  images: string[];
  isGenerating: boolean;
  imageCount: number;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ images, isGenerating, imageCount }) => {
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadAll = () => {
    images.forEach((img, index) => {
        downloadImage(img, `outfit-result-${index + 1}.png`);
    });
  };

  const getGridCols = () => {
    if (imageCount <= 2) return 'grid-cols-1';
    return 'grid-cols-2';
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl flex flex-col h-full">
      <h2 className="text-lg font-semibold text-white mb-4">Kết quả</h2>
      <div className="flex-grow bg-gray-900 rounded-lg p-4 flex items-center justify-center min-h-[300px] lg:min-h-0">
        {isGenerating ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
             <SpinnerIcon className="w-12 h-12 text-blue-500 mb-4" />
             <p>Đang tạo ảnh, vui lòng chờ...</p>
             <p className="text-sm mt-1">Quá trình này có thể mất vài phút.</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Mô tả bối cảnh và nhấn Tạo ảnh</p>
          </div>
        ) : (
          <div className={`grid ${getGridCols()} gap-4 w-full h-full overflow-y-auto`}>
            {images.map((imgSrc, index) => (
              <div key={index} className="group relative rounded-xl overflow-hidden aspect-square">
                <img src={imgSrc} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100">
                  <button className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm">
                    <ViewIcon className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => downloadImage(imgSrc, `outfit-result-${index + 1}.png`)}
                    className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm">
                    <DownloadIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {images.length > 0 && !isGenerating && (
         <button 
         onClick={downloadAll}
         className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 disabled:bg-gray-500 transition-colors duration-300 flex items-center justify-center gap-2">
            <DownloadIcon />
            Tải tất cả
         </button>
      )}
    </div>
  );
};

export default ResultsPanel;
