'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await api.uploadImage(file);
      onChange(imageUrl);
    } catch (error) {
      console.error('Failed to upload image', error);
      alert('Ошибка при загрузке картинки');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 relative overflow-hidden">
      {value ? (
        <img src={value} alt="Preview" className="object-contain w-full h-full" />
      ) : (
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Нажмите для загрузки</span></p>
        </div>
      )}
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={handleFileChange}
        disabled={isUploading}
        accept="image/*"
      />
      {isUploading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <span className="text-sm font-bold text-blue-600">Загрузка...</span>
        </div>
      )}
    </div>
  );
}