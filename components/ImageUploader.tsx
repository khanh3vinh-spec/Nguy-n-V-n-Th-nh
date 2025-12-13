import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  image: File | null;
  onImageChange: (file: File | null) => void;
  isLocked?: boolean;
  onLockToggle?: () => void;
}

export const SingleImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, image, onImageChange, isLocked, onLockToggle 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-white font-bold">{label}</label>
        {onLockToggle && (
           <button 
             onClick={onLockToggle}
             className={`text-xs px-2 py-1 rounded font-bold ${isLocked ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}
             title="Khóa Vector khuôn mặt"
           >
             {isLocked ? 'Đã khóa mặt' : 'Khóa mặt'}
           </button>
        )}
      </div>
      
      <div 
        className="relative border-2 border-dashed border-yellow-600 bg-blue-800 rounded-lg p-2 h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {image ? (
          <div className="relative h-full w-full">
            <img 
              src={URL.createObjectURL(image)} 
              alt="Preview" 
              className="h-full w-full object-contain rounded" 
            />
            <button 
              onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
            >
              X
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-300">
            <p className="text-sm">Kéo thả hoặc nhấn để tải ảnh</p>
            <span className="text-3xl">+</span>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};

interface MultiImageUploaderProps {
  label: string;
  images: File[];
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  isLocked?: boolean;
  onLockToggle?: () => void;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  label, images, onImagesChange, maxImages = 5, isLocked, onLockToggle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combined = [...images, ...newFiles].slice(0, maxImages);
      onImagesChange(combined);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-white font-bold">{label} ({images.length}/{maxImages})</label>
        {onLockToggle && (
           <button 
             onClick={onLockToggle}
             className={`text-xs px-2 py-1 rounded font-bold ${isLocked ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}
             title="Khóa Vector khuôn mặt"
           >
             {isLocked ? 'Đã khóa mặt' : 'Khóa mặt'}
           </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-20 bg-blue-800 border border-yellow-600 rounded">
            <img src={URL.createObjectURL(img)} className="h-full w-full object-cover rounded" alt={`Ref ${idx}`} />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
            >
              X
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <div 
            className="h-20 border-2 border-dashed border-yellow-600 bg-blue-800 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-yellow-500 text-xl font-bold">+</span>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange} 
      />
    </div>
  );
};