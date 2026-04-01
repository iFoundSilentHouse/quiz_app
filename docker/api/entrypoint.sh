#!/bin/sh

echo "Waiting for database to be ready..."
# Даем Postgres немного времени на окончательный запуск, 
# даже если healthcheck прошел
sleep 3 

echo "Checking migration status..."
if pnpm --filter api run migration:status 2>&1 | grep -qiE "(schema is up to date|database schema is up to date)"; then
  echo "✅ Database schema is already up to date. No migration needed."
else
  echo "⚠️ Database is not initialized or has pending migrations."
  echo "🚀 Running migrations..."
  pnpm --filter api run migration:run
  echo "✅ Migrations applied successfully!"
fi

echo "🚀 Starting the application..."
exec node apps/api/dist/src/main.js