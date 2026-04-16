'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AttemptWithResultsDto } from '@spell/shared';
import { DiffHighlight } from '@/components/DiffHighlight';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const [result, setResult] = useState<AttemptWithResultsDto | null>(null);

  useEffect(() => {
    if (attemptId) api.get(`/attempts/${attemptId}`).then(setResult);
  }, [attemptId]);

  if (!result) return <div className="p-8 text-center text-gray-500">Loading results...</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-900">Your result</h1>
        <div className="text-6xl font-bold text-blue-600">
          {result.score} <span className="text-2xl text-gray-400">/ {result.results.length}</span>
        </div>
        <p className="text-gray-500 italic">Completed by: {result.studentName}</p>
      </div>

      <div className="space-y-6">
        {result.results.map((ans, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center">
            <span className="text-xl font-bold text-gray-900">Question {idx + 1}:</span>
            {ans.imageUrl && (
              <img
                src={ans.imageUrl}
                className="w-32 h-32 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                alt={`Question ${idx + 1}`}
              />
            )}
            <div className="flex-grow space-y-3">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Your answer:</span>
                <DiffHighlight diff={ans.diff} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Right answer:</span>
                <p className="text-xl font-mono text-green-700 tracking-widest uppercase">{ans.correctAnswer}</p>
              </div>
            </div>
            <div className={`text-3xl ${ans.isCorrect ? 'grayscale-0' : 'grayscale'}`}>
              {ans.isCorrect ? '✅' : '❌'}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}