import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Явно задаем корень проекта как текущую папку
  root: __dirname, 
  test: {
    name: 'web',
    environment: 'jsdom',
    globals: true,
    // Используем относительный путь от корня приложения
    include: ['app/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});