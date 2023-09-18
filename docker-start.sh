docker stop metaform-site
docker rm metaform-site
. .env
docker run --env-file .env --name metaform-site -v "$(pwd)":/usr/src/app -p "$HTTP_EXPOSED_PORT:9000" -w /usr/src/app node:latest npm run dev
