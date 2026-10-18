import type { RepositoryAnalysis, RepoFile } from '../../types/repository';
import { analyzeFiles } from '../../analyzers/repository';
import { getFile, getReadme, getRepository, getTree } from './client';
import { parseRepositoryUrl } from './url';

const supported = new Set(['package.json','pnpm-lock.yaml','yarn.lock','package-lock.json','pyproject.toml','requirements.txt','Cargo.toml','go.mod','pom.xml','build.gradle','build.gradle.kts','Dockerfile','docker-compose.yml','compose.yaml','Makefile','CONTRIBUTING.md']);
export async function analyzeRepository(input: string, signal?: AbortSignal): Promise<RepositoryAnalysis> {
  const id = parseRepositoryUrl(input);
  const repository = await getRepository(id, signal);
  const partialErrors: string[] = [];
  const [treeResult, readmeResult] = await Promise.allSettled([getTree(id, repository.default_branch, signal), getReadme(id, signal)]);
  if (treeResult.status === 'rejected' && signal?.aborted) throw treeResult.reason;
  if (readmeResult.status === 'rejected' && signal?.aborted) throw readmeResult.reason;
  const tree = treeResult.status === 'fulfilled' ? treeResult.value : null;
  const readme = readmeResult.status === 'fulfilled' ? readmeResult.value : null;
  if (!tree) partialErrors.push('The file tree could not be loaded.');
  if (readmeResult.status === 'rejected') partialErrors.push('README could not be loaded.');
  const wanted = (tree?.tree ?? []).filter((entry) => entry.type === 'blob' && (supported.has(entry.path.split('/').at(-1) ?? '') || entry.path.startsWith('.github/workflows/') || /^(src|app)\//.test(entry.path) && /(^|\/)(main|index|app)\.[^/]+$/.test(entry.path))).slice(0, 45);
  const settled = await Promise.allSettled(wanted.map((entry) => getFile(id, entry.path, repository.default_branch, signal)));
  const files: RepoFile[] = settled.flatMap((result) => result.status === 'fulfilled' ? [result.value] : []);
  if (settled.some((result) => result.status === 'rejected')) partialErrors.push('Some relevant files could not be read; the analysis may be incomplete.');
  const findings = analyzeFiles(files, repository.default_branch, repository.html_url);
  if (tree?.truncated) partialErrors.push('GitHub marked this file tree as truncated; some files may be missing.');
  return { repository, readme, files, findings, truncated: tree?.truncated ?? false, partialErrors };
}
