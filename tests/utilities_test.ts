// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2023, Ernesto Ittig

import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { describe, it } from 'https://deno.land/std@0.177.0/testing/bdd.ts';
import {
  tokenize,
} from '../src/utilities.ts';

describe('tokenize', () => {
  for (
    const [f, t] of [
      ['Διί', 'Δ, ι, ί'],
      ['ιυ', 'ι, υ'],
      ['υυ', 'υ, υ'],
      ['υι', 'υι'],
      ['γᾰλεοῦ', 'γ, ᾰ, λ, ε, οῦ'],
      ['Λευίς', 'Λ, ευ, ί, ς'],
      ['ἀληθέι', 'ἀ, λ, η, θ, έ, ι'],
      ['πόλεως', 'π, ό, λ, ε, ω, ς'],
      ['πόλεων', 'π, ό, λ, ε, ω, ν'],
      ['οἷαι', 'οἷ, αι'],
      ['ΟἿΑΙ', 'ΟἿ, ΑΙ'],
      ['Αἰσχύλος', 'Αἰ, σ, χ, ύ, λ, ο, ς'],
      ['ἀναῡ̈τέω', 'ἀ, ν, α, ῡ̈, τ, έ, ω'],
      ['τούτῳ', 'τ, ού, τ, ῳ'],
    ]
  ) {
    it(t.normalize(), () => {
      assertEquals(tokenize(f).join(', '), t.normalize('NFD'));
    });
  }
});
