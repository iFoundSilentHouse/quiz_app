'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { QuestionCard } from './QuestionCard';

interface QuizFormProps {
	quizId?: number;
	initialData?: any;
}

interface QuestionState {
	id?: number;
	tempId?: string;
	imageUrl?: string;
	correctAnswer?: string;
}

export function QuizForm({ quizId, initialData }: QuizFormProps) {
	const isEditMode = !!quizId; // Проверяем, редактируем ли мы или создаем
	const router = useRouter();
	const [title, setTitle] = useState(initialData?.title || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [questions, setQuestions] = useState<QuestionState[]>(
		initialData?.questions || [{ imageUrl: '', correctAnswer: '', tempId: crypto.randomUUID() }]
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const addQuestion = () => setQuestions([
		...questions,
		{ imageUrl: '', correctAnswer: '', tempId: crypto.randomUUID() }
	]);
	const updateQuestion = (index: number, field: string, value: string) => {
		const newQuestions = [...questions];
		newQuestions[index] = { ...newQuestions[index], [field]: value };
		setQuestions(newQuestions);
	};

	const removeQuestion = async (index: number) => {
		const questionToRemove = questions[index];
		// Добавляем проверку: если вопроса нет по этому индексу, выходим
		if (!questionToRemove) return;
		// Если у вопроса есть ID, его нужно удалить из базы сразу или пометить для удаления
		if (questionToRemove.id) {
			if (confirm('Удалить этот вопрос из базы данных?')) {
				try {
					await api.delete(`/questions/${questionToRemove.id}`);
				} catch (e) {
					return alert('Ошибка при удалении вопроса');
				}
			} else return;
		}
		setQuestions(questions.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			let currentQuizId = quizId;

			// 1. Создаем или обновляем тест
			if (isEditMode) {
				await api.put(`/quizzes/${quizId}`, { title, description });
			} else {
				const newQuiz = await api.post('/quizzes', { title, description });
				currentQuizId = newQuiz.id;
			}

			// 2. Обрабатываем вопросы ПАРАЛЛЕЛЬНО (быстрее)
			const questionPromises = questions.map(async (q, i) => {
				const payload = {
					imageUrl: q.imageUrl,
					correctAnswer: q.correctAnswer,
					order: i + 1,
					quizId: currentQuizId
				};

				// Если это РЕЖИМ РЕДАКТИРОВАНИЯ и у вопроса есть ID из базы — обновляем
				if (isEditMode && q.id) {
					return api.put(`/questions/${q.id}`, payload);
				}

				// Во всех остальных случаях (новый тест или новый вопрос в старом тесте) — создаем
				return api.post(`/quizzes/${currentQuizId}/questions`, payload);
			});
			await Promise.all(questionPromises);

			const message = isEditMode ? 'Тест обновлен' : 'Тест создан';
			router.push(`/dashboard?success=${encodeURIComponent(message)}`);
			router.refresh();
		} catch (error) {
			console.error(error);
			alert('Ошибка при сохранении');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12">
			{/* ... (поля Title и Description такие же, как были) ... */}
			<div className="space-y-4 bg-white p-6 border rounded-xl shadow-sm">
				<input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-md font-bold text-lg" placeholder="Название теста" />
				<textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Описание..." />
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-bold">Вопросы</h2>
				{questions.map((q: any, i: number) => (
					<QuestionCard key={q.id ?? q.tempId} index={i} question={q} updateQuestion={updateQuestion} removeQuestion={removeQuestion} />
				))}
				<button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50">
					+ Добавить вопрос
				</button>
			</div>

			<button type="submit" disabled={isSubmitting} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">
				{isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
			</button>
		</form>
	);
}