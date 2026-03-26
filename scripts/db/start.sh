#!/bin/bash
set -e

# Загрузка переменных окружения
source docker/compose/.env

echo "🚀 Starting PostgreSQL..."

# Проверка наличия .env файла в проекте
if [ ! -f docker/compose/.env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp docker/compose/.env.example docker/compose/.env
fi

# Запуск контейнера
docker-compose -f docker/compose/docker-compose.yml up -d postgres

# Ожидание готовности
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec "${POSTGRES_DB}-postgres" pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} > /dev/null 2>&1; do
    sleep 1
done

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

echo "✅ PostgreSQL is ready on port ${POSTGRES_PORT}"
echo "📝 Connection URL: ${DATABASE_URL}"
echo ""
echo "Useful commands:"
echo "  ./scripts/db/stop.sh   - Stop PostgreSQL"
echo "  ./scripts/db/reset.sh  - Reset database (wipe all data)"