.PHONY: default
default:
	echo "no default"

.PHONY: migrate
migrate:
	npx drizzle-kit migrate

.PHONY: generate
generate:
	npx drizzle-kit generate

.PHONY: dev
dev:
	npm run dev

.PHONY: build
build:
	npm run build

.PHONY: start
start:
	npm run start

.PHONY: studio
studio:
	npx drizzle-kit studio

.PHONY: check
check:
	npx drizzle-kit check

.PHONY: push
push:
	npx drizzle-kit push