-- 1. НЕ удаляем public. 
-- TypeORM и многие расширения по умолчанию ищут её. Лучше оставить.
-- DROP SCHEMA IF EXISTS public CASCADE; 

-- 2. Создаем схему spell_quiz, если её нет
CREATE SCHEMA IF NOT EXISTS spell_quiz;

-- 3. В Docker-образе Postgres юзер из POSTGRES_USER создается автоматически.
-- Мы просто даем ему права на нашу новую схему.

GRANT ALL PRIVILEGES ON SCHEMA spell_quiz TO ${POSTGRES_USER:-indigo};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA spell_quiz TO ${POSTGRES_USER:-indigo};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA spell_quiz TO ${POSTGRES_USER:-indigo};

-- 4. Устанавливаем search_path, чтобы таблицы создавались в spell_quiz по умолчанию,
-- но public оставалась в доступе для системных таблиц.
ALTER DATABASE ${POSTGRES_DB:-quiz_app} SET search_path TO spell_quiz, public;

-- 5. Расширения (теперь создадутся в текущем search_path, т.е. в spell_quiz)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
    RAISE NOTICE '✅ Database dev-initialization completed';
END $$;