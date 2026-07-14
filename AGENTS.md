## Writing style (MANDATORY for all docs content)

This is public, Google-indexed content. Write so it does not read as machine-generated.

- **Never use the em dash (`—`, U+2014).** Not in prose, headings, code comments,
  frontmatter, tables, or anywhere else. Use a comma, colon, semicolon,
  parentheses, or split into two sentences instead. Pick whatever is
  grammatically correct in context; do not create comma splices.
  - Also avoid the en dash (`–`, U+2013) in prose; a plain hyphen or "to" (for
    ranges) is fine.
- **Avoid AI-tell filler phrases.** Do not write: "That's the whole idea",
  "That's it", "delve", "dive deep", "it's worth noting", "in a nutshell",
  "the important half", "rest assured", "goes to die", "burning into memory",
  "sails through", "under the hood" as filler, or similar clichés. State the
  fact plainly.
- **Internal links must be absolute**, e.g. `[structs](/structs/)`, never
  relative like `[structs](structs/)` (a relative link 404s from a nested URL).
- Keep prose direct and concrete; prefer short sentences over dashes-as-connectors.

When adding or editing any Markdown/MDX under `src/content/docs/`, apply the
above and grep the file for `—` before finishing (there must be zero matches).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
