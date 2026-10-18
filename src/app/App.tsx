import { useEffect, useRef, useState, type FormEvent } from 'react';
import { analyzeRepository } from '../lib/github/analyze';
import { GitHubError } from '../lib/github/client';
import { parseRepositoryUrl } from '../lib/github/url';
import type { RepositoryAnalysis } from '../types/repository';

export default function App() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    try { parseRepositoryUrl(url); } catch (problem) { setAnalysis(null); setError(problem instanceof Error ? problem.message : 'Enter a valid GitHub URL.'); return; }
    controller.current?.abort(); const current = new AbortController(); controller.current = current; setLoading(true);
    try { const result = await analyzeRepository(url, current.signal); if (!current.signal.aborted) setAnalysis(result); }
    catch (problem) { if (!current.signal.aborted) { setAnalysis(null); setError(problem instanceof GitHubError ? problem.message : 'Analysis failed. Please try again.'); } }
    finally { if (!current.signal.aborted) setLoading(false); }
  }
  return <main className="page-shell">
    <nav className="topbar" aria-label="Main navigation"><a className="brand" href="/" aria-label="Pharos home"><span className="brand-mark" aria-hidden="true">⌁</span><span>Pharos</span></a><span className="nav-note">Navigate any codebase.</span></nav>
    <section className="hero" aria-labelledby="hero-title"><p className="eyebrow"><span className="status-dot" /> PUBLIC REPOSITORY ANALYZER</p><h1 id="hero-title">Know a repository<br /><span>before you dive in.</span></h1><p className="hero-copy">Explore project structure, find setup instructions, and discover where to start — with findings linked to the source.</p>
      <form className="repo-form" onSubmit={submit} noValidate><label className="sr-only" htmlFor="repo-url">Public GitHub repository URL</label><span className="input-icon" aria-hidden="true">↗</span><input id="repo-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://github.com/owner/repository" aria-invalid={Boolean(error)} aria-describedby={error ? 'form-error' : 'form-hint'} /><button type="submit" disabled={loading}>{loading ? 'Analyzing…' : 'Explore repository'} <span aria-hidden="true">→</span></button></form>
      {error ? <p className="form-error" id="form-error" role="alert">{error}</p> : <p className="form-hint" id="form-hint">Public repositories only · No sign-in required</p>}
    </section>
    {loading && <section className="notice" role="status" aria-live="polite">Loading repository metadata, file tree, README, and relevant project files…</section>}
    {analysis && <section className="results" aria-labelledby="repo-title"><header className="repo-heading"><div><p className="eyebrow">REPOSITORY ANALYSIS</p><h2 id="repo-title">{analysis.repository.full_name}</h2><p>{analysis.repository.description || 'No description provided.'}</p></div><a className="external-link" href={analysis.repository.html_url} target="_blank" rel="noreferrer">Open on GitHub ↗</a></header>
      <div className="stats">{[['Language', analysis.repository.language], ['Stars', analysis.repository.stargazers_count.toLocaleString()], ['Forks', analysis.repository.forks_count.toLocaleString()], ['License', analysis.repository.license?.spdx_id], ['Default branch', analysis.repository.default_branch]].map(([label, value]) => <div className="stat" key={label}><span>{label}</span><strong>{value || 'Not specified'}</strong></div>)}</div>
      {analysis.partialErrors.length > 0 && <div className="notice" role="status">{analysis.partialErrors.join(' ')}</div>}
      <div className="result-grid"><section className="result-card"><h3>Findings</h3>{analysis.findings.length ? <ul className="finding-list">{analysis.findings.map((finding, index) => <li key={`${finding.path}-${finding.title}-${index}`}><div><strong>{finding.title}</strong><span className={`kind kind-${finding.kind}`}>{finding.kind}</span></div><p>{finding.detail}</p><a href={finding.sourceUrl} target="_blank" rel="noreferrer">{finding.path} ↗</a></li>)}</ul> : <p>No supported manifests or useful files were found in the available tree.</p>}</section>
        <section className="result-card"><h3>README preview</h3>{analysis.readme ? <pre className="readme-preview">{analysis.readme.slice(0, 9000)}{analysis.readme.length > 9000 ? '\n… README preview shortened' : ''}</pre> : <p>No README was found for this repository.</p>}</section></div>
    </section>}
    {!analysis && !loading && <section className="feature-grid" aria-label="What Pharos helps you find">{[['⌘', 'Understand the stack', 'See project metadata, key files, and the tools a repository uses.'], ['▷', 'Get it running', 'Find setup commands and scripts backed by actual project files.'], ['⌁', 'Find your entry point', 'Explore important files and contribution guidance without guesswork.']].map(([icon, title, copy]) => <article className="feature-card" key={title}><span className="feature-icon" aria-hidden="true">{icon}</span><h2>{title}</h2><p>{copy}</p></article>)}</section>}
    <footer className="footer"><span>Navigate any codebase.</span><span>Analysis is based on public GitHub files.</span></footer>
  </main>;
}
