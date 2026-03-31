'use client';

import { useState } from 'react';
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline'; // Если используешь heroicons

export default function CopyLinkButton({ quizId }: { quizId: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Формируем полную ссылку на прохождение
    const shareUrl = `${window.location.origin}/quiz/${quizId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Сброс статуса через 2 сек
    } catch (err) {
      console.error('Ошибка при копировании:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        copied ? 'text-green-600' : 'text-gray-500 hover:text-blue-600'
      }`}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Ссылка скопирована!
        </>
      ) : (
        <>
          <LinkIcon className="w-4 h-4" />
          Копировать ссылку для прохождения
        </>
      )}
    </button>
  );
}