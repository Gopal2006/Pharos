export default function App() {
  return (
    <main className="page-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="RepoCompass home">
          <span className="brand-mark" aria-hidden="true">⌁</span>
          <span>RepoCompass</span>
        </a>
        <span className="nav-note">Repository onboarding, simplified</span>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow"><span className="status-dot" /> YOUR NEXT CODEBASE, DECODED</p>
        <h1 id="hero-title">Know a repository<br /><span>before you dive in.</span></h1>
        <p className="hero-copy">
          Explore project structure, find setup instructions, and discover where to start —
          with findings linked to the source.
        </p>

        <form className="repo-form" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="repo-url">Public GitHub repository URL</label>
          <span className="input-icon" aria-hidden="true">↗</span>
          <input id="repo-url" type="url" placeholder="https://github.com/owner/repository" />
          <button type="submit" disabled>Explore repository <span aria-hidden="true">→</span></button>
        </form>
        <p className="form-hint">Public repositories only · No sign-in required</p>
      </section>

      <section className="feature-grid" aria-label="What RepoCompass will help you find">
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">⌘</span>
          <h2>Understand the stack</h2>
          <p>See project metadata, key files, and the tools a repository uses.</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">▷</span>
          <h2>Get it running</h2>
          <p>Find setup commands and scripts backed by actual project files.</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">⌁</span>
          <h2>Find your entry point</h2>
          <p>Explore open issues and contribution guidance without guesswork.</p>
        </article>
      </section>

      <footer className="footer">
        <span>Built for curious developers.</span>
        <span className="footer-status"><span className="status-dot" /> Early development</span>
      </footer>
    </main>
  );
}
