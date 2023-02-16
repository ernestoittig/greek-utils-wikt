// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2023, Ernesto Ittig

import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { describe, it } from 'https://deno.land/std@0.177.0/testing/bdd.ts';
import {
  pronunciationOrder,
  reorderDiacritics,
  standardDiacritics,
  tokenize,
} from '../src/utilities.ts';

describe('standardDiacritics', () => {
  for (const [f, t] of [['ἄ˘κρος', 'ἄ̆κρος']]) {
    it(
      t.normalize(),
      () => assertEquals(standardDiacritics(f).normalize(), t.normalize()),
    );
  }
});

describe('reorderDiacritics', () => {
  for (
    const [f, t] of [
      ['ά̓̆νερ', 'ᾰ̓́νερ'],
      ['ᾰ̓́̄', 'ᾱ̆̓́'],
      ['ά̓̆̄', 'ᾱ̆̓́'],
      ['ά̓̄̆', 'ᾱ̆̓́'],
    ]
  ) {
    it(
      t.normalize(),
      () =>
        assertEquals(reorderDiacritics(f).normalize('NFD'), t.normalize('NFD')),
    );
  }
});

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

describe('pronunciationOrder', () => {
  for (
    const [f, t] of [
      ['ἐᾱ́ν', 'ἐά¯ν'],
      ['γᾰ́ρ', 'γά˘ρ'],
      ['ᾰ̓λλᾰ́', 'ἀ˘λλά˘'],
    ]
  ) {
    it(t.normalize(), () => {
      assertEquals(pronunciationOrder(f).normalize(), t.normalize());
    });
  }
});
