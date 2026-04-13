'use client';

import { ReactNode, ClipboardEvent } from 'react';

interface ClipboardHandlerProps {
  children: ReactNode;
  onImagePasted?: (file: File) => void;
  onTextPasted?: (text: string) => void;
}

export function ClipboardHandler({ children, onImagePasted, onTextPasted }: ClipboardHandlerProps) {
  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      // 1. Если вставили картинку
      if (items[i]?.type.indexOf('image') !== -1 && onImagePasted) {
        const file = items[i]?.getAsFile();
        if (file) onImagePasted(file);
      }
      
      // 2. Если вставили текст
      if (items[i]?.type === 'text/plain' && onTextPasted) {
        const text = e.clipboardData.getData('text');
        onTextPasted(text);
      }
    }
  };

  return (
    <div onPaste={handlePaste} className="relative group">
      {children}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded border text-gray-500">
          Нажмите, затем Ctrl + V для вставки
        </span>
      </div>
    </div>
  );
}