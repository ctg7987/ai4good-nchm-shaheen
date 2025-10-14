.PHONY: help dev dev-web dev-api test test-web test-api build clean install

# Default target
help:
	@echo "Available targets:"
	@echo "  dev        - Run both web and API in development mode"
	@echo "  dev-web    - Run web app in development mode"
	@echo "  dev-api    - Run API in development mode"
	@echo "  test       - Run all tests (web lint + api pytest)"
	@echo "  test-web   - Run web app linting"
	@echo "  test-api   - Run API tests"
	@echo "  build      - Build all applications"
	@echo "  clean      - Clean build artifacts"
	@echo "  install    - Install all dependencies"

# Development targets
dev: install
	@echo "Starting development servers..."
	npm run dev

dev-web: install
	@echo "Starting web development server..."
	npm run dev:web

dev-api: install
	@echo "Starting API development server..."
	npm run dev:api

# Test targets
test: test-web test-api

test-web:
	@echo "Running web app linting..."
	npm run lint:web

test-api:
	@echo "Running API tests..."
	cd apps/api && pytest

# Build targets
build: install
	@echo "Building all applications..."
	npm run build

# Utility targets
clean:
	@echo "Cleaning build artifacts..."
	rm -rf apps/web/dist
	rm -rf apps/web/node_modules
	rm -rf apps/api/__pycache__
	rm -rf apps/api/.pytest_cache
	rm -rf packages/shared/dist
	rm -rf packages/shared/node_modules
	rm -rf node_modules

install:
	@echo "Installing dependencies..."
	npm install
	cd apps/api && pip install -e .

