import { QuizForm } from '@/components/QuizForm';
// Импортируйте вашу функцию получения данных (или оставьте ее в этом файле)

async function getQuizData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3011';
  const res = await fetch(`${baseUrl}/quizzes/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}

// В Next.js 15 тип params — это Promise
export default async function EditQuizPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {  
  // 1. Сначала "разворачиваем" пропсы
  const { id } = await params; 

  // 2. Теперь используем полученный id
  const quiz = await getQuizData(id);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Редактирование</h1>
        <span className="text-sm text-gray-500">ID: {id}</span>
      </div>
      
      <QuizForm quizId={Number(id)} initialData={quiz} />
    </main>
  );
}