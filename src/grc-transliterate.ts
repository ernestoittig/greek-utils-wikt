// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2023, Ernesto Ittig

/*
  This work is adapted from the
  [grc-translit](https://en.wiktionary.org/wiki/Module:grc-translit)
  module from Wiktionary, used under
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

  A copy of it may be found in the lua_source directory.
*/

import { diacritics } from './data.ts';
import { tokenize } from './utilities.ts';

const {
  // Greek
  circum: circumflex,
  diaeresis,
  smooth,
  rough,
  macron,
  breve,
  subscript,
  // Latin
  Latin_circum: hat,
} = diacritics;

const macron_diaeresis = new RegExp(`${macron}${diaeresis}?${hat}`);
const a_subscript = new RegExp(`^[αΑ].*${subscript}$`);
const velar = 'κγχξ';

const tt = {
  // Vowels
  ['α']: 'a',
  ['ε']: 'e',
  ['η']: 'e' + macron,
  ['ι']: 'i',
  ['ο']: 'o',
  ['υ']: 'u',
  ['ω']: 'o' + macron,

  // Consonants
  ['β']: 'b',
  ['γ']: 'g',
  ['δ']: 'd',
  ['ζ']: 'z',
  ['θ']: 'th',
  ['κ']: 'k',
  ['λ']: 'l',
  ['μ']: 'm',
  ['ν']: 'n',
  ['ξ']: 'x',
  ['π']: 'p',
  ['ρ']: 'r',
  ['σ']: 's',
  ['ς']: 's',
  ['τ']: 't',
  ['φ']: 'ph',
  ['χ']: 'kh',
  ['ψ']: 'ps',

  // Archaic letters
  ['ϝ']: 'w',
  ['ϻ']: 'ś',
  ['ϙ']: 'q',
  ['ϡ']: 'š',
  ['ͷ']: 'v',

  // Incorrect characters: see [[Wiktionary:About Ancient Greek#Miscellaneous]].
  // These are tracked by [[Module:script utilities]].
  ['ϐ']: 'b',
  ['ϑ']: 'th',
  ['ϰ']: 'k',
  ['ϱ']: 'r',
  ['ϲ']: 's',
  ['ϕ']: 'ph',

  // Diacritics
  // unchanged: macron, diaeresis, grave, acute
  [breve]: '',
  [smooth]: '',
  [rough]: '',
  [circumflex]: hat,
  [subscript]: 'i',
};

/**
 * Transliterates Polytonic Greek words or phrases into the Latin alphabet.
 *
 * It follows the [Wiktionary rules for Ancient Greek transliteration](https://en.wiktionary.org/wiki/WT:GRC_TR)
 *
 * @param text the text to transliterate
 * @returns the text transliterated into the Latin alphabet
 */
export default function grcTransliterate(text: string) {
  if (text === '῾') {
    return 'h';
  }
  /*
    Replace semicolon or Greek question mark with regular question mark,
    except after an ASCII alphanumeric character (to avoid converting
    semicolons in HTML entities).
  */
  text = text.replace(/([^A-Za-z0-9])[;\u037e]/g, '$1?');

  // Handle the middle dot. It is equivalent to semicolon or colon, but semicolon is probably more common.
  text = text.replaceAll('·', ';');

  const tokens = tokenize(text);

  const output = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let translit = token.toLowerCase().replace(/./g, (m) => tt[m] ?? m);
    const next_token = tokens[i + 1];

    if (token === 'γ' && next_token && velar.includes(next_token)) {
      translit = 'n';
    } else if (token === 'ρ' && tokens[i - 1] === 'ρ') {
      translit = 'rh';
    } else if (token.match(a_subscript)) {
      translit = translit.replace(/([aA])/g, `$1${macron}`);
    }

    if (token.match(rough)) {
      if (token.match(/^[Ρρ]/)) {
        translit += 'h';
      } else {
        translit = 'h' + translit;
      }
    }

    if (translit.match(macron_diaeresis)) {
      translit = translit.replaceAll(macron, '');
    }

    if (token !== token.toLowerCase()) {
      translit = translit.replace(/^./, (x) => x.toUpperCase());
    }

    output.push(translit);
  }

  return output.join('').normalize();
}
