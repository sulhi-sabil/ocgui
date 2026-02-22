# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- MIT LICENSE file
- Table of contents to blueprint.md for improved navigation
- Centralized constants module for application-wide configuration
- API service layer for SQLite database operations
- Agent template utilities for agent scaffolding
- Delete agent functionality with confirmation dialog (ConfirmDialog component)
- React-testing-vitest and opencode-primitives skills
- Rust toolchain configuration for reproducible builds
- Validate and CI scripts for development workflow

### Fixed

- Tags validation in validateAgent function
- Missing tags property in AgentCard test mock
- Error handling for Zustand persist storage

### Changed

- Core UI components (Button, SearchInput, Toast, EmptyState)
- Agent management components (AgentCard, CreateAgentModal)
- Theme toggle with dark mode support
- Custom hooks (useAgentSearch, useKeyboardShortcut)
- Zustand store for state management
- Error boundary for graceful error handling
- Test infrastructure with Vitest and React Testing Library

## [0.1.0] - 2026-02-01

### Added

- Initial project scaffold with Tauri v2 + React + TypeScript
- Vite build configuration
- Tailwind CSS styling
- Radix UI component primitives
- ESLint and TypeScript strict mode configuration
- Basic project structure following AGENTS.md conventions

[Unreleased]: https://github.com/sulhi-sabil/ocgui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sulhi-sabil/ocgui/releases/tag/v0.1.0
