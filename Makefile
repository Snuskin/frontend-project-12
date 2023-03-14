install:
	npm ci

start:
	npx start-server & npm -C frontend start

build:
	npm build