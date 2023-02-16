// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2023, Ernesto Ittig

import {
  assertEquals,
  assertNotEquals,
} from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { describe, it } from 'https://deno.land/std@0.177.0/testing/bdd.ts';
import tr from '../src/grc-transliterate.ts';

describe('grc transliterate', () => {
  it('general', () => {
    for (
      const [f, t] of [
        ['λόγος', 'lógos'],
        ['σφίγξ', 'sphínx'],
        ['ϝάναξ', 'wánax'],
        ['οἷαι', 'hoîai'],
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('current problems', () => {
    for (
      const [f, t] of [
        ['ΙΧΘΥΣ', 'IKHTHUS'],
        ['\'\'\'Υ\'\'\'ἱός', '\'\'\'Hu\'\'\'iós'],
      ]
    ) {
      assertNotEquals(tr(f), t);
    }
  });

  it('u/y', () => {
    for (
      const [f, t] of [
        ['ταῦρος', 'taûros'],
        ['νηῦς', 'nēûs'],
        ['σῦς', 'sûs'],
        ['ὗς', 'hûs'],
        ['γυῖον', 'guîon'],
        ['ἀναῡ̈τέω', 'anaṻtéō'],
        ['δαΐφρων', 'daḯphrōn'],
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('vowel length', () => {
    for (
      const [f, t] of [
        ['τῶν', 'tôn'],
        ['τοὶ', 'toì'],
        ['τῷ', 'tôi'],
        ['τούτῳ', 'toútōi'],
        ['σοφίᾳ', 'sophíāi'],
        ['μᾱ̆νός', 'mānós'], // should perhaps be mā̆nos
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('h (rough breathing)', () => {
    for (
      const [f, t] of [
        ['ὁ', 'ho'],
        ['οἱ', 'hoi'],
        ['εὕρισκε', 'heúriske'],
        ['ὑϊκός', 'huïkós'],
        ['πυρρός', 'purrhós'],
        ['ῥέω', 'rhéō'],
        ['σάἁμον', 'sáhamon'],
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('capitals', () => {
    for (
      const [f, t] of [
        ['Ὀδυσσεύς', 'Odusseús'],
        ['Εἵλως', 'Heílōs'],
        ['ᾍδης', 'Hā́idēs'],
        ['ἡ Ἑλήνη', 'hē Helḗnē'],
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('punctuation', () => {
    for (
      const [f, t] of [
        [
          'ἔχεις μοι εἰπεῖν, ὦ Σώκρατες, ἆρα διδακτὸν ἡ ἀρετή;',
          'ékheis moi eipeîn, ô Sṓkrates, âra didaktòn hē aretḗ?',
        ],
        [
          'τί τηνικάδε ἀφῖξαι, ὦ Κρίτων; ἢ οὐ πρῲ ἔτι ἐστίν;',
          'tí tēnikáde aphîxai, ô Krítōn? ḕ ou prṑi éti estín?',
        ],
        // This ought to be colon, but sadly that cannot be.
        [
          'τούτων φωνήεντα μέν ἐστιν ἑπτά· α ε η ι ο υ ω.',
          'toútōn phōnḗenta mén estin heptá; a e ē i o u ō.',
        ],
        ['πήγ(νῡμῐ)', 'pḗg(nūmi)'],
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('HTML entities', () => {
    for (
      const [f, t] of [
        ['καλός&nbsp;καὶ&nbsp;ἀγαθός', 'kalós&nbsp;kaì&nbsp;agathós'],
        ['καλός&#32;καὶ&#32;ἀγαθός', 'kalós&#32;kaì&#32;agathós'],
      ]
    ) {
      assertEquals(tr(f), t);
    }
  });

  it('just h', () => {
    assertEquals(tr('῾'), 'h');
  });
});
