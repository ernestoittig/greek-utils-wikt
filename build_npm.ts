import { build, emptyDir } from 'https://deno.land/x/dnt@0.33.1/mod.ts';
import { fromFileUrl } from 'https://deno.land/std@0.177.0/path/mod.ts';

const outDir = new URL(import.meta.resolve('./.npm/'));

await emptyDir(outDir);

await build({
  entryPoints: ['./mod.ts'],
  outDir: fromFileUrl(outDir),
  shims: {
    deno: 'dev',
  },
  package: {
    name: 'greek-utils-wikt',
    version: Deno.args[0],
    description:
      'Utilities for Modern and Polytonic Greek ported from Wiktionary modules',
    license: 'GPL-3.0-or-later',
    repository: {
      type: 'git',
      url: 'git+https://github.com/ernestoittig/greek-utils-wikt.git',
    },
    bugs: {
      url: 'https://github.com/ernestoittig/greek-utils-wikt/issues',
    },
    keywords: [
      'greek',
      'greek language',
      'string',
      'language',
      'transliterate',
    ],
  },
});

await Deno.copyFile('LICENSE', new URL('LICENSE', outDir));
await Deno.copyFile('README.md', new URL('README.md', outDir));
