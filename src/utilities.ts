// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c), 2023 Ernesto Ittig

/*
  This work is adapted from the
  [grc-utilities](https://en.wiktionary.org/wiki/Module:grc-utilities)
  module from Wiktionary, used under
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

  A copy of it may be found in the lua_source directory.
*/

import {
  combining_diacritic,
  conversions,
  diacritic,
  diacritic_order,
  diacritics,
  groups,
} from './data.ts';

const {
  macron,
  breve,
  spacing_macron,
  spacing_breve,
  rough,
  smooth,
  diaeresis,
  acute,
  grave,
  circum: circumflex,
  subscript,
} = diacritics;

const basic_Greek = '[\u0380-\u03ff]'; // excluding first line of Greek and Coptic block: ͰͱͲͳʹ͵Ͷͷͺͻͼͽ;Ϳ

const decompose = (x: string) => x.normalize('NFD');

interface Info {
  vowel?: boolean;
  offglide?: boolean;
  diacritic?: boolean;
}

const info: Record<string, Info> = {};
// The tables are shared among different characters so that they can be checked
// for equality if needed, and to use less space.
const vowel_t = { vowel: true };
const iota_t = { vowel: true, offglide: true };
const upsilon_t = { vowel: true, offglide: true };
// These don't need any contents.
const rho_t = {};
// local consonant_t = {}
const diacritic_t = { diacritic: true };
// Needed for equality comparisons.
const breathing_t = { diacritic: true };

const add_info = (chars: string | string[], t: Info) => {
  for (const char of chars) {
    info[char] = t;
  }
};

add_info(
  [macron, breve, diaeresis, acute, grave, circumflex, subscript],
  diacritic_t,
);

add_info([rough, smooth], breathing_t);
add_info('ΑΕΗΟΩαεηοω', vowel_t);
add_info('Ιι', iota_t);
add_info('Υυ', upsilon_t);
// add_info("ΒΓΔΖΘΚΛΜΝΞΠΡΣΤΦΧΨϜϘϺϷͶϠβγδζθκλμνξπρσςτφχψϝϙϻϸͷϡ", consonant_t)
add_info('Ρρ', rho_t);

const sparseConcat = (arr: unknown[]) =>
  arr.filter((v) => typeof v !== 'undefined').join('');

/**
 * Converts spacing to combining diacritics, and nonstandard to polytonic Greek
 * @param text the text to convert
 * @returns the text with diacritics converted
 */
export function standardDiacritics(text: string) {
  text = decompose(text);
  return text.replace(/./g, (x) => conversions[x] ?? x);
}

const reorderDiacriticSequence = (diacritics: string) => {
  const output = <string[]> [];
  for (const diacritic of diacritics) {
    let index = diacritic_order[diacritic];
    if (typeof output[index] === 'undefined') {
      output[index] = diacritic;
    } else {
      // Place breve after macron
      if (diacritic === breve) {
        index = index + 1;
      }
      // The following might have odd results when there
      // are three or more diacritics.
      output.splice(index, 0, diacritic);
    }
  }
  return sparseConcat(output);
};

/**
 * This function arranges diacritics in the following order:
 *
 * 1. macron or breve
 * 2. breathings or diaeresis
 * 3. acute, circumflex, or grave
 * 4. iota subscript
 *
 * @param diacritics text with diacritics
 * @returns the text with the diacritics in the correct order
 */
export function reorderDiacritics(text: string) {
  return decompose(text).replace(
    new RegExp(combining_diacritic + combining_diacritic + '+', 'g'),
    reorderDiacriticSequence,
  );
}

const make_tokens = (text: string) => {
  const tokens = <string[]> [];
  let prev_info: Info = {};
  let token_i = 0,
    vowel_count = 0;
  let prev;
  for (const character of decompose(text)) {
    const curr_info = info[character] ?? {};

    // Split vowels between tokens if not a diphthong.
    if (curr_info.vowel) {
      vowel_count = vowel_count + 1;
      if (
        prev &&
        (!(vowel_count === 2 && curr_info.offglide && prev_info.vowel) ||
          // υυ → υ, υ
          // ιυ → ι, υ
          (prev_info.offglide && curr_info === upsilon_t) ||
          curr_info === prev_info)
      ) {
        token_i = token_i + 1;
        if (prev_info.vowel) {
          vowel_count = 1;
        }
      } else if (vowel_count === 2) {
        vowel_count = 0;
      }
      tokens[token_i] = (tokens[token_i] ?? '') + character;
    } else if (curr_info.diacritic) {
      vowel_count = 0;
      tokens[token_i] = (tokens[token_i] ?? '') + character;
      if (prev_info.diacritic || prev_info.vowel) {
        if (character === diaeresis) {
          // Split the diphthong in the current token if a diaeresis was found:
          // the first letter, then the second letter plus any diacritics.
          const match = tokens[token_i].match(
            new RegExp('^(' + basic_Greek + ')(' + basic_Greek + '.+)'),
          );
          const previous_vowel = match?.[1];
          const vowel_with_diaeresis = match?.[2];
          if (previous_vowel) {
            tokens[token_i] = previous_vowel;
            tokens[token_i + 1] = vowel_with_diaeresis!;
            token_i = token_i + 1;
          } else {
            // The vowel preceding the vowel with the diaeresis will already be
            // placed in the previous token if it has a diacritic:
            // Περικλῆῐ̈ → Π ε ρ ι κ λ ῆ ῐ̈
            /*
						mw.log('Diaeresis was found in ' .. text .. ', but the previous token ' ..
							require("Module:Unicode data").add_dotted_circle(tokens[token_i]) ..
							' couldn’t be split because it does not consist of two Basic Greek characters followed by other characters.')
						*/
          }
        }
      } else if (prev_info === rho_t) {
        if (curr_info !== breathing_t) {
          console.error(
            `The character ${prev} in ${text} should not have the accent \u25cc${character} on it.`,
          );
        }
      } else {
        console.error(`The character ${prev} cannot have a diacritic on it.`);
      }
    } else {
      vowel_count = 0;
      if (prev) {
        token_i = token_i + 1;
      }
      tokens[token_i] = (tokens[token_i] ?? '') + character;
    }
    prev = character;
    prev_info = curr_info;
  }
  return tokens;
};

const cache: Record<string, string[]> = {};
/**
 * This breaks a word into meaningful "tokens", which are individual letters or
 * diphthongs with their diacritics.
 * @param text the text to tokenize
 * @returns an array of tokens from the text
 */
export function tokenize(text: string) {
  const decomposed = decompose(text);
  if (!Object.hasOwn(cache, decomposed)) {
    cache[decomposed] = make_tokens(text);
  }
  return cache[decomposed];
}

/**
 * Places diacritics in the following order:
 *
 * 1. breathings or diaeresis
 * 2. acute, circumflex, or grave
 * 3. macron or breve
 * 4. iota subscript

 * @param text text with diacritics
 * @returns the text with the diacritics in the pronunciation order
 */
export function pronunciationOrder(text: string) {
  text = standardDiacritics(text);

  if (new RegExp(groups.accents).test(text)) {
    text = text.replaceAll(
      new RegExp(diacritic + diacritic + '+', 'g'),
      (sequence) => {
        // Put breathing and diaeresis first, then accents, then macron or breve
        return [
          sequence.match(new RegExp(groups[2]))?.[0] ?? '',
          sequence.match(new RegExp(groups[3]))?.[0] ?? '',
          sequence.match(new RegExp(groups[1]))?.[0] ?? '',
          sequence.match(new RegExp(groups[4]))?.[0] ?? '',
        ].join('');
      },
    );
    text = text.replaceAll(macron, spacing_macron); // combining to spacing macron
    text = text.replaceAll(breve, spacing_breve); // combining to spacing breve
  }

  return text.normalize();
}
