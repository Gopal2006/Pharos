# Security Policy

## Supported versions

Pharos is in early development. Security fixes will be applied to the latest development version.

## Reporting a vulnerability

Please do not publish sensitive exploit details in a public issue. Use GitHub's private vulnerability reporting feature if it is enabled for this repository. Otherwise, contact the maintainer through a private channel listed on the GitHub profile.

## Security principles

- Do not put secrets or API credentials in client-side code.
- Treat repository content, README files, and issue text as untrusted input.
- Render Markdown safely and prevent unsafe HTML execution.
- Validate GitHub repository URLs before making requests.
- Avoid fetching arbitrary URLs supplied by users.
- Minimize stored data and disclose analytics if introduced.
