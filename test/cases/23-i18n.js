// The plugin in Obsidian's language (1.8.1, src/i18n): t() and its slots,
// the fallback to English, every table complete against what the plugin
// shows (test/i18n-strings.js), and the panel rendered in a translation.
// One of the files test/test.js runs in order; see test/lib.js.
const { T, ok, section } = require("../lib");
const { collect } = require("../i18n-strings");
const { renderWholePanel } = require("../panel_harness");

const english = collect();
const slots = (s) => (s.match(/\{\w+\}/g) || []).sort().join(",");

section("i18n: lookups");
{
  T.setLocale("en");
  ok("English: a string comes back as written", T.t("Off") === "Off" && T.t("Smooth movement") === "Smooth movement");
  ok("...a slot is filled", T.t("Saved as {name}.", { name: "Ember" }) === "Saved as Ember.");
  ok("...an unknown slot is left as it is", T.t("Saved as {name}.", {}) === "Saved as {name}.");
  T.setLocale("zh");
  ok("Chinese: a string comes back translated", T.t("Off") === T.ZH.Off && T.t("Off") !== "Off");
  ok("...its slot filled where the translation puts it", T.t("Saved as {name}.", { name: "Ember" }).includes("Ember") && !T.t("Saved as {name}.", { name: "Ember" }).includes("{name}"));
  ok("...a string with no entry stays English", T.t("No such string, ever") === "No such string, ever");
  ok("...dropdown labels translated, their values kept", (() => { const o = T.tOpts({ ease: "Ease out", linear: "Linear" }); return Object.keys(o).join() === "ease,linear" && o.ease === T.ZH["Ease out"]; })());
  ok("...a summary part by part", T.tParts("Box · gradient · 1.5×") === [T.ZH.Box, T.ZH.gradient, "1.5×"].join(" · "));
  // The language is Obsidian's: read off getLanguage() on the first lookup.
  globalThis.__csTestLanguage = "ja";
  T.setLocale(null);
  ok("the language is Obsidian's (getLanguage)", T.appLanguage() === "ja" && T.t("Off") === T.TABLES.ja.Off);
  globalThis.__csTestLanguage = "pt";
  T.setLocale(null);
  ok("...Portuguese takes the Brazilian table", T.t("Off") === T.TABLES["pt-BR"].Off);
  globalThis.__csTestLanguage = "nl";
  T.setLocale(null);
  ok("...a language with no table stays English", T.t("Off") === "Off");
  delete globalThis.__csTestLanguage;
  T.setLocale("en");
}

section("i18n: every table complete");
{
  ok("the English strings are collected (the panel, the notices, the commands)", english.length > 400 && english.includes("Smooth movement") && english.includes("Cursor-Smith: report copied to the clipboard.") && english.includes("Toggle Vim mode"), english.length);
  for (const code of T.locales()) {
    const table = T.TABLES[code];
    const missing = english.filter((s) => !(s in table));
    ok(`${code}: every string the plugin shows has a translation`, missing.length === 0, missing.slice(0, 12));
    const stale = Object.keys(table).filter((k) => !english.includes(k));
    ok(`${code}: no entry for a string the plugin no longer shows`, stale.length === 0, stale.slice(0, 12));
    const bad = Object.keys(table).filter((k) => typeof table[k] !== "string" || !table[k].trim() || slots(k) !== slots(table[k]));
    ok(`${code}: every translation non-empty, with the English's {slots}`, bad.length === 0, bad.slice(0, 12));
  }
}

section("i18n: the panel in a translation");
{
  T.setLocale("zh");
  let rows = null, error = null;
  try { rows = renderWholePanel({ popEffects: true, smoothEnabled: true, userPresets: { Mine: T.pickLook(Object.assign({}, T.DEFAULT_SETTINGS)) } }); } catch (e) { error = e; }
  ok("the whole panel renders in Chinese", !error && rows && rows.length > 50, error && error.message);
  const names = (rows || []).map((r) => r.name).filter(Boolean);
  ok("...its rows named in Chinese", names.includes(T.ZH["Smooth movement"]) && !names.includes("Smooth movement") && names.includes(T.ZH["Cursor style"]));
  const pages = ((rows && rows.pages) || []).map((p) => p.name);
  ok("...its pages too", pages.includes(T.ZH.Effects) && pages.includes(T.ZH.Appearance) && !pages.includes("Appearance"));
  const effects = ((rows && rows.pages) || []).find((p) => p.name === T.ZH["Smooth movement"]);
  ok("...a page's summary in Chinese", !!effects && effects.displayValue === T.ZH.On, effects && effects.displayValue);
  T.setLocale("en");
}

section("i18n: no two rows of a page named alike in any language");
{
  // Obsidian keys a group's rows by name: two English names that one
  // translation gives the same words ("Spark count" and "Spark quantity",
  // both 火花数量 once) would make one row of two. The harness throws on a
  // duplicate, as Obsidian errs; the whole panel, CUA and Vim, every table.
  const presets = { userPresets: { Mine: T.pickLook(Object.assign({}, T.DEFAULT_SETTINGS)) } };
  const proto = require("../harness").prototype;
  for (const code of T.locales()) {
    T.setLocale(code);
    let error = null;
    const was = proto._vimEditMode;
    try {
      renderWholePanel(Object.assign({}, presets));
      for (const mode of ["normal", "command"]) { proto._vimEditMode = mode; renderWholePanel({ uiMode: "vim", vimModeEnabled: true, vimStatusBar: true, vimPresets: { Setup: T.DEFAULT_SETTINGS.vimModes } }); }
    } catch (e) { error = e; } finally { proto._vimEditMode = was; }
    ok(`${code}: the whole panel renders, every row its own name`, !error, error && error.message);
  }
  T.setLocale("en");
}
