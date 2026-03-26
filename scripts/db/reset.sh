#!/bin/bash
set -e

source docker/compose/.env

echo "⚠️  WARNING: This will DELETE ALL DATA in the database!"
read -p "Are you sure? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

COMPOSE_FILE="docker/compose/docker-compose.yml"
POSTGRES_CONTAINER="${POSTGRES_DB}-postgres"

echo "🛑 Stopping all services..."
docker-compose -f "$COMPOSE_FILE" down -v

echo "🗑️  Pruning all volumes..."
docker volume prune -f

echo "🔄 Rebuilding and starting fresh..."
docker-compose -f "$COMPOSE_FILE" up -d --build --force-recreate postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
RETRIES=60
COUNTER=0
until docker-compose -f "$COMPOSE_FILE" exec postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" 2>&1 | grep -q "accepting connections"; do
    COUNTER=$((COUNTER + 1))
    if [ $COUNTER -gt $RETRIES ]; then
        echo "❌ Database failed to start after $RETRIES attempts"
        docker-compose -f "$COMPOSE_FILE" logs postgres | tail -50
        exit 1
    fi
    echo "  Waiting... ($COUNTER/$RETRIES)"
    sleep 1
done

echo "✅ PostgreSQL is ready"

echo ""
echo "📋 Verifying schemas..."
docker-compose -f "$COMPOSE_FILE" exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dn"

echo ""
echo "✅ Database reset complete!"
echo "   Schemas: shared, spell_quiz"
echo "   Role: quiz_app"
echo "   Ready for connections"