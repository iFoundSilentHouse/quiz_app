-- =====================================================
-- Инициализация базы данных для Spell Quiz
-- =====================================================

-- 0. Удаление дефолтной public схемы
DROP SCHEMA IF EXISTS public CASCADE;

-- 1. Создание схемы для общих данных
CREATE SCHEMA IF NOT EXISTS shared;
 
-- 2. Создание схемы для данных spell_quiz
CREATE SCHEMA IF NOT EXISTS spell_quiz;
 
-- 3. Создание необходимых расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
 
-- 4. Создание роли для приложения
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'quiz_app') THEN
        CREATE ROLE quiz_app WITH LOGIN PASSWORD 'quiz_password';
    END IF;
END
$$;
 
-- 5. Настройка прав для схем shared и spell_quiz пользователю quiz_app
GRANT USAGE ON SCHEMA shared TO quiz_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA shared TO quiz_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA shared TO quiz_app;
GRANT USAGE ON SCHEMA spell_quiz TO quiz_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA spell_quiz TO quiz_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA spell_quiz TO quiz_app;
 
-- 6. Установка search_path для базы данных
ALTER DATABASE quiz_app SET search_path TO spell_quiz, shared;
 
-- 7. Комментарии для документации
COMMENT ON SCHEMA shared IS 'Shared data: users, auth, common entities';
COMMENT ON SCHEMA spell_quiz IS 'Spell Quiz specific data';
COMMENT ON DATABASE quiz_app IS 'Spell Quiz application database';
 
-- 8. Уведомление об успешной инициализации
DO $$
BEGIN
    RAISE NOTICE '✅ Database initialization completed';
    RAISE NOTICE '   Schemas: spell_quiz, shared';
    RAISE NOTICE '   Extensions: uuid-ossp, pgcrypto';
    RAISE NOTICE '   Role: quiz_app';
    RAISE NOTICE '   Search path: spell_quiz, shared';
END $$;
