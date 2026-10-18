import type { RepoId } from '../../types/repository';

export function parseRepositoryUrl(value: string): RepoId {
  if (!value.trim()) throw new Error('Enter a GitHub repository URL.');
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error('Enter a valid URL such as https://github.com/owner/repository.'); }
  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com' || url.port) throw new Error('Use a public repository URL on https://github.com.');
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length !== 2 || parts.some((part) => part === '.' || part === '..')) throw new Error('Use a repository URL with exactly an owner and repository name.');
  const [owner, repoPart] = parts;
  const repo = repoPart?.replace(/\.git$/i, '');
  if (!owner || !repo || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) throw new Error('The owner or repository name is missing or invalid.');
  return { owner, repo };
}
