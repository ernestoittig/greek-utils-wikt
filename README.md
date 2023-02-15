# Wiktionary Greek Utilities

This is a Typescript library of utilities for Modern and Ancient Greek ported
from MediaWiki Modules from Wiktionary originally written in Lua.

It includes functions to transliterate both Polytonic and Modern Greek into the
Latin alphabet, and functions to normalize combining diacritics, among others.

Maybe in the future I will also port the code for pronunciation and inflections.

## Installation

This project was originally created using [Deno](https://deno.land), and
transformed to an npm package using [dnt](https://github.com/denoland/dnt).

### Deno

```ts
import {
  data,
  tokenize,
  tr,
  /* ... */
} from 'https://deno.land/x/grek-utils-wikt/mod.ts';
```

or directly from files:

```ts
import tr from 'https://deno.land/x/grek-utils-wikt/src/transliterate.ts';
import { tokenize } from 'https://deno.land/x/grek-utils-wikt/src/utilities.ts';
import data from 'https://deno.land/x/grek-utils-wikt/src/data.ts';
/* ... */
```

### Node

```sh
npm install --save greek-utils-wikt
# or with pnpm
pnpm add greek-utils-wikt
# or with yarn
yarn add greek-utils-wikt
```

then import it: (you can also use ESM)

```js
const wikt = require('greek-utils-wikt');
```

## Docs

You can find the docs for this package in the
[deno module page](https://deno.land/x/grek-utils-wikt).
