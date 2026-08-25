/* =============================================================================
   Oppija — application
   -----------------------------------------------------------------------------
   Plain vanilla JS. No build step, no dependencies, no network requests.

   Reading order:
     1. state + persistence
     2. small helpers (i18n, DOM, icons)
     3. screens: language, home, player, completion
     4. overlays: why sheet, about, first-run hint, toast
     5. input: taps, keyboard
     6. boot

   NOTE ON innerHTML: all content is authored by us in content.js and is allowed
   to carry <b> and <i>. There is no user-generated content anywhere in this
   product, and nothing is ever fetched, so template injection has no vector
   here. If that ever changes, sanitise card text at the point of render.

   NOT IMPLEMENTED IN v2 (deliberate, per spec):
     - swipe gestures. Tap zones and arrow keys only. Swipe belongs to the
       native app build; see the gesture engine in the OPPIJA prototype for a
       finger-tracking pager that can be lifted across.
     - the `do` card type (Set 4). Schema is defined in content.js; the renderer
       lands with Set 4.
   ========================================================================== */

"use strict";

/* =============================================================================
   1. STATE
   ========================================================================== */

const KEY = "oppija.v2";

const DEFAULTS = {
  lang: null,          // "en" | "fi" | null before first choice
  completed: [],       // set ids
  saved: [],           // "setId:cardIndex"
  flags: [],           // "setId:cardIndex"
  seenHint: false,
  muted: false
};

let S = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? Object.assign({}, DEFAULTS, JSON.parse(raw)) : Object.assign({}, DEFAULTS);
  } catch (e) {
    return Object.assign({}, DEFAULTS);          // private mode, storage blocked
  }
}
function saveState() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}

/* Live player state. Progress inside a set is never persisted — a set is
   completed in one sitting, per spec. */
let P = null;

/* =============================================================================
   2. HELPERS
   ========================================================================== */

const $ = sel => document.querySelector(sel);

/* Pull the active language out of an {en, fi} object. */
const t = obj => (obj && obj[S.lang || "en"]) || "";

/* Fill {placeholders}. */
const fmt = (str, vals) => str.replace(/\{(\w+)\}/g, (_, k) => vals[k]);

const cardId = (setId, i) => setId + ":" + i;

const liveSets   = () => SETS.filter(s => !s.draft);
const setById    = id => SETS.find(s => s.id === id);
const isDone     = id => S.completed.indexOf(id) > -1;

/* Inline icons. Kept here rather than in markup so index.html stays string-free. */
const ICON = {
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  chev:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`,
  tick:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4.5 4.5L19 7"/></svg>`,
  flag:  `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4h9l-1 3h6l-1.5 5 1.5 5h-8l-1-3H5"/></svg>`,
  heart: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20z"/></svg>`,
  heartOn: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20z"/></svg>`,
  arrowL:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>`,
  arrowR:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>`
};

/* Screen router. */
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
}

/* =============================================================================
   3. SCREENS
   ========================================================================== */

/* ---- 3.1 language ------------------------------------------------------- */
function renderLang() {
  $("#s-lang").innerHTML = `
    <h1 class="wordmark" id="lang-h">${UI.langTitle.en}</h1>
    <p class="prompt">${UI.langPrompt.en} · ${UI.langPrompt.fi}</p>
    <div class="langbtns">
      <button class="langbtn" data-lang="en">${UI.langEn.en}</button>
      <button class="langbtn" data-lang="fi">${UI.langFi.fi}</button>
    </div>`;
  show("s-lang");
}

/* ---- 3.2 home ----------------------------------------------------------- */
function renderHome() {
  document.documentElement.lang = S.lang;

  const total = SETS.length;
  const done  = S.completed.length;

  const tiles = SETS.map((set, i) => {
    if (set.draft) {
      return `<button class="tile" disabled>
        <span class="n">${i + 1}</span>
        <span class="tt"><b>${t(set.title)}</b><span class="meta">${t(UI.soon)}</span></span>
      </button>`;
    }
    const d = isDone(set.id);
    return `<button class="tile ${d ? "done" : ""}" data-set="${set.id}">
      <span class="n">${d ? ICON.tick : i + 1}</span>
      <span class="tt"><b>${t(set.title)}</b><span class="meta">${t(UI.cardMeta)}</span></span>
      <span class="chev">${ICON.chev}</span>
    </button>`;
  }).join("");

  const savedItems = S.saved.length
    ? S.saved.map(id => {
        const [sid, idx] = id.split(":");
        const set = setById(sid);
        if (!set || !set.cards || !set.cards[idx]) return "";
        return `<li>${t(set.cards[idx].text)}</li>`;
      }).join("")
    : `<li class="empty">${t(UI.savedEmpty)}</li>`;

  $("#s-home").innerHTML = `
    <div class="home-head">
      <div class="home-top">
        <h1 class="wordmark">${UI.langTitle.en}</h1>
        <button class="langswitch" id="langswitch">${t(UI.switchLang)}</button>
      </div>
      <p class="promise">${t(UI.promise)}</p>
      <div class="summary">
        <span class="meta">${fmt(t(UI.progressSummary), { done: done, total: total })}</span>
        <span class="bar"><i style="width:${Math.round(done / total * 100)}%"></i></span>
      </div>
    </div>

    <div class="tiles">${tiles}</div>

    <div class="saved">
      <h2 class="meta">${t(UI.savedHeading)}</h2>
      <ul class="savedlist">${savedItems}</ul>
    </div>

    <div class="home-foot">
      <button id="aboutlink">${t(UI.footerResearch)}</button>
      <p>${t(UI.footerPrivacy)}</p>
    </div>`;

  show("s-home");
}

/* ---- 3.3 player --------------------------------------------------------- */

function openSet(setId) {
  const set = setById(setId);
  if (!set || set.draft) return;
  P = { set: set, i: 0, answered: {}, lastLayer: 0 };
  renderCard();
  show("s-player");
  if (!S.seenHint) showHint();
}

function currentCard() { return P.set.cards[P.i]; }

/* A question blocks forward movement until it is answered. */
function blocked() {
  const c = currentCard();
  return c.type === "question" && P.answered[P.i] === undefined;
}

function renderCard() {
  const set = P.set, card = currentCard(), n = set.cards.length;
  const isQ = card.type === "question";
  const pct = Math.round((P.i + 1) / n * 100);
  const savedNow = S.saved.indexOf(cardId(set.id, P.i)) > -1;

  $("#s-player").innerHTML = `
    <div class="pbar">
      <button class="pclose" id="pclose" aria-label="${t(UI.close)}">${ICON.close}</button>
      <span class="track" role="progressbar" aria-valuenow="${P.i + 1}" aria-valuemin="1" aria-valuemax="${n}"
            aria-label="${fmt(t(UI.progressLabel), { n: P.i + 1, total: n })}"><i style="width:${pct}%"></i></span>
    </div>

    <div class="stage">
      <div class="tapregion">
        <div class="visual"><div class="panel">${renderDiagram(set.archetype, card.layer, S.lang)}</div></div>
        <div class="cardtext ${isQ ? "q" : ""}">${t(card.text)}</div>
        <div class="zones">
          <button class="zone back" id="zback" aria-label="${t(UI.tapBack)}"></button>
          <button class="zone next" id="znext" aria-label="${t(UI.tapNext)}"></button>
        </div>
      </div>
      <div class="whyrow"><button class="whylink" id="whylink">${t(UI.whyLink)}</button></div>
      <!-- Collects leftover height on tall screens so the card composition stays
           top-anchored instead of floating in the middle of the frame. -->
      <div class="spacer"></div>
    </div>

    <div class="qzone">${isQ ? questionHTML(card) : ""}</div>

    <div class="actions">
      <button class="act" id="flagbtn" aria-label="${t(UI.flag)}">${ICON.flag}</button>
      <button class="act" id="savebtn" aria-label="${t(UI.save)}" aria-pressed="${savedNow}">
        ${savedNow ? ICON.heartOn : ICON.heart}
      </button>
    </div>`;

  /* Animate only a layer the reader has not seen yet. */
  if (card.layer > P.lastLayer) {
    const g = $(`#s-player .layer.l${card.layer}`);
    if (g) g.classList.add("enter");
  }
  P.lastLayer = Math.max(P.lastLayer, card.layer);

  /* Replay a previously given answer so going back is lossless. */
  if (isQ && P.answered[P.i] !== undefined) paintAnswer(card, P.answered[P.i]);

  wireCard();
}

function questionHTML(card) {
  return `
    <div class="opts" id="opts">
      ${card.options.map((o, k) => `<button class="opt" data-opt="${k}">${t(o)}</button>`).join("")}
    </div>
    <div class="result" id="result" aria-live="polite"></div>`;
}

/* Renders the answered state. Called on answer and on returning to the card.
   The .result block is already reserved in the layout, so nothing moves. */
function paintAnswer(card, pick) {
  const opts = document.querySelectorAll("#opts .opt");
  opts.forEach((b, k) => {
    b.disabled = true;
    if (card.mode === "correct") {
      if (k === card.answer) b.classList.add("right");
      else if (k === pick)    b.classList.add("quiet", "chosen");
      else                    b.classList.add("quiet");
    } else {
      if (k === pick) b.classList.add("chosen");
      else            b.classList.add("quiet");
    }
  });

  let head = "";
  if (card.mode === "correct") {
    const ok = pick === card.answer;
    head = `<span class="verdict ${ok ? "ok" : "no"}">${ok ? t(UI.correct) : t(UI.notQuite)}</span>`;
  } else {
    /* Judgement: illustrative split, user's side highlighted, always captioned
       so an invented number is never presented as real data. */
    const a = card.split[0], b = card.split[1];
    head = `
      <div class="split">
        <div class="${pick === 0 ? "mine" : ""}" style="width:${a}%">${a}%</div>
        <div class="${pick === 1 ? "mine" : ""}" style="width:${b}%">${b}%</div>
      </div>
      <p class="splitcap">${t(UI.splitCaption)}</p>`;
  }

  $("#result").innerHTML = head + `<p class="fb">${t(card.feedback)}</p>`;
}

function answer(pick) {
  const card = currentCard();
  if (P.answered[P.i] !== undefined) return;
  P.answered[P.i] = pick;
  paintAnswer(card, pick);
}

function wireCard() {
  $("#pclose").addEventListener("click", exitPlayer);
  $("#zback").addEventListener("click", () => step(-1));
  $("#znext").addEventListener("click", () => step(1));
  $("#whylink").addEventListener("click", () => openWhy(P.set));

  const opts = document.querySelectorAll("#opts .opt");
  opts.forEach(b => b.addEventListener("click", () => answer(Number(b.dataset.opt))));

  $("#flagbtn").addEventListener("click", () => {
    const id = cardId(P.set.id, P.i);
    if (S.flags.indexOf(id) === -1) S.flags.push(id);
    saveState();
    toast(t(UI.flagToast));
  });

  $("#savebtn").addEventListener("click", () => {
    const id = cardId(P.set.id, P.i);
    const at = S.saved.indexOf(id);
    if (at > -1) { S.saved.splice(at, 1); toast(t(UI.unsaveToast)); }
    else         { S.saved.push(id);      toast(t(UI.saveToast)); }
    saveState();
    const btn = $("#savebtn"), on = S.saved.indexOf(id) > -1;
    btn.setAttribute("aria-pressed", String(on));
    btn.innerHTML = on ? ICON.heartOn : ICON.heart;
  });
}

function step(dir) {
  if (!P || overlayOpen()) return;
  if (dir > 0) {
    if (blocked()) return;                       // question must be answered
    if (P.i === P.set.cards.length - 1) { finishSet(); return; }
    P.i++;
  } else {
    if (P.i === 0) return;
    P.i--;
  }
  renderCard();
}

function exitPlayer() {
  P = null;
  renderHome();
}

/* ---- 3.4 completion ----------------------------------------------------- */

function finishSet() {
  const set = P.set;
  if (!isDone(set.id)) S.completed.push(set.id);
  saveState();
  chime();                                       // fired from a user tap, never autoplay

  $("#s-done").innerHTML = `
    <svg class="check" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44"/>
      <path d="M31 52l13 13 25-28"/>
    </svg>
    <h2>${t(UI.completeTitle)}</h2>
    <p class="settitle">${t(set.title)}</p>
    <p class="line">${t(UI.completeLine)}</p>
    <button class="btn" id="backbtn">${t(UI.backToConcepts)}</button>
    <button class="mute" id="mutebtn">${S.muted ? t(UI.soundOff) : t(UI.soundOn)}</button>`;

  show("s-done");
  $("#backbtn").addEventListener("click", () => { P = null; renderHome(); });
  $("#mutebtn").addEventListener("click", () => {
    S.muted = !S.muted; saveState();
    $("#mutebtn").textContent = S.muted ? t(UI.soundOff) : t(UI.soundOn);
  });
}

/* Two-tone chime, Web Audio, no file. Created on demand so it can only ever
   run inside a user gesture. */
let audioCtx = null;
function chime() {
  if (S.muted) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    const now = audioCtx.currentTime;
    [[660, 0], [880, 0.13]].forEach(([hz, at]) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0, now + at);
      gain.gain.linearRampToValueAtTime(0.11, now + at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.22);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + at);
      osc.stop(now + at + 0.24);
    });
  } catch (e) { /* audio unavailable — silent, never fatal */ }
}

/* =============================================================================
   4. OVERLAYS
   ========================================================================== */

function overlayOpen() {
  return $("#sheet").classList.contains("on")
      || $("#about").classList.contains("on")
      || $("#hint").classList.contains("on");
}

function openWhy(set) {
  $("#sheet").innerHTML = `
    <div class="sheet-in">
      <h2>${t(UI.whyHeading)}</h2>
      <p>${t(set.why)}</p>
      <span class="meta">${t(UI.sourceHeading)}</span>
      <p class="cite">${t(CITATION.text)}<br><a href="${CITATION.doi}" target="_blank" rel="noopener">${CITATION.doiLabel}</a></p>
      <button class="btn" id="sheetclose">${t(UI.closeSheet)}</button>
    </div>`;
  $("#sheet").classList.add("on");
  $("#sheetclose").addEventListener("click", closeSheet);
  $("#sheetclose").focus();
}
function closeSheet() { $("#sheet").classList.remove("on"); $("#sheet").innerHTML = ""; }

function openAbout() {
  $("#about").innerHTML = `
    <div class="inner">
      <h2>${t(UI.aboutHeading)}</h2>
      <p>${t(UI.aboutBody1)}</p>
      <p>${t(UI.aboutBody2)}</p>
      <span class="meta">${t(UI.sourceHeading)}</span>
      <p class="cite">${t(CITATION.text)}<br><a href="${CITATION.doi}" target="_blank" rel="noopener">${CITATION.doiLabel}</a></p>
      <p class="authors">${t(UI.aboutAuthors)}</p>
      <p>${t(UI.aboutContact)}</p>
      <button class="btn" id="aboutclose">${t(UI.closeSheet)}</button>
    </div>`;
  $("#about").classList.add("on");
  $("#aboutclose").addEventListener("click", closeAbout);
  $("#aboutclose").focus();
}
function closeAbout() { $("#about").classList.remove("on"); $("#about").innerHTML = ""; }

function showHint() {
  $("#hint").innerHTML = `
    <div class="hint-in">
      <div class="hint-arrows">${ICON.arrowL}${ICON.arrowR}</div>
      <h2>${t(UI.hintTitle)}</h2>
      <p>${t(UI.hintBody)}</p>
      <button class="btn" id="hintok">${t(UI.hintDismiss)}</button>
    </div>`;
  $("#hint").classList.add("on");
  $("#hintok").addEventListener("click", dismissHint);
  $("#hintok").focus();
}
function dismissHint() {
  S.seenHint = true; saveState();
  $("#hint").classList.remove("on");
  $("#hint").innerHTML = "";
}

let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 1800);
}

/* =============================================================================
   5. INPUT
   ========================================================================== */

/* One delegated listener for everything outside the player. */
document.addEventListener("click", e => {
  const lang = e.target.closest("[data-lang]");
  if (lang) { S.lang = lang.dataset.lang; saveState(); renderHome(); return; }

  const tile = e.target.closest("[data-set]");
  if (tile) { openSet(tile.dataset.set); return; }

  if (e.target.closest("#langswitch")) {
    S.lang = S.lang === "en" ? "fi" : "en";
    saveState();
    renderHome();
    return;
  }
  if (e.target.closest("#aboutlink")) { openAbout(); return; }

  /* Click the scrim to close a bottom sheet. */
  if (e.target === $("#sheet")) closeSheet();
});

/* Keyboard: full run without a mouse. */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if ($("#hint").classList.contains("on"))  { dismissHint(); return; }
    if ($("#sheet").classList.contains("on")) { closeSheet();  return; }
    if ($("#about").classList.contains("on")) { closeAbout();  return; }
    if (P) exitPlayer();
    return;
  }
  if (!P || overlayOpen()) return;
  if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); step(-1); }
});

/* =============================================================================
   6. BOOT
   ========================================================================== */

/* Content validation stands in for the spec's build-time check. If any card
   breaks a rule the site says so in red across the top and names the offender.
   It cannot ship silently. */
(function guardContent() {
  const errors = validateContent();
  if (!errors.length) return;
  const bar = document.createElement("div");
  bar.className = "badcontent";
  bar.textContent = "CONTENT ERROR — " + errors.join(" | ");
  document.body.appendChild(bar);
  console.error("Oppija content validation failed:\n" + errors.join("\n"));
})();

if (S.lang) renderHome(); else renderLang();
