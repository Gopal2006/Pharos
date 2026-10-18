import { describe, expect, it } from 'vitest';
import { analyzeFiles } from './repository';
describe('analyzeFiles', () => {
  it('extracts scripts and links evidence to the default branch source', () => {
    const findings = analyzeFiles([{ path: 'package.json', content: JSON.stringify({ scripts: { test: 'vitest run', dev: 'vite' } }) }, { path: 'pnpm-lock.yaml', content: '' }], 'main', 'https://github.com/acme/demo');
    expect(findings.map((finding) => finding.title)).toContain('Script: test');
    expect(findings.find((finding) => finding.title === 'Script: test')?.sourceUrl).toBe('https://github.com/acme/demo/blob/main/package.json');
    expect(findings.find((finding) => finding.title === 'Package manager')?.detail).toMatch(/pnpm/);
  });
  it('reports malformed JSON and supports no files without throwing', () => {
    expect(analyzeFiles([{ path: 'package.json', content: '{bad' }], 'main', 'https://github.com/a/b').map((finding) => finding.title)).toContain('Malformed package manifest');
    expect(analyzeFiles([], 'main', 'https://github.com/a/b')[0]?.kind).toBe('unknown');
  });
});
