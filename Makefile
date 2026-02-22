.PHONY: help install dev build test lint typecheck validate clean tauri-dev tauri-build ci security

help:
	@echo "ocgui - Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install      Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev          Start development server"
	@echo "  make tauri-dev    Start Tauri in development mode"
	@echo ""
	@echo "Quality:"
	@echo "  make lint         Run ESLint"
	@echo "  make lint-fix     Run ESLint with auto-fix"
	@echo "  make typecheck    Run TypeScript check"
	@echo "  make test         Run test suite"
	@echo "  make test-watch   Run tests in watch mode"
	@echo "  make test-coverage Run tests with coverage"
	@echo "  make validate     Run lint, typecheck, and test"
	@echo ""
	@echo "Build:"
	@echo "  make build        Build for production"
	@echo "  make tauri-build  Build Tauri application"
	@echo ""
	@echo "CI/CD:"
	@echo "  make ci           Run full CI pipeline"
	@echo "  make security     Run security audit"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        Remove build artifacts"

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

typecheck:
	npm run typecheck

validate:
	npm run validate

ci:
	npm run ci

security:
	@echo "Running security audit..."
	npm audit --audit-level=moderate || true
	@echo ""
	@echo "Checking for outdated packages..."
	npm outdated || true

tauri-dev:
	npm run tauri:dev

tauri-build:
	npm run tauri:build

clean:
	rm -rf dist
	rm -rf coverage
	rm -rf node_modules/.cache
	rm -rf src-tauri/target/debug
	rm -rf src-tauri/target/release
	@echo "Cleaned build artifacts"
