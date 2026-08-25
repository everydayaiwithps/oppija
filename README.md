# Oppija — wireframe v2

Microlearning for school teachers' AI literacy. Static site: HTML, CSS, vanilla JS.
No backend, no database, no accounts, no analytics, no cookies, no network requests
of any kind after the page loads.

Grounded in Shenoy, P., & Saarela, M. (2026). *Generative AI in teacher professional
development.* Discover Education. https://doi.org/10.1007/s44217-026-01579-7

---

## Files

| File | What it is |
|---|---|
| `index.html` | Structure only. Contains **no** user-visible text. |
| `app.css` | All styling. Tokens at the top; the palette lives nowhere else. |
| `content.js` | **Every string in the product**, plus the sets and cards. |
| `svg.js` | The diagram archetypes. Drawing code only, no text. |
| `app.js` | State, screens, navigation, overlays. |
| `DESIGN.md` | Palette, type, spacing, motion and accessibility decisions. |

## Deploy

Upload the folder. There is no build step and no configuration.

- **Vercel** — drag the folder onto the dashboard, or `vercel deploy`.
- **GitHub Pages** — commit to the repo root, enable Pages on the branch.
- **Any static host** — `index.html` at the root is all it needs.

Open `index.html` directly from disk to preview locally. Progress won't persist
under `file://` in some browsers because `localStorage` is restricted there; that
is a preview artifact, not a bug. Everything persists on a real domain.

---

## Editing content

### Change a card's text

Open `content.js`, find the set, edit the `text` value:

```js
{ type: "learn", layer: 2,
  text: { en: "That shortcut isn't laziness…",
          fi: "Oikotie ei ole laiskuutta…" } }
```

**Every card is capped at 140 characters, per language.** The cap is enforced at
runtime: if any card breaks it, the site paints a red error bar across the top
naming the offending set, card and language, and logs it to the console. You cannot
publish an overflowing card without seeing it.

`<b>` and `<i>` are allowed in card text and don't count toward the 140. House rule
from the spec: at most one bolded term per set, and never bold and italic on the
same card.

### Change the split on a judgement question

```js
split: [70, 30]     // must total 100
```

These are illustrative, and the UI always says so beneath the bar — the caption is
not optional and must not be removed until real pilot data replaces the numbers.

### Add a set

1. Add an object to `SETS` in `content.js` with `id`, `archetype`, `title`, `why`,
   and exactly **5 cards** — 4 `learn` cards plus one closing `question`.
2. Give each learn card a `layer` from 1 to 4. The archetype draws layers 1..n, so
   card 3 shows layers 1, 2 and 3.
3. Remove `draft: true` to unlock the tile on Home.

The validator refuses any live set that doesn't have 5 cards, a 2-option question,
an `answer` index on `correct` mode, or a split totalling 100 on `judgement` mode.

### Reorder sets

Move the objects inside `SETS`. Tile numbering and the completion count follow
automatically. Nothing else needs changing.

---

## How the diagram works

One base drawing per set. Layers **accrete** — card 3 shows layers 1–3, and layers
1–2 are identical to what the reader saw on card 2. The drawing is never replaced,
which is what makes the idea feel like it is being built.

Only a layer the reader has not seen before animates in. Going back and forward
again does not replay it.

Diagram labels live in `SVG_TEXT` in `content.js`, not in `svg.js`, so a translator
never has to open drawing code.

---

## Testing checklist

Run this before sharing a link.

- [ ] Clear `localStorage`, reload: language screen appears, both buttons work.
- [ ] First card of the first set shows the tap-zone overlay, once and never again.
- [ ] Walk all 5 cards forward and back. The diagram accretes; going back preserves
      a given answer.
- [ ] The question blocks forward movement until answered.
- [ ] **Reflow check**: note where the action row sits before answering; answer;
      it must not move by a single pixel. The `.result` block is pre-reserved at
      128px for exactly this reason.
- [ ] Nothing scrolls inside the player at 375×667.
- [ ] Repeat the whole run in Finnish. Finnish compounds are longer; nothing may
      truncate, wrap oddly, or push the frame.
- [ ] Keyboard only: Tab to a tile, Enter, then arrow keys through the set, Esc to
      exit. Never touch the mouse.
- [ ] Console shows zero errors and zero warnings.

---

## Not built yet

Deliberately stopped here for author review, per the build order in the spec.

- **Sets 2–10** — titles and archetypes are in `content.js`, marked `draft: true`,
  rendering as locked tiles. Card copy is not written.
- **Seven of the eight archetypes** — `flow` is complete. `rings`, `beforeAfter`,
  `steps`, `bigNumber`, `scene`, `bars` and `chat` are stubs with their signatures
  in place. None is reachable while its sets are drafts.
- **The `do` card** (Set 4) — schema is defined in `content.js`; the renderer lands
  with Set 4.
- **Finnish review** — every Finnish string is marked `// FI-REVIEW`. It is drafted,
  not reviewed. Do not put this in front of a Finnish audience until a native
  speaker has read every one.
- **Swipe** — v2 is tap zones and arrow keys only, as specified. Swipe is noted in
  `app.js` as a native-app addition.
