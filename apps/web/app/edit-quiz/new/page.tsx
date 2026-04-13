import { QuizForm } from '@/components/QuizForm';

export default function NewQuizPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Создание нового теста</h1>
      </div>
      <QuizForm />
    </main>
  );
}