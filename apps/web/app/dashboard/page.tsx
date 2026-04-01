import Link from 'next/link';
import CopyLinkButton from '@/components/CopyLinkButton'; // Проверь путь к компоненту

// Серверный компонент в Next.js App Router (fetch выполняется на сервере)
async function getQuizzes() {
  try {
    // Используем 127.0.0.1 вместо localhost
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3011';
    
    const res = await fetch(`${baseUrl}/quizzes`, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    // Теперь, если бэкенд выключен, страница не упадет, а просто покажет пустой список
    console.error('Failed to fetch quizzes. Is the backend running?', error);
    return [];
  }
}

export default async function DashboardPage() {
  const quizzes = await getQuizzes();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мои тесты</h1>
          <Link href="/quizzes/new" className="bg-blue-600 !text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 ">
            Создать тест
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz: any) => (
            <div key={quiz.id} className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{quiz.description || 'Нет описания'}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
                {/* Кнопка копирования */}
                <CopyLinkButton quizId={quiz.id} />
                <div className="mt-4 flex gap-2">
                  <Link href={`/quizzes/${quiz.id}/edit`} className="text-blue-600 text-sm font-medium hover:underline">
                    Редактировать
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">У вас пока нет созданных тестов.</div>
          )}
        </div>
      </div>
    </main>
  );
}