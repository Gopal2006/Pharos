import type { Finding, RepoFile } from '../types/repository';

const manifests: Record<string, string> = {
  'package.json': 'JavaScript / Node.js project manifest', 'pnpm-lock.yaml': 'pnpm lockfile', 'yarn.lock': 'Yarn lockfile', 'package-lock.json': 'npm lockfile',
  'pyproject.toml': 'Python project manifest', 'requirements.txt': 'Python dependency list', 'Cargo.toml': 'Rust project manifest', 'go.mod': 'Go module definition',
  'pom.xml': 'Maven project manifest', 'build.gradle': 'Gradle project manifest', 'build.gradle.kts': 'Gradle Kotlin project manifest',
  Dockerfile: 'Docker build configuration', 'docker-compose.yml': 'Docker Compose configuration', 'compose.yaml': 'Docker Compose configuration', Makefile: 'Make task definitions', 'CONTRIBUTING.md': 'Contribution guidance',
};
const entryNames = /^(README(?:\.md)?|src\/(?:main|index|app)\.[^/]+|app\/(?:main|index)\.[^/]+|index\.(?:html|ts|tsx|js|jsx)|\.github\/workflows\/[^/]+)$/i;
export function analyzeFiles(files: RepoFile[], branch: string, repoUrl: string): Finding[] {
  const findings: Finding[] = [];
  const add = (title: string, detail: string, path: string, kind: Finding['kind'] = 'fact') => findings.push({ title, detail, path, kind, sourceUrl: `${repoUrl}/blob/${branch.split('/').map(encodeURIComponent).join('/')}/${path.split('/').map(encodeURIComponent).join('/')}` });
  const byPath = new Map(files.map((file) => [file.path, file]));
  for (const file of files) {
    const base = file.path.split('/').at(-1) ?? file.path;
    if (manifests[base]) add(manifests[base], 'This file was found in the repository tree.', file.path);
    if (file.path.startsWith('.github/workflows/')) add('Continuous integration workflow', 'A GitHub Actions workflow is present; inspect it for build and test steps.', file.path);
    if (entryNames.test(file.path)) add('Useful project file', 'Likely starting point or project configuration.', file.path);
  }
  const pkg = byPath.get('package.json');
  if (pkg) {
    try {
      const parsed: unknown = JSON.parse(pkg.content);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('invalid object');
      const scripts = (parsed as { scripts?: unknown }).scripts;
      if (typeof scripts === 'object' && scripts !== null && !Array.isArray(scripts)) {
        for (const [name, command] of Object.entries(scripts)) if (typeof command === 'string') add(`Script: ${name}`, `Run with the detected package manager: ${command}`, 'package.json');
        if ('test' in scripts) add('Test command', 'Run the package test script using the detected package manager.', 'package.json', 'recommendation');
        if ('dev' in scripts) add('Development command', 'Run the package development script using the detected package manager.', 'package.json', 'recommendation');
      }
    } catch { add('Malformed package manifest', 'package.json could not be parsed as valid JSON; other findings are still available.', 'package.json', 'unknown'); }
  }
  const managers = [['pnpm-lock.yaml', 'pnpm'], ['yarn.lock', 'Yarn'], ['package-lock.json', 'npm']] as const;
  for (const [path, manager] of managers) if (byPath.has(path)) add('Package manager', `${manager} is indicated by its lockfile.`, path);
  for (const [path, command] of [['Makefile', 'make'], ['requirements.txt', 'pip install -r requirements.txt']] as const) if (byPath.has(path)) add('Setup clue', `Possible setup command: ${command}`, path, 'recommendation');
  if (!files.length) add('Analysis unavailable', 'No supported files could be read from the repository.', 'README.md', 'unknown');
  return findings;
}
