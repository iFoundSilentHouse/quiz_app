import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Чистая Node-среда, никакой имитации браузера
    environment: 'node',
    
    // Позволяет не импортировать describe, it, expect в каждом файле
    globals: true,
    
    // Где искать тесты
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    
    // Настройка путей (алиасов)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});