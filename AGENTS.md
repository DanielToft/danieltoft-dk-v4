## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Git

Keep a flat, linear history on `main`:

- Merge PRs with **rebase** or **squash** — never with a merge commit.
- Bring a branch up to date by rebasing it on `main` (`git rebase main`), not by merging `main` into it.

Commits and PRs are authored by the developer only: no `Co-Authored-By: Claude` trailers and no "Generated with Claude Code" footers. Claude Code's attribution is switched off in `.claude/settings.json`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
