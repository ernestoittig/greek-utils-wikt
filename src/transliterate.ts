// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2023, Ernesto Ittig

/*
  This work is adapted from the
  [el-translit](https://en.wiktionary.org/wiki/Module:el-translit)
  module from Wiktionary, used under
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

  A copy of it may be found in the lua_source directory.
*/

import grcTransliterate from './grc-transliterate.ts';

import { diacritics } from './data.ts';
const { acute, diaeresis } = diacritics;

// deno-fmt-ignore
const tt: Record<string, string> = {
	["α"]: "a",  ["ά"]: "á",  ["β"]: "v",  ["γ"]: "g",  ["δ"]: "d",
	["ε"]: "e",  ["έ"]: "é",  ["ζ"]: "z",  ["η"]: "i",  ["ή"]: "í",
	["θ"]: "th", ["ι"]: "i",  ["ί"]: "í",  ["ϊ"]: "ï",  ["ΐ"]: "ḯ",
	["κ"]: "k",  ["λ"]: "l",  ["μ"]: "m",  ["ν"]: "n",  ["ξ"]: "x",
	["ο"]: "o",  ["ό"]: "ó",  ["π"]: "p",  ["ρ"]: "r",  ["σ"]: "s",
	["ς"]: "s",  ["τ"]: "t",  ["υ"]: "y",  ["ύ"]: "ý",  ["ϋ"]: "ÿ",
	["ΰ"]: "ÿ́",  ["φ"]: "f",  ["χ"]: "ch", ["ψ"]: "ps", ["ω"]: "o",
	["ώ"]: "ó",
	["Α"]: "A",  ["Ά"]: "Á",  ["Β"]: "V",  ["Γ"]: "G",  ["Δ"]: "D",
	["Ε"]: "E",  ["Έ"]: "É",  ["Ζ"]: "Z",  ["Η"]: "I",  ["Ή"]: "Í",
	["Θ"]: "Th", ["Ι"]: "I",  ["Ί"]: "Í",  ["Κ"]: "K",  ["Λ"]: "L",
	["Μ"]: "M",  ["Ν"]: "N",  ["Ξ"]: "X",  ["Ο"]: "O",  ["Ό"]: "Ó",
	["Π"]: "P",  ["Ρ"]: "R",  ["Σ"]: "S",  ["Τ"]: "T",  ["Υ"]: "Y",
	["Ύ"]: "Ý",  ["Φ"]: "F",  ["Χ"]: "Ch", ["Ψ"]: "Ps", ["Ω"]: "O",
	["Ώ"]: "Ó",
// punctuation
	["·"]: ";",
};

/**
 * Transliterates Polytonic or Modern Greek words or phrases into the Latin alphabet.
 *
 * If using Polytonic Greek, it uses the [Wiktionary rules for Ancient Greek transliteration](https://en.wiktionary.org/wiki/WT:GRC_TR)
 *
 * If using Modern Greek, it uses the [Wiktionary rules for Greek transliteration](https://en.wiktionary.org/wiki/WT:EL_TR)
 *
 * @param text the text to transliterate
 * @param polytonic whether the text is Polytonic Greek. Defaults to `true`
 * @returns the text transliterated into the Latin alphabet
 */
export default function tr(text: string, polytonic = true) {
  if (polytonic) return grcTransliterate(text);

  text = text.replaceAll('χ̌', 'š').replaceAll('Χ̌', 'Š'); // dialectal
  text = text.replaceAll('ά̤', 'ä́').replaceAll('Ά̤', 'Ä́'); // dialectal
  text = text.replaceAll('α̤', 'ä').replaceAll('Α̤', 'Ä'); // dialectal
  text = text.replaceAll('ό̤', 'ö́').replaceAll('Ό̤', 'Ö́'); // dialectal
  text = text.replaceAll('ο̤', 'ö').replaceAll('Ο̤', 'Ö'); // dialectal

  text = text.replaceAll(/([^A-Za-z0-9])[;\u037e]/g, '$1?');

  text = text.replaceAll(
    /([αεηΑΕΗ])([υύ])/g,
    (match, vowel: string, upsilon: string, offset: number) => {
      let position = offset + match.length;
      let following = '';
      while (true) {
        const next = text.substring(position, position + 1);
        if (next === '') { // reached end of string
          break;
        } else if (/[\s\p{P}]/u.test(next)) {
          position = position + 1;
        } else {
          following = next;
          break;
        }
      }
      return tt[vowel] +
        (upsilon === 'ύ' && acute || '') +
        ((following === '' || 'θκξπσςτφχψ'.includes(following)) && 'f' || 'v');
    },
  );

  text = text.replaceAll(
    /([αεοωΑΕΟΩ])([ηή])/g,
    (_, vowel: string, ita: string) => {
      if (ita === 'ή') {
        return tt[vowel] + 'i' + diaeresis + acute;
      } else {
        return tt[vowel] + 'i' + diaeresis;
      }
    },
  );

  text = text.replaceAll(/[ωΩ][ιί]/g, (x) =>
    // deno-fmt-ignore
    ({
      ["ωι"]: "oï", ["ωί"]: "oḯ",
      ["Ωι"]: "Oï", ["Ωί"]: "Oḯ",
    } as Record<string, string>)[x]);

  text = text.replaceAll(/[οΟ][υύ]/g, (x) =>
    // deno-fmt-ignore
    ({
      ["ου"]: "ou", ["ού"]: "oú",
      ["Ου"]: "Ou", ["Ού"]: "Oú",
    } as Record<string, string>)[x]);

  text = text.replaceAll(/(.?)([μΜ])π/g, (m, before: string, mi: string) => {
    if (before === '' || before === ' ' || before === '-') {
      if (mi === 'Μ') {
        return before + 'B';
      } else {
        return before + 'b';
      }
    }
    return m;
  });

  text = text.replaceAll(/(.?)([νΝ])τ/g, (m, before: string, ni: string) => {
    if (before === '' || before === ' ' || before === '-') {
      if (ni === 'Ν') {
        return before + 'D';
      } else {
        return before + 'd';
      }
    }
    return m;
  });

  text = text.replaceAll(/γ([γξχ])/g, 'n$1');

  text = text.replaceAll(/./g, (m) => tt[m] ?? m);

  return text;
}
