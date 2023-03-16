install:
	npm ci

start-backend:
  npx start-server -s ./frontend/build

build:
	npm build