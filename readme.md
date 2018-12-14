My fork of [Nivin Joseph's](https://github.com/nivinjoseph) ts-poc project. Project showcases full-stack app development with typescript using event-sourcing.

# Docker Setup
1. docker network create ts-poc
1. cd ts-poc-api
1. npm run db-docker-start
1. npm run dev-docker-start
1. open another shell
1. cd ts-poc-web
1. npm run dev-docker-start