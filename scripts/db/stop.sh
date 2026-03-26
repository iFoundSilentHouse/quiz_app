#!/bin/bash
set -e

# Загрузка переменных окружения
if [ -f docker/compose/.env ]; then
    source docker/compose/.env
else
    echo "⚠️  No .env file found in docker/compose/.env"
    echo "Using default values..."
fi

echo "🛑 Stopping PostgreSQL container..."

# Остановка контейнера (без удаления)
docker-compose -f docker/compose/docker-compose.yml stop postgres

# Проверка статуса
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL container stopped successfully"
    echo ""
    echo "To start again: ./scripts/db/start.sh"
    echo "To completely remove containers: ./scripts/db/down.sh"
else
    echo "❌ Failed to stop PostgreSQL container"
    exit 1
fi

# Показать статус всех контейнеров
echo ""
echo "📊 Current container status:"
docker-compose -f docker/compose/docker-compose.yml ps