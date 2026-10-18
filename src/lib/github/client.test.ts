import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRepository, GitHubError } from './client';
afterEach(() => vi.unstubAllGlobals());
describe('GitHub client', () => {
  it('parses repository response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ name: 'demo' }), { status: 200 })));
    await expect(getRepository({ owner: 'acme', repo: 'demo' })).resolves.toMatchObject({ name: 'demo' });
  });
  it('surfaces not found errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));
    await expect(getRepository({ owner: 'acme', repo: 'demo' })).rejects.toBeInstanceOf(GitHubError);
  });
});
