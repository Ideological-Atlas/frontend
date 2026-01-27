ifneq ("\$(wildcard .env.local)","")
    include .env.local
    export
endif

# --- Configuration ---
COMPOSE = docker compose
FRONTEND_SVC = frontend
TAIL_LOGS = 50

.DEFAULT_GOAL := up-logs

# --- System ---
.PHONY: help prepare-env clean-images remove-containers deploy

help: ## Show this help message
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "\033[36m%-30s\033[0m %s\n", \$\$1, \$\$2}' \$(MAKEFILE_LIST)

prepare-env: ## Create .env.local from template
	@test -f .env.local || cp .env.local-dist .env.local

# --- Docker Orchestration ---
up-logs: up logs

up: create-network prepare-env ## Start containers in background
	@\$(COMPOSE) up --force-recreate -d --remove-orphans

down: ## Stop containers
	@\$(COMPOSE) down

build: create-network prepare-env ## Build images
	@\$(COMPOSE) build

complete-build: down build up ## Down service build images and start

deploy: ## Deploy script shortcut (Git pull + Docker Up)
	git pull
	make prod-up
	@echo "🚀 Frontend deployed."

# --- Development & Logs ---
.PHONY: logs bash

logs: ## Show frontend logs
	@docker logs --tail \$(TAIL_LOGS) -f \$(PROJECT_NAME)_\$(FRONTEND_SVC)

bash: ## Access container bash
	@docker exec -it \$(PROJECT_NAME)_\$(FRONTEND_SVC) sh

create-network: ## Create shared network if not exists
	@docker network inspect ideological_global_network >/dev/null 2>&1 || docker network create ideological_global_network
