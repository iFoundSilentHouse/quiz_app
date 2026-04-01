# 📋 Гайд по конфигурации apps/api

## 🎯 Обзор изменений

Все конфигурационные файлы приведены к **ES Modules (ESM)** для согласованности и совместимости.

## 📁 Структура конфигурации

### 1. **tsconfig.json** - Конфигурация TypeScript
```json
{
  "compilerOptions": {
    "module": "ES2022",        // ✓ Явно указано ES2022
    "moduleResolution": "bundler",  // ✓ Лучшее разрешение модулей
    // ... остальные опции
  }
}
```

**Изменения:**
- `"module": "esnext"` → `"module": "ES2022"` (явное указание версии)
- `"moduleResolution": "node"` → `"moduleResolution": "bundler"` (лучшая совместимость)

### 2. **eslint.config.mjs** - Конфигурация ESLint
```javascript
{
  languageOptions: {
    sourceType: 'module',  // ✓ ES Modules
    // ...
  }
}
```

**Изменения:**
- `sourceType: 'commonjs'` → `sourceType: 'module'` (согласованность)

### 3. **typeorm.config.ts** - Конфигурация базы данных
```typescript
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'postgres',
  // ... остальные опции
  migrations: [
    join(__dirname, './src/migrations/**/*.ts'),
  ],
});
```

**Особенности:**
- Использует `import.meta.url` (ESM синтаксис)
- Правильно получает `__dirname` для ESM
- Указывает путь к миграциям

### 4. **package.json** - Скрипты и зависимости
```json
{
  "scripts": {
    "typeorm": "NODE_OPTIONS='--loader ts-node/esm --no-warnings=ExperimentalWarning' typeorm-ts-node-esm -d typeorm.config.ts",
    "migration:run": "pnpm typeorm migration:run",
    "migration:show": "pnpm typeorm migration:show",
    "migration:revert": "pnpm typeorm migration:revert",
    "migration:generate": "pnpm typeorm migration:generate -- src/migrations",
    "migration:create": "pnpm typeorm migration:create -- src/migrations"
  }
}
```

**Изменения:**
- Добавлены `NODE_OPTIONS` для правильной загрузки ESM
- Указаны пути для генерирования и создания миграций

### 5. **nest-cli.json** - Конфигурация NestJS CLI
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "entryFile": "apps/api/src/main",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": []
  }
}
```

**Изменения:**
- Добавлено поле `"plugins": []` для явной конфигурации

### 6. **Миграции** - Файлы миграций TypeORM
```typescript
import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialSchema1705315200001 implements MigrationInterface {
  // ...
}
```

**Изменения:**
- Используется `type` для импорта типов (tree-shaking)
- Остальные классы импортируются обычным способом

## 🧪 Тестирование миграций

### Команды для проверки

```bash
# 1. Показать все миграции и их статус
pnpm migration:show

# 2. Проверить синтаксис TypeScript
pnpm lint

# 3. Собрать проект
pnpm build

# 4. Запустить миграции
pnpm migration:run

# 5. Откатить последнюю миграцию
pnpm migration:revert

# 6. Создать новую миграцию
pnpm migration:create -- src/migrations/AddNewTable
```

### Скрипт для полной проверки

```bash
chmod +x test-migrations.sh
./test-migrations.sh
```

## 🔧 Переменные окружения

Убедитесь, что в `.env` установлены:

```env
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_DATABASE
PORT
```

## ⚠️ Частые проблемы и решения

### Проблема: "Cannot find module"
**Решение:** Убедитесь, что все импорты используют расширение `.js` в ESM:
```typescript
// ❌ Неправильно
import { SomeClass } from './path/to/file';

// ✓ Правильно (если необходимо)
import { SomeClass } from './path/to/file.js';
```

### Проблема: "Cannot use import statement outside a module"
**Решение:** Проверьте, что `"module": "ES2022"` в `tsconfig.json`

### Проблема: "TypeORM migrations not found"
**Решение:** Убедитесь, что пути в `typeorm.config.ts` указаны корректно:
```typescript
migrations: [
  join(__dirname, './src/migrations/**/*.ts'),  // Для development
]
```

## 📚 Дополнительные ресурсы

- [TypeORM Миграции](https://typeorm.io/migrations)
- [ESM в Node.js](https://nodejs.org/api/esm.html)
- [TypeScript ESM](https://www.typescriptlang.org/docs/handbook/esm-node.html)

## ✅ Чек-лист перед продакшеном

- [ ] Все тесты проходят: `pnpm test`
- [ ] Нет ошибок ESLint: `pnpm lint`
- [ ] Миграции работают: `pnpm migration:show`
- [ ] Проект собирается: `pnpm build`
- [ ] Проект запускается: `pnpm start`
- [ ] E2E тесты проходят: `pnpm test:e2e`
