.PHONY: setup start stop test clean docker-setup docker-start docker-stop logs help

# Colors for terminal output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

TARGET_MAX_CHAR_NUM=20

# Help command
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Install dependencies and setup virtual environment
setup:
	@echo "Setting up Python virtual environment..."
	python -m venv venv
	. venv/bin/activate && pip install -r requirements.txt
	cp -n .env.example .env || true
	@echo "Setup complete. Don't forget to edit .env with your GOOGLE_API_KEY"

## Start the local development server
start:
	. venv/bin/activate && python start_local.py

## Run tests with WebSocket client
test:
	. venv/bin/activate && python test_websocket.py --save-audio

## Setup Docker environment
docker-setup:
	cp -n .env.example .env || true
	@echo "Docker setup complete. Don't forget to edit .env with your GOOGLE_API_KEY"

## Start services with Docker Compose
docker-start:
	docker-compose up --build -d
	@echo "Services started. Check logs with 'make logs'"

## Stop Docker services
docker-stop:
	docker-compose down

## View service logs
logs:
	docker-compose logs -f

## Clean up generated files and virtual environment
clean:
	rm -rf venv
	rm -rf __pycache__
	rm -rf *.pyc
	rm -rf .pytest_cache
	rm -f response_*.mp3
	rm -f gemini_service.log
	@echo "Cleaned up development files"

# Watch logs in non-Docker mode
watch-logs:
	tail -f gemini_service.log

## Run linting and type checking
lint:
	. venv/bin/activate && \
	black . && \
	isort . && \
	mypy .

## Generate test audio responses
generate-samples:
	. venv/bin/activate && \
	python test_websocket.py --save-audio --message "Hello, how are you?" && \
	python test_websocket.py --save-audio --message "Tell me a joke about programming" && \
	python test_websocket.py --save-audio --message "What's the weather like?"
