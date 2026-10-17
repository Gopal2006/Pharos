import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the product headline and planned feature areas', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /know a repository/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/public github repository url/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /understand the stack/i })).toBeInTheDocument();
    expect(screen.getByText(/public repositories only/i)).toBeInTheDocument();
  });
});
