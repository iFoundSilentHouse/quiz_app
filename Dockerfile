# --- Base Stage ---
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

# --- Build Stage ---
FROM base AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# --- API Production Stage ---
FROM node:20-alpine AS api
RUN corepack enable
WORKDIR /app
COPY --from=build /app ./

# Копируем скрипт запуска (путь зависит от того, где он у вас лежит в репозитории)
COPY docker/api/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3011
ENTRYPOINT ["entrypoint.sh"]

# --- Web Production Stage ---
FROM node:20-alpine AS web
WORKDIR /app

# Настройка окружения
ENV NODE_ENV=production

ENV PORT=3010

# Копируем результаты сборки standalone
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3010
CMD ["node", "apps/web/server.js"]
