install:
	npm ci

start:
	npx start-server -s ./frontend/build

build:
	npm run build

lint:
	npx eslint .

fix:
	npx eslint --fix .