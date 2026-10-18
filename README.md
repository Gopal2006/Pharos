# Pharos

**Navigate any codebase.**

Pharos analyzes public GitHub repositories to surface metadata, README content, manifests, scripts, configuration, and useful starting points. Findings link to their source files. Recommendations are labeled separately from detected facts. Repository commands are never executed.

## Run locally

Requirements: Node.js 20.19+ or 22.12+, and npm. No environment variables or GitHub token are required.

```bash
npm install
npm run dev
```

Open Vite's local URL. For production use `npm run build` and `npm run preview`.

## Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Analysis and limitations

The browser validates an HTTPS `github.com/{owner}/{repository}` URL, then calls GitHub's public REST API for metadata, the recursive default-branch tree, README, and relevant files. GitHub's unauthenticated API rate limit applies; results can be partial when requests fail or a tree is truncated. The README is displayed as escaped plain text, never HTML or interpreted Markdown. Only public repositories are supported. There is no OAuth, backend, paid AI service, or required environment variable. Analysis is heuristic and does not prove suggested commands work.

See [Architecture](docs/ARCHITECTURE.md), [Product](docs/PRODUCT.md), [Roadmap](docs/ROADMAP.md), [Security](docs/SECURITY.md), and [Contributing](CONTRIBUTING.md).

MIT. See [LICENSE](LICENSE).
