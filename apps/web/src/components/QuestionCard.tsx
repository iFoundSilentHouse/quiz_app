'use client';

import { ClipboardHandler } from './ClipboardHandler';
import { ImageUploader } from './ImageUploader';

interface QuestionProps {
  index: number;
  question: { imageUrl: string; correctAnswer: string };
  updateQuestion: (index: number, field: string, value: string) => void;
  removeQuestion: (index: number) => void;
}

export function QuestionCard({ index, question, updateQuestion, removeQuestion }: QuestionProps) {
  return (
    <div className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Вопрос {index + 1}</h3>
        <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">
          Удалить
        </button>
      </div>

      <ClipboardHandler
        onImagePasted={(file) => {
          console.log('Поймали файл:', file.name);
          // Тут логика загрузки файла на сервер или создания Preview URL
          const previewUrl = URL.createObjectURL(file);
          updateQuestion(index, 'imageUrl', previewUrl);
        }}
      >
        <div className="border-2 border-dashed p-4 rounded-lg text-center">
          {question.imageUrl ? (
            <img src={question.imageUrl} alt="Превью" className="max-h-32 mx-auto" />
          ) : (
            <p className="text-gray-400">Вставьте скопированную картинку</p>
          )}
        </div>
      </ClipboardHandler>
      <ImageUploader
        value={question.imageUrl}
        onChange={(url) => updateQuestion(index, 'imageUrl', url)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Правильный ответ (слово)</label>
        <input
          type="text"
          value={question.correctAnswer}
          onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
          placeholder="Например: apple"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}