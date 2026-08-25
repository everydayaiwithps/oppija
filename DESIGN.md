# Oppija — design decisions

Written before implementation, as required by the build spec. Every value below is
declared once in `app.css` as a custom property. Nothing in the codebase should
introduce a colour, size or duration that is not on this page.

---

## 1. Direction

Calm, Nordic, institutional. The product is opened by a school principal, a funding
board, and a tired teacher on a Tuesday. It has to look like something a public
university would put its name on, and like something that respects the reader's time.

The whole surface is deliberately quiet so that **one** element can carry the design:
the accreting diagram. Boldness is spent there and nowhere else.

One moment of play is allowed — the completion state — because finishing a concept is
the only emotional beat in the product.

### Deliberately avoided

| Cliché | Why it's out |
|---|---|
| Warm cream + terracotta + high-contrast serif | The current default look of AI-generated pages |
| Near-black canvas with a single acid-green accent | Same, and it reads as a developer tool, not a teaching product |
| Broadsheet hairlines, zero radius, dense columns | Editorial affectation; wrong register for a classroom tool |
| Gradients, glows, glass, drop shadows on everything | Dates instantly, and costs projector contrast |

---

## 2. Palette

Six core values plus two state colours. Cool greys with a slight blue-green bias so
they sit under the teal accent as a family rather than as neutral filler.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#E8EDEF` | Page ground. Pale lake grey. |
| `--surface` | `#FFFFFF` | Cards, tiles, sheets. |
| `--ink` | `#0E1D26` | All primary text. Deep slate, not black. |
| `--ink-soft` | `#55676F` | Secondary text, meta lines, captions. |
| `--line` | `#D2DDE1` | Hairlines, inactive progress track, option borders. |
| `--signal` | `#146B7C` | The single accent. Progress fill, links, focus ring, diagram key line. |

State colours, used nowhere except the states they name:

| Token | Hex | Role |
|---|---|---|
| `--affirm` | `#2A7355` | "Correct" on correct-mode questions only. |
| `--warm` | `#C8791A` | The completion screen only. The one moment of play. |

**Wrong answers get no colour.** The spec forbids punishment, so a wrong choice is
rendered in `--ink-soft` on `--line`, visually quieter than the right answer rather
than louder. There is no red in this product.

**Single theme, committed.** No dark mode. Every colour is painted explicitly so the
page cannot inherit a host theme and become unreadable. A projector and a phone in
sunlight are the two hostile cases, and both want high contrast on light ground.

Contrast: `--ink` on `--surface` is 15.8:1. `--ink-soft` on `--surface` is 6.2:1.
`--signal` on `--surface` is 5.4:1. All clear AA at body size.

---

## 3. Typography

**System stack, no font file.** A demo that stalls on a font request is a demo that
fails. The spec permits one self-hosted file; we spend zero instead and buy the
difference back with weight, size and tracking discipline.

| Role | Stack | Treatment |
|---|---|---|
| Display | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | 700, `-0.022em`, 28px / 22px |
| Body | same | 400–500, 19px card text, 17px UI, **never below 16px on mobile** |
| Meta | `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace` | 11–12px, uppercase, `+0.1em` |

The monospace meta line is the typographic signature: card counts, "5 CARDS · 3 MIN",
diagram labels, the illustrative-split caption. It reads as instrumentation rather than
decoration, which is the right note for a research-grounded product.

Card copy is capped at 140 characters and set at 19px/1.45. That is roughly four lines
in the 372px text column — the fixed text zone is sized to hold five, so Finnish
compounds have somewhere to go.

---

## 4. Spacing and geometry

Scale: **4, 8, 12, 16, 24, 32, 48, 64**. Nothing off-scale.

Radius: `4px` chips and bars, `12px` option buttons and tiles, `20px` the visual panel
and bottom sheets. Progress bar and pills are fully round.

Player column: **420px** maximum. On desktop it sits centred on a `--paper` ground with
a hairline and no shadow — a document on a desk, not a phone floating in space.

Frame heights use `100dvh` throughout. `100vh` is banned; it breaks under the iOS
Safari toolbar collapse.

---

## 5. Signature element — the accreting diagram

The one place with real design investment.

- Flat fills only. Two colours (`--ink`, `--signal`) plus `--line` and `--paper`.
- Labels inside SVG use the meta treatment: uppercase mono, minimum 11px *rendered*
  (13 viewBox units at the 320-unit width, which scales to ~13px in the phone frame).
- One base drawing per set. Layers **accrete** — card 3 shows layers 1–3, and layers
  1–2 are pixel-identical to what the reader already saw. The drawing is never redrawn,
  which is what makes the idea feel like it is being built rather than illustrated.
- A newly added layer fades and rises 6px over 240ms. Prior layers do not animate.
- Under `prefers-reduced-motion: reduce`, layers appear with no transition at all.

---

## 6. Motion

Restrained to three uses. Everything else is instant.

| Where | What | Duration |
|---|---|---|
| New diagram layer | fade + 6px rise | 240ms |
| Screen change | 120ms fade | 120ms |
| Completion check | stroke draw, then a single 6% scale settle | 520ms |

All three are disabled under `prefers-reduced-motion: reduce`, where the completion
check simply appears drawn.

---

## 7. Accessibility commitments

- Visible focus: 2px `--signal` ring, 3px offset, on every interactive element.
- Tap zones are real `<button>` elements with `aria-label`s — invisible, but tabbable
  and announced.
- Full keyboard run: arrow keys navigate, Enter answers, Esc exits. No mouse required.
- Minimum touch target 44×44, including the flag and save icons.
- `aria-live="polite"` on the toast and on question feedback.
- Language switching sets `<html lang>` so screen readers change voice.
