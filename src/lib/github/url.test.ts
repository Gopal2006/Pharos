import { describe, expect, it } from 'vitest';
import { parseRepositoryUrl } from './url';
describe('parseRepositoryUrl', () => {
  it('normalizes a public repository URL', () => { expect(parseRepositoryUrl('https://github.com/vercel/next.js')).toEqual({ owner: 'vercel', repo: 'next.js' }); });
  it.each(['', 'junk', 'https://gitlab.com/a/b', 'http://github.com/a/b', 'https://github.com/a', 'https://github.com/a/b/issues', 'https://github.com/a/b/tree/main'])('rejects %s', (url) => { expect(() => parseRepositoryUrl(url)).toThrow(); });
});
