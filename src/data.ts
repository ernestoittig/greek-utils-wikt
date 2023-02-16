// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c), 2023 Ernesto Ittig

/*
  This work is adapted from the
  [grc-utilities/data](https://en.wiktionary.org/wiki/Module:grc-utilities/data)
  module from Wiktionary, used under
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

  A copy of it may be found in the lua_source directory.
*/

/**
 * Contains shared data for Greek language processing
 * @module
 */

const macron = '\u0304';
const spacing_macron = '\u00AF';
const modifier_macron = '\u02C9';
const breve = '\u0306';
const spacing_breve = '\u02D8';
const rough = '\u0314';
const smooth = '\u0313';
const diaeresis = '\u0308';
const acute = '\u0301';
const grave = '\u0300';
const circum = '\u0342';
const Latin_circum = '\u0302';
const coronis = '\u0343';
const subscript = '\u0345';
const undertie = '\u035C'; // actually "combining double breve below;

export const diacritics = {
  macron,
  spacing_macron,
  modifier_macron,
  breve,
  spacing_breve,
  rough,
  smooth,
  diaeresis,
  acute,
  grave,
  circum,
  Latin_circum,
  coronis,
  subscript,
  undertie,
  all: '',
};

diacritics.all = Object.values(diacritics).join('');

export const named = diacritics;

export const diacritic = `[${diacritics.all}]`;

export const diacritic_groups = {
  [1]: '[' + macron + breve + ']',
  [2]: '[' + diaeresis + smooth + rough + ']',
  [3]: '[' + acute + grave + circum + ']',
  [4]: subscript,
  accents: '',
};

export const groups = diacritic_groups;
diacritic_groups.accents = groups[3];

export const diacritic_order: Record<string, number> = {
  [macron]: 1,
  [breve]: 1,
  [rough]: 2,
  [smooth]: 2,
  [diaeresis]: 2,
  [acute]: 3,
  [grave]: 3,
  [circum]: 3,
  [subscript]: 4,
};

export const diacritical_conversions: Record<string, string> = {
  // Convert spacing to combining diacritics
  [spacing_macron]: macron, // macron
  [modifier_macron]: macron,
  [spacing_breve]: breve, // breve
  ['῾']: rough, // rough breathing, modifier letter reversed comma
  ['ʽ']: rough,
  ['᾿']: smooth, // smooth breathing, modifier letter apostrophe, coronis, combining coronis
  ['ʼ']: smooth,
  [coronis]: smooth,
  ['´']: acute, // acute
  ['`']: grave, // grave
  ['῀']: circum, // Greek circumflex (perispomeni), circumflex, combining circumflex
  ['ˆ']: circum,
  [Latin_circum]: circum,
  ['῎']: smooth + acute, // smooth and acute
  ['῍']: smooth + grave, // smooth and grave
  ['῏']: smooth + circum, // smooth and circumflex
  ['῞']: rough + acute, // rough and acute
  ['῝']: rough + grave, // rough and grave
  ['῟']: rough + circum, // rough and circumflex
  ['¨']: diaeresis,
  ['΅']: diaeresis + acute,
  ['῭']: diaeresis + grave,
  ['῁']: diaeresis + circum,
};
export const conversions = diacritical_conversions;

export const consonants = 'ΒβΓγΔδΖζΘθΚκΛλΜμΝνΞξΠπΡρΣσςΤτΦφΧχΨψ';
export const consonant = `[${consonants}]`;
export const vowels = 'ΑαΕεΗηΙιΟοΥυΩω';
export const vowel = `[${vowels}]`;
// deno-fmt-ignore
export const combining_diacritics = [
  macron, breve,
  rough, smooth, diaeresis,
  acute, grave, circum,
  subscript,
].join('');
export const combining_diacritic = `[${combining_diacritics}]`;

// Basic letters with and without diacritics
const letters_with_diacritics = 'ΆΈ-ώϜϝἀ-ᾼῂ-ῌῐ-\u1fdbῚῠ-Ῥῲ-ῼ';
export const word_characters = letters_with_diacritics + combining_diacritics +
  undertie;
export const word_character = `[${word_characters}]`;
