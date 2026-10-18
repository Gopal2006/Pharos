# Product Specification

## Vision

Help developers understand unfamiliar public GitHub repositories, identify how to run and test them, and discover useful next steps without manually searching through the entire codebase.

## Target users

- Developers exploring unfamiliar codebases
- Open-source contributors searching for opportunities
- Developers evaluating project structure and setup requirements
- Maintainers improving repository onboarding

## Core user journey

1. Enter a public GitHub repository URL.
2. View repository metadata and documentation.
3. Explore important files and directories.
4. Review detected setup instructions and project scripts.
5. Review contribution guidance.
6. Follow source links to verify findings and continue work on GitHub.

## MVP scope

### Repository overview
- Validate supported GitHub repository URLs.
- Fetch metadata and default-branch information.
- Display description, primary language, license when available, and repository links.
- Display README content with safe rendering.

### Repository analysis
- Inspect the repository file tree.
- Detect supported manifests and configuration files.
- Extract package scripts and package-manager evidence.
- Identify setup and contribution instructions.
- Link findings to original source files.
- Distinguish detected facts from inferred recommendations.

### Current exclusions
- Issue browsing is not implemented in v0.2.
- Private repositories, OAuth, saved workspaces, and AI explanations are not implemented.

### Quality
- Responsive, accessible interface.
- Unit and integration tests.
- Automated linting, type checking, tests, and production builds.
- Clear API errors, loading states, retry options, and rate-limit handling.
- Deployment documentation and a public demo.

## Explicitly excluded from MVP

- GitHub OAuth and private repositories
- Required AI provider or paid AI API
- Full semantic source-code analysis
- Autonomous code changes or pull-request creation
- Cross-device accounts and workspaces
- Claims that setup or tests passed without actually running them

## Success measures

- Successful repository analyses
- Time required to find setup instructions
- Accuracy of detected scripts and manifest information
- Analysis failures and rate-limit encounters
- Completion of the core repository exploration journey

Use privacy-conscious, minimal analytics only if justified later and clearly disclosed.
