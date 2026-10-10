// Cursor-Smith in Obsidian's own language (1.8.1): English and the ten
// most used besides it - Chinese (Simplified and Traditional), Japanese,
// Korean, German, French, Spanish, Portuguese (Brazil), Russian, Italian
// ("if the obsidian language is changed we give the translations too",
// "support the top 10 languages", 2026-10-11).
//
// Every string the plugin shows is written in English in the code, and
// t() looks it up by that English text in the table for Obsidian's
// language (Settings -> General -> Language, getLanguage()). A string
// with no translation yet, or a language with no table, stays English -
// a missing entry can never blank or break a row. The language is read
// once, on the first lookup: Obsidian restarts to change it.
//
// A string that carries a value is written with a named slot,
// t("Saved as {name}.", { name }), so a translation can put the value
// where its own grammar wants it.
import { getLanguage } from "obsidian";
import { ZH } from "./zh";
import { ZH_TW } from "./zh-tw";
import { JA } from "./ja";
import { KO } from "./ko";
import { DE } from "./de";
import { FR } from "./fr";
import { ES } from "./es";
import { PT_BR } from "./pt-br";
import { RU } from "./ru";
import { IT } from "./it";

// Obsidian's language codes (its translations' own, getLanguage()).
export const TABLES: Record<string, Readonly<Record<string, string>>> = {
  zh: ZH, "zh-TW": ZH_TW, ja: JA, ko: KO, de: DE, fr: FR, es: ES, "pt-BR": PT_BR, ru: RU, it: IT,
};
// A language read with another's table: European Portuguese with the
// Brazilian one, the closest there is.
const ALIASES: Record<string, string> = { pt: "pt-BR" };

// The table in use: undefined until the first lookup, null for English.
let table: Readonly<Record<string, string>> | null | undefined;

// Obsidian's language code ("en", "zh", "zh-TW", ...); English when the
// API is missing (an older Obsidian, the tests' stub).
export function appLanguage(): string {
  try {
    return (typeof getLanguage === "function" && getLanguage()) || "en";
  } catch {
    return "en"; // an Obsidian whose getLanguage throws: English
  }
}

// The strings asked for, collected while a test asks (test 23 checks that
// every one has a translation); null the rest of the time.
let seen: Set<string> | null = null;
export function collectStrings(set: Set<string> | null): void {
  seen = set;
}

// The table to use from now on: a language code, or null to read
// Obsidian's again on the next lookup (the tests).
export function setLocale(code: string | null): void {
  table = code === null ? undefined : tableFor(code);
}

// The table for a language code, or null (English, or one there is none for).
function tableFor(code: string): Readonly<Record<string, string>> | null {
  return TABLES[code] || TABLES[ALIASES[code]] || null;
}

// The languages there is a table for.
export function locales(): string[] {
  return Object.keys(TABLES);
}

export function t(en: string, vars?: Record<string, string | number>): string {
  if (table === undefined) table = tableFor(appLanguage());
  if (seen && en) seen.add(en);
  let s = (en && table && table[en]) || en;
  if (vars) s = s.replace(/\{(\w+)\}/g, (slot, k: string) => (k in vars ? String(vars[k]) : slot));
  return s;
}

// A dropdown's options with their labels translated (the values stay).
export function tOpts<T extends Record<string, string>>(options: T): T {
  const out: Record<string, string> = {};
  for (const k of Object.keys(options)) out[k] = t(options[k]);
  return out as T;
}

// A number written the language's way: 1.5 in English, 1,5 in German,
// French, Italian, Russian...
export function tNumber(n: number, digits: number): string {
  try {
    return new Intl.NumberFormat(appLanguage(), { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  } catch {
    return n.toFixed(digits); // a language code Intl does not know: the plain form
  }
}

// A summary of parts joined by " · " ("Box · gradient · rounded"), each
// part translated on its own.
export function tParts(s: string, sep = " · "): string {
  return s.split(sep).map((p) => t(p)).join(sep);
}
