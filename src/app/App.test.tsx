import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { analyzeRepository } from '../lib/github/analyze';

vi.mock('../lib/github/analyze', () => ({ analyzeRepository: vi.fn() }));

describe('App', () => {
  it('renders the product headline and planned feature areas', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /know a repository/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/public github repository url/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /understand the stack/i })).toBeInTheDocument();
    expect(screen.getByText(/public repositories only/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore repository/i })).toBeEnabled();
  });

  it('shows URL validation inline', () => {
    render(<App />); fireEvent.click(screen.getByRole('button', { name: /explore repository/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/enter a github repository url/i);
  });

  it('submits a repository URL and renders successful analysis', async () => {
    vi.mocked(analyzeRepository).mockResolvedValue({ repository: { name: 'react', full_name: 'facebook/react', html_url: 'https://github.com/facebook/react', description: 'UI library', language: 'JavaScript', stargazers_count: 1, forks_count: 2, default_branch: 'main', license: { spdx_id: 'MIT' } }, readme: '# React', files: [], findings: [{ title: 'Manifest', detail: 'Detected', path: 'package.json', kind: 'fact', sourceUrl: 'https://github.com/facebook/react/blob/main/package.json' }], truncated: false, partialErrors: [] });
    render(<App />); fireEvent.change(screen.getByLabelText(/public github repository url/i), { target: { value: 'https://github.com/facebook/react' } }); fireEvent.click(screen.getByRole('button', { name: /explore repository/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'facebook/react' })).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /package.json/i })).toHaveAttribute('href', 'https://github.com/facebook/react/blob/main/package.json');
  });
});
