/* =============================================================================
   Oppija — SVG archetypes
   -----------------------------------------------------------------------------
   Each archetype is a function (layer, lang) => svg string.

   THE ACCRETION RULE
   One base drawing per set. Card n renders layers 1..n. Layers already on screen
   are byte-identical between cards, so the reader sees the same diagram being
   built rather than a new picture each time. Only the newly added layer gets the
   entrance animation, which app.js applies by tagging the highest layer group
   with class "enter".

   All colour comes from CSS custom properties so the palette lives in one place.
   All text comes from SVG_TEXT in content.js so a translator never opens this file.

   STATUS: `flow` is complete and is the only archetype Set 1 needs. The other
   seven are stubs with their signatures in place, to be built when Sets 2–10 are
   authored. They are unreachable from the UI while those sets are marked draft.
   ========================================================================== */

"use strict";

/* Shared canvas. 320 x 200 units, rendered at roughly 372px wide in the phone
   frame, so one unit ≈ 1.16px. Keep SVG text at 11 units or more to stay above
   the 11px rendered minimum set in DESIGN.md. */
const VB = { w: 320, h: 200 };

const svgOpen  = `<svg viewBox="0 0 ${VB.w} ${VB.h}" preserveAspectRatio="xMidYMid meet" class="diagram" role="img" xmlns="http://www.w3.org/2000/svg">`;
const svgClose = `</svg>`;

/* One arrowhead definition, reused by every archetype that needs it. */
const defs = `
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" class="fill-signal"/>
    </marker>
    <marker id="ah-dim" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" class="fill-line"/>
    </marker>
  </defs>`;

/* -----------------------------------------------------------------------------
   ARCHETYPE 1 — flow
   Two labelled boxes joined by an arrow. Used by Set 1 and Set 7.

   layer 1  task -> answer
   layer 2  "0 min thinking" annotation on the arrow
   layer 3  the arrow dims (the shortcut is being challenged)
   layer 4  a checkpoint bar lands on the arrow
   -------------------------------------------------------------------------- */

function flow(layer, lang) {
  const t = key => SVG_TEXT[key][lang];
  const dim = layer >= 3;                       // layers 3 and 4 both show a dim arrow

  /* Geometry note: boxes are 88 wide with a 120-unit gap between them. The gap
     has to hold the longest annotation in either language — "0 MIN AJATTELUA"
     at 15 characters — without touching a box edge. Do not widen the boxes. */
  const box = (x, label) => `
    <g>
      <rect x="${x}" y="84" width="88" height="52" rx="12" class="stroke-ink fill-surface"/>
      <text x="${x + 44}" y="115" class="lbl" text-anchor="middle">${label}</text>
    </g>`;

  /* layer 1 — the base drawing. Never redrawn; only its colour responds to `dim`. */
  let out = `
    <g class="layer l1">
      ${box(10, t("task"))}
      ${box(222, t("answer"))}
      <line x1="102" y1="110" x2="218" y2="110"
            class="${dim ? "stroke-line" : "stroke-signal"} arrow"
            marker-end="url(#${dim ? "ah-dim" : "ah"})"/>
    </g>`;

  /* layer 2 — the cost annotation, above the arrow and clear of both boxes */
  if (layer >= 2) out += `
    <g class="layer l2">
      <text x="160" y="66" class="ann ${dim ? "muted" : ""}" text-anchor="middle">${t("noThinking")}</text>
    </g>`;

  /* layer 3 — deliberately adds no geometry. The change the reader sees is the
     arrow going grey, which is handled by `dim` inside layer 1. Stacking a
     second line on top would break the accretion rule: the drawing must stay
     the same drawing. */

  /* layer 4 — the checkpoint lands on the arrow */
  if (layer >= 4) out += `
    <g class="layer l4">
      <rect x="155" y="80" width="11" height="60" rx="5" class="fill-signal"/>
      <text x="160" y="164" class="ann strong" text-anchor="middle">${t("checkpoint")}</text>
    </g>`;

  return svgOpen + defs + out + svgClose;
}

/* -----------------------------------------------------------------------------
   ARCHETYPES 2–8 — to be built with Sets 2–10
   Signatures are fixed now so content.js can already name them. Each returns the
   placeholder below until authored; no draft set is reachable from the UI, so
   this is never rendered in the current build.
   -------------------------------------------------------------------------- */

function placeholder() {
  return `${svgOpen}
    <rect x="60" y="70" width="200" height="60" rx="12" class="stroke-line fill-surface"/>
    <text x="160" y="105" class="ann muted" text-anchor="middle">NOT YET DRAWN</text>
  ${svgClose}`;
}

function rings(layer, lang)       { return placeholder(); }  // nested circles, one ring per layer
function beforeAfter(layer, lang) { return placeholder(); }  // two panels, right panel arrives at layer 2
function steps(layer, lang)       { return placeholder(); }  // three-chip strip, layers highlight chips
function bigNumber(layer, lang)   { return placeholder(); }  // figure in a ring, layers swap the caption
function scene(layer, lang)       { return placeholder(); }  // classroom composition, layers add labels
function bars(layer, lang)        { return placeholder(); }  // compared horizontal bars
function chat(layer, lang)        { return placeholder(); }  // student / AI bubbles, one per layer

/* Lookup used by the player. Set.archetype must be a key here. */
const ARCHETYPES = { flow, rings, beforeAfter, steps, bigNumber, scene, bars, chat };

function renderDiagram(archetype, layer, lang) {
  const fn = ARCHETYPES[archetype] || placeholder;
  return fn(layer, lang);
}
