// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2023, Ernesto Ittig

import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { describe, it } from 'https://deno.land/std@0.177.0/testing/bdd.ts';
import elTr from '../src/transliterate.ts';
import grcTr from '../src/grc-transliterate.ts';

const tr = (s: string) => elTr(s, false);

describe('el transliterate', () => {
  it('allows polytonic', () => {
    assertEquals(elTr('ταῦρος', true), grcTr('ταῦρος'));
  });
  it('general', () => {
    for (
      const [f, t] of [
        ['Ποσειδώνας', 'Poseidónas'],
        ['αγιοποιούμαι', 'agiopoioúmai'],
        ['αγγελιάζομαι', 'angeliázomai'],
        ['άμπελος', 'ámpelos'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });
  it('ypsilon', () => {
    for (
      const [f, t] of [
        ['αυτός', 'aftós'],
        ['πλευρά', 'plevrá'],
        ['άνευ', 'ánef'],
        ['άνευ προηγουμένου', 'ánef proïgouménou'],
        ['αύριο', 'ávrio'],
        ['αύξηση', 'áfxisi'],
        ['ευημερία', 'evimería'],
        ['καθαρεύουσα', 'katharévousa'],
        ['υπάρχω', 'ypárcho'],
        ['ευευ', 'evef'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });
  it('diaeresis added for disambiguation', () => {
    for (
      const [f, t] of [
        ['βοήθεια', 'voḯtheia'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });
  // this feature is not fully developed
  it('nasal–stop clusters', () => {
    for (
      const [f, t] of [
        // ['μπαμπάς', 'babás'],
        ['μπαίνω', 'baíno'],
        ['Μπάρος', 'Báros'],
        // ['\'\'\'μπαίνω\'\'\'', '\'\'\'baíno\'\'\''],
        // ['έμπαινα', 'ébaina'],
        // ['νταντά', 'dadá'],
        ['ντύνω', 'dýno'],
        // ['έντυσα', 'édysa'],
        ['ντετέκτιβ', 'detéktiv'],
        ['Ντιζόν', 'Dizón'],
        // ['Έβαλε \'\'\'ντετέκτιβ\'\'\'', 'Évale \'\'\'detéktiv\'\'\''],
        ['εντάξει', 'entáxei'],
        // ['γκαράζ', 'garáz'],
        // ['ανάγκη', 'anángi'],
        ['Αγγλία', 'Anglía'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });
  it('diphthongs ending in iota', () => {
    for (
      const [f, t] of [
        ['είναι', 'eínai'],
        ['οικείος', 'oikeíos'],
        ['κορόιδο', 'koróido'],
        ['κοροϊδεύω', 'koroïdévo'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });
  it('Parenthesis', () => {
    for (
      const [f, t] of [
        ['ψεύ(της)', 'pséf(tis)'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });

  it('omega iota', () => {
    for (
      const [f, t] of [
        ['νωί', 'noḯ'],
        ['Ωιν', 'Oïn'],
      ]
    ) {
      assertEquals(tr(f).normalize(), t.normalize());
    }
  });
});
