export type RepoId = { owner: string; repo: string };
export type RepoFile = { path: string; content: string };
export type Finding = { title: string; detail: string; path: string; kind: 'fact' | 'recommendation' | 'unknown'; sourceUrl: string };
export type GitHubRepository = {
  name: string; full_name: string; html_url: string; description: string | null;
  language: string | null; stargazers_count: number; forks_count: number;
  default_branch: string; license: { spdx_id: string } | null;
};
export type RepositoryAnalysis = {
  repository: GitHubRepository; readme: string | null; files: RepoFile[];
  findings: Finding[]; truncated: boolean; partialErrors: string[];
};
