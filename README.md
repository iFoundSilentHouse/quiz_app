## Initial setup
### For dev env
.env files are necessary on path:


`apps/web/.env`. Variables:
- NEXT_PUBLIC_API_URL


`apps/api/.env`. Variables:
- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_DATABASE
- PORT `(api port)`
- FRONTEND_PORT
- NEXT_PUBLIC_API_URL `same as in frontend`


`docker/compose/.env`. Variables:
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB `for db and container naming`
- POSTGRES_PORT


## Deploy
No need to configure .env files. Just add your external (or local) IP with :3011 at docker/compose/.env.production NEXT_PUBLIC_API_URL variable.
1) `docker compose -f docker/compose/docker-compose.prod.yml --env-file docker/compose/.env.production up -d --build`
2) `docker exec -it spell-test-api pnpm --filter api run migration:run` for TypeORM migrations


and frontend will be able at localhost:3010. backend at localhost:3011.

## Technologies used
* Monorepo organized project
* Next js
* Nest js
* TypeORM
* PostgreSQL (with generation scripts)