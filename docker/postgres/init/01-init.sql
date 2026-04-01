-- 0. Удаление дефолтной public схемы
DROP SCHEMA IF EXISTS public CASCADE;

-- 1. Создание роли (перенесено в начало)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'quiz_app') THEN
        CREATE ROLE quiz_app WITH LOGIN PASSWORD 'quiz_password';
    END IF;
END
$$;

-- 2. Создание схем
CREATE SCHEMA IF NOT EXISTS shared;
CREATE SCHEMA IF NOT EXISTS spell_quiz;

ALTER SCHEMA shared OWNER TO quiz_app;
ALTER SCHEMA spell_quiz OWNER TO quiz_app;

-- !!! ВАЖНЫЙ ДОБАВЛЕННЫЙ ШАГ !!!
-- Устанавливаем путь для ТЕКУЩЕЙ сессии, чтобы расширения знали, где создаваться
SET search_path TO spell_quiz, shared;

-- 3. Создание расширений (теперь они создадутся в spell_quiz)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 4. Настройка прав пользователю quiz_app
GRANT USAGE ON SCHEMA shared TO quiz_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA shared TO quiz_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA shared TO quiz_app;
GRANT USAGE ON SCHEMA spell_quiz TO quiz_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA spell_quiz TO quiz_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA spell_quiz TO quiz_app;

-- 5. Установка search_path на уровне базы данных (для будущих подключений)
ALTER DATABASE quiz_app SET search_path TO spell_quiz, shared;

-- 6. Уведомление
DO $$
BEGIN
    RAISE NOTICE '✅ Database initialization completed';
END $$;
