install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server -s ./frontend/build

start:
	make start-backend

start-dev:
	make start-backend & make start-frontend

build:
	make -C frontend build