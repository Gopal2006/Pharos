# RepoCompass

**Understand repositories. Find your next step.**

RepoCompass helps developers explore unfamiliar public GitHub repositories, discover setup instructions, inspect project structure, and find contribution opportunities.

> Status: Early development — foundation scaffold.

## Planned features

- Repository overview and README
- Source-linked project analysis
- Setup commands and package scripts detected from repository files
- Open issue browsing
- Clear handling for missing data, network failures, and API rate limits
- Optional AI explanations in a later release

## Tech stack

- React + TypeScript + Vite
- GitHub REST API
- Vitest + React Testing Library
- GitHub Actions
- Vercel deployment target

## Getting started

Requirements: Node.js 20.19+ or 22.12+, and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Project documentation

- [Product specification](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Security policy](docs/SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## Project status

This scaffold establishes the development foundation. GitHub API integration, repository analysis, issue browsing, and production UI will be implemented in subsequent milestones.

## License

MIT. See [LICENSE](LICENSE).
