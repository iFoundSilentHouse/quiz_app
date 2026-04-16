import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizPassagePage from './page'; // путь к твоей странице
import { api } from '@/lib/api';

// 1. Мокаем Next.js навигацию
const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: pushMock, // Передаем нашу функцию сюда
  }),
}));

// 2. Мокаем API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('QuizPassagePage', () => {
  const mockQuiz = {
    id: 1,
    title: 'Test Quiz',
    questions: [
      { id: 101, imageUrl: '/test.jpg', order: 1 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Имитируем успешную загрузку квиза
    (api.get as any).mockResolvedValue(mockQuiz);
  });

  it('должен отображать лоадер, пока данные не загружены', () => {
    render(<QuizPassagePage />);
    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });

  it('должен отображать название квиза и вопросы после загрузки', async () => {
    render(<QuizPassagePage />);
    
    // Ждем, пока исчезнет Loading и появится заголовок
    const title = await screen.findByText('Test Quiz');
    expect(title).toBeDefined();
    expect(screen.getByPlaceholderText('Your name')).toBeDefined();
  });

  it('должен вызывать alert, если имя студента не введено', async () => {
    // Мокаем alert в браузере
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<QuizPassagePage />);
    
    await screen.findByText('Test Quiz');
    const submitButton = screen.getByText('Finish and check');
    
    fireEvent.click(submitButton);
    
    expect(alertMock).toHaveBeenCalledWith('Enter your name');
  });

  it('должен отправлять ответы и перенаправлять на страницу результата', async () => {
    (api.post as any).mockResolvedValue({ id: 'attempt-123' });

  render(<QuizPassagePage />);
    await screen.findByText('Test Quiz');

    // Вводим имя
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Indigo' },
    });

    // Вводим ответ на первый вопрос
    fireEvent.change(screen.getByPlaceholderText('What is shown here?'), {
      target: { value: 'Apple' },
    });

    // Кликаем отправить
    fireEvent.click(screen.getByText('Finish and check'));

    await waitFor(() => {
      // Проверяем, что API вызван с правильными данными
      expect(api.post).toHaveBeenCalledWith('/quizzes/1/attempts', {
        studentName: 'Indigo',
        answers: { 101: 'Apple' },
      });
      // Проверяем редирект
      expect(pushMock).toHaveBeenCalledWith('/quiz/1/result?attemptId=attempt-123');
    });
  });
});