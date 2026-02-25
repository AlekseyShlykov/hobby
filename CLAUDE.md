# Project Instructions

## Code Style

- Use consistent indentation (configure per language below)
- Prefer explicit imports over wildcards
- Keep functions small and focused (single responsibility)
- Use descriptive variable names; avoid abbreviations

<!-- Uncomment and adapt for your stack:

### TypeScript/JavaScript
- Use ES modules (import/export), not CommonJS (require)
- Prefer `const` over `let`, never use `var`
- Use strict TypeScript (`strict: true` in tsconfig)

### Python
- Follow PEP 8 style guide
- Use type hints for function signatures
- Prefer f-strings over .format() or % formatting

### Go
- Run `go fmt` before committing
- Use meaningful error wrapping with %w
-->

## Workflow

- IMPORTANT: Read files before modifying them
- Run linter/formatter after making changes
- Prefer editing existing files over creating new ones
- Make minimal, focused changes — avoid unrelated "improvements"

<!-- Uncomment for your build system:
- Build: `npm run build` / `go build` / `cargo build`
- Dev: `npm run dev` / `go run .` / `cargo run`
- Lint: `npm run lint` / `golangci-lint run` / `cargo clippy`
-->

## Testing

- IMPORTANT: Run tests after code changes
- Prefer running single test files over entire suite
- Write tests for new functionality

<!-- Uncomment for your test framework:
- Run all: `npm test` / `go test ./...` / `pytest`
- Run single: `npm test -- path/to/test` / `go test -run TestName` / `pytest path/to/test.py`
-->

## Git Conventions

- IMPORTANT: Only commit when explicitly asked
- Never force push to main/master
- Write clear commit messages: imperative mood, explain "why" not "what"
- Keep commits atomic — one logical change per commit

<!-- Uncomment for your branching strategy:
- Branch naming: `feature/description`, `fix/description`, `chore/description`
- PR title format: `[TYPE] Brief description`
-->

## Architecture

<!-- Document key architectural decisions:
- Project structure overview
- Key abstractions and patterns used
- External dependencies and their purpose
- API conventions
-->

## Environment

<!-- Document required setup:
- Required environment variables
- Secret management approach
- Local development prerequisites
-->

## Gotchas

<!-- Document non-obvious behaviors:
- Known quirks in the codebase
- Common mistakes to avoid
- Platform-specific considerations
-->

## File References

<!-- Use @file syntax to import additional context:
@README.md
@docs/architecture.md
-->
