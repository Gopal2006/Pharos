import type { GitHubRepository, RepoFile, RepoId } from '../../types/repository';

const api = 'https://api.github.com';
export class GitHubError extends Error { constructor(message: string, public status?: number) { super(message); this.name = 'GitHubError'; } }
async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try { response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal }); }
  catch (error) { if (error instanceof DOMException && error.name === 'AbortError') throw error; throw new GitHubError('Network request failed. Check your connection and try again.'); }
  if (!response.ok) {
    if (response.status === 404) throw new GitHubError('Repository not found or not publicly accessible.', 404);
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') throw new GitHubError('GitHub API rate limit reached. Wait a little while, then retry.', 403);
    throw new GitHubError(`GitHub returned an error (${response.status}). Please retry.`, response.status);
  }
  return response.json() as Promise<T>;
}
const repoUrl = ({ owner, repo }: RepoId) => `${api}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
export type TreeEntry = { path: string; type: string; sha: string };
export async function getRepository(id: RepoId, signal?: AbortSignal) { return request<GitHubRepository>(repoUrl(id), signal); }
export async function getTree(id: RepoId, branch: string, signal?: AbortSignal) {
  return request<{ tree: TreeEntry[]; truncated: boolean }>(`${repoUrl(id)}/git/trees/${encodeURIComponent(branch)}?recursive=1`, signal);
}
export async function getReadme(id: RepoId, signal?: AbortSignal): Promise<string | null> {
  try {
    const data = await request<{ content: string; encoding: string }>(`${repoUrl(id)}/readme`, signal);
    return data.encoding === 'base64' ? decodeBase64(data.content) : data.content;
  } catch (error) { if (error instanceof GitHubError && error.status === 404) return null; throw error; }
}
function decodeBase64(content: string) { const binary = atob(content.replace(/\s/g, '')); const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0)); return new TextDecoder().decode(bytes); }
export async function getFile(id: RepoId, path: string, branch: string, signal?: AbortSignal): Promise<RepoFile> {
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  const data = await request<{ content: string; encoding: string }>(`${repoUrl(id)}/contents/${encoded}?ref=${encodeURIComponent(branch)}`, signal);
  return { path, content: data.encoding === 'base64' ? decodeBase64(data.content) : data.content };
}
