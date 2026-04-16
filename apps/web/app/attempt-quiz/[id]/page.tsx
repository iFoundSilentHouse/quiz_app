'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { QuizWithQuestionsDto } from '@spell/shared';

export default function QuizPassagePage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizWithQuestionsDto | null>(null);
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(setQuiz);
  }, [id]);

  const handleSubmit = async () => {
    if (!studentName.trim()) return alert('Enter your name');

    try {
      const response = await api.post(`/quizzes/${id}/attempts`, {
        studentName,
        answers // ПРОСТО ПЕРЕДАЕМ ОБЪЕКТ!
      });
      router.push(`/attempt-quiz/${id}/result?attemptId=${response.id}`);
    } catch (e) {
      alert('Error when saving a result');
    }
  };

  if (!quiz) return <div className="p-8">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
        <input
          type="text"
          placeholder="Your name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </section>

      <div className="flex flex-col gap-4">
        {quiz.questions.map((q, index) => (
          <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4 ">
            <span className="text-2xl font-bold text-gray-900">Question {index + 1}:</span>
            {q.imageUrl && (
              <img
                src={q.imageUrl}
                alt="Вопрос"
                className="mx-auto object-cover rounded-lg"
              />
            )}
            <input
              type="text"
              placeholder="What is shown here?"
              className="w-full p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none text-center text-xl uppercase tracking-widest"
              value={answers[q.id!] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id!]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
      >
        Finish and check
      </button>
    </main>
  );
}