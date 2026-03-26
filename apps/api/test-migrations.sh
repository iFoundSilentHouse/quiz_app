#!/bin/bash

# Скрипт для тестирования миграций TypeORM

set -e

echo "🔍 Тестирование конфигурации миграций..."
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода статуса
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        exit 1
    fi
}

# Функция для вывода информации
print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Проверка переменных окружения
print_info "Проверка переменных окружения..."
if [ -z "$DB_HOST" ]; then
    print_info "DB_HOST не установлена, используем localhost"
    export DB_HOST="localhost"
fi

if [ -z "$DB_PORT" ]; then
    print_info "DB_PORT не установлена, используем 5432"
    export DB_PORT="5432"
fi

if [ -z "$DB_USERNAME" ]; then
    print_info "DB_USERNAME не установлена, используем indigo"
    export DB_USERNAME="indigo"
fi

if [ -z "$DB_PASSWORD" ]; then
    print_info "DB_PASSWORD не установлена, используем somedayiwill"
    export DB_PASSWORD="somedayiwill"
fi

if [ -z "$DB_DATABASE" ]; then
    print_info "DB_DATABASE не установлена, используем quiz_app"
    export DB_DATABASE="quiz_app"
fi

echo ""
print_info "Показываем список миграций..."
pnpm migration:show
print_status "Список миграций получен"

echo ""
print_info "Проверяем синтаксис TypeScript конфигурации..."
npx tsc --noEmit typeorm.config.ts
print_status "Синтаксис конфигурации корректен"

echo ""
print_info "Проверяем синтаксис миграций..."
npx tsc --noEmit src/migrations/*.ts
print_status "Синтаксис миграций корректен"

echo ""
echo -e "${GREEN}✓ Все проверки пройдены!${NC}"
echo ""
print_info "Для запуска миграций используйте:"
echo "  pnpm migration:run"
echo ""
print_info "Для отката последней миграции используйте:"
echo "  pnpm migration:revert"
