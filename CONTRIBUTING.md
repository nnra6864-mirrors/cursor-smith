# Contributing to Cursor-Smith

Thanks for wanting to help! Cursor-Smith is made by one writer, for writers, and it tries hard to stay light and fast. Here's what helps most and how to send it.

## Welcome any time

- **Bug fixes.** One fix per pull request, with the steps that show the bug.
- **Translation fixes.** If you use Cursor-Smith in one of its languages, corrections to `src/i18n/<code>.ts` are gold.
- **Docs.** Anything in `README.md` or `BUILDING.md` that's wrong, unclear, or out of date.
- **Your cursor.** Made a look you love? Share it in the [Cursor Showcase](https://github.com/Sadsnake1/cursor-smith/issues/44).

## Ask first

- **A new effect.** Open an issue before you write it: say what it does and when it fires, and show it if you can (a sketch, a mockup, another app that does it). I want to see an effect move before it goes in, so the pull request needs a short video or GIF of it running.
- **New features, new settings, or a change to how something works.** Open an issue, or comment on one, before you write code. A quick yes or no saves you a weekend.
- **Bigger reworks** (the engine, the settings window, presets and share codes). Describe the shape you have in mind first and I'll say what fits.

Questions and ideas go in issues too.

## Not a fit

- No runtime dependencies. The plugin ships with none.
- No network calls, telemetry, or AI features.
- No code, sounds or images that aren't MIT-compatible. Sounds are real recordings, CC0 or CC BY with the credit.

## Build it

```
npm install
npm run check     # TypeScript
npm run lint      # Obsidian's plugin review rules
npm run build     # main.js
npm test          # the test suite
```

To try it, copy `main.js`, `styles.css` and `manifest.json` into `<vault>/.obsidian/plugins/cursor-smith/`. Use a spare vault, not the one you write in. [BUILDING.md](BUILDING.md) maps the source.

## Ground rules for code

- `npm run check` and `npm run lint` come back clean. The lint is Obsidian's own review: no `any`, no `innerHTML`, no disable comments for its rules.
- Every word the plugin shows goes through `t('...')`, in US English, and gets a line in every table in `src/i18n/`. The tests fail until it has one.
- A new effect has its own switch, off by default, and works on every cursor shape and with several cursors.
- The cursor is drawn every frame, so it has to stay cheap. An effect stops drawing once it has nothing left to show, and it respects Reduced motion and Low power mode.
- A new setting gets a default that changes nothing for people who already use Cursor-Smith. Renaming or reshaping a setting needs a migration in `migrateLegacyKeys`, so saved looks, presets and share codes keep working.
- Cursor-Smith runs on phones and tablets too, so no Node or Electron APIs (`fs`, `path`, `require`, `child_process`). If you change a layout, check it at phone width.
- Use Obsidian's own classes and CSS variables, so themes keep working. Check the default theme in light and dark.
- Fix the thing. Don't build a framework around it.

## Translations

The interface's languages live in `src/i18n/`, one file per language.

- The key is the English line exactly as `t()` gets it; the value is the translation.
- Keep `{placeholders}` as they are, untranslated.
- Use the words Obsidian itself uses in your language (Settings, Hotkeys, Editor...), so the plugin reads like the rest of the app.
- Two rows on one page can't share a name, so two settings need two different translations.
- `npm test` checks that every table has every line, with the same placeholders.
- To see it, switch Obsidian's language (Settings → General → Language) and restart.

## Your pull request

- Say what it changes and why, and how you tested it: your Obsidian version, desktop or phone, which theme.
- A short video or GIF for anything that moves, a before and after screenshot for anything else you can see.
- `check`, `lint` and `test` clean.
- Leave the version numbers and `main.js` alone. Releases are versioned and built from the tag.

I read every pull request myself and try every effect before it's merged, so I may adjust your change, port it by hand, or ask for changes. You're credited by name in the release notes (and maybe I'll send some cake too).

## Reporting a bug

- Your Cursor-Smith and Obsidian versions
- Your system or device, and your theme
- The steps that make it happen, and a screenshot or short video if it's something you see
- Your cursor's share code (Presets → the copy icon on its card), so I can see it with your exact look
- If Obsidian feels slow with it on: run **Cursor-Smith: Performance report** from the command palette and paste the report

## License

By contributing, you agree your work is released under the MIT license, like the rest of Cursor-Smith.
