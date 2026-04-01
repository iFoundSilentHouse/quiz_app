#!/bin/bash
set -e

# Загрузка переменных окружения
source docker/compose/.env

echo "🚀 Starting PostgreSQL..."

# Проверка наличия .env файла в проекте
if [ ! -f docker/compose/.env ]; then
  echo "⚠️ No .env file found. Creating from .env.example..."
  cp docker/compose/.env.example docker/compose/.env
fi

# Запуск контейнера
docker-compose -f docker/compose/docker-compose.dev.yml up -d postgres

# Ожидание готовности PostgreSQL
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec "${POSTGRES_DB}-postgres" pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} > /dev/null 2>&1; do
  sleep 1
done

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
echo "✅ PostgreSQL is ready on port ${POSTGRES_PORT}"
echo "📝 Connection URL: ${DATABASE_URL}"
echo ""

# ====================== НОВАЯ ЛОГИКА: ИНИЦИАЛИЗАЦИЯ МИГРАЦИЙ ======================

echo "🔄 Checking database migration status..."

# Переходим в папку с API и проверяем статус миграций
cd apps/api || { echo "❌ Cannot find apps/api directory"; exit 1; }

# Проверяем, применены ли миграции (ищем строку "up to date" или "schema is up to date")
if pnpm run migration:status 2>&1 | grep -qiE "(schema is up to date|database schema is up to date)"; then
  echo "✅ Database schema is already up to date. No migration needed."
else
  echo "⚠️ Database is not initialized or has pending migrations."
  echo "🚀 Running migrations: pnpm run migration:run"
  pnpm run migration:run
  echo "✅ Migrations applied successfully!"
fi

# Возвращаемся в корень проекта (по желанию)
cd - > /dev/null

# =============================================================================

echo ""
echo "Useful commands:"
echo " ./scripts/db/stop.sh - Stop PostgreSQL"
echo " ./scripts/db/reset.sh - Reset database (wipe all data)"