# Architecture

## Current implementation

Start with a frontend-first React + TypeScript + Vite application. Use public GitHub REST API endpoints and keep API access separate from UI components.

The React interface calls the public GitHub REST API directly. There is no server, authentication, token, or required environment configuration. GitHub's unauthenticated API limits therefore apply.

## Proposed modules

- `src/app/` — application shell and routing
- `src/components/` — shared UI components
- `src/app/` — application shell and repository results UI
- `src/lib/github/` — GitHub API client
- `src/analyzers/` — deterministic file analyzers
- `src/types/` — shared domain types
- `src/test/` — test utilities

Introduce modules when their functionality is implemented; avoid empty abstractions.

## Principles

1. Keep API access separate from UI components.
2. Keep parsing deterministic and independently testable.
3. Use typed domain models for repositories, files, findings, and issues.
4. Attach source URLs and evidence to analysis results.
5. Handle missing, unsupported, malformed, and incomplete data explicitly.
6. Treat README and repository content as untrusted input.
7. Do not execute commands from analyzed repositories.
8. Avoid unnecessary dependencies and infrastructure.

## Analysis evidence

Each finding should communicate what was detected, where it was found, and how confident the analyzer can reasonably be. Detected commands are not proof that commands have been executed successfully.
