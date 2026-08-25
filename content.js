/* =============================================================================
   Oppija — content
   -----------------------------------------------------------------------------
   EVERY user-visible string in the product lives in this file. There are no
   hardcoded strings in index.html, app.css, svg.js or app.js.

   TO EDIT A CARD      change the `text` value. Keep it under 140 characters in
                       BOTH languages. The validator at the bottom of this file
                       fails loudly in the browser if you go over.
   TO REORDER SETS     move the objects inside SETS. Nothing else needs changing.
   TO CHANGE A SPLIT   edit the `split` array on a judgement question. The two
                       numbers should add up to 100.

   Finnish: every fi string is marked FI-REVIEW. None of it has been checked by
   a native speaker yet. Do not share this site with a Finnish audience until a
   native speaker has been through every FI-REVIEW line.
   ========================================================================== */

"use strict";

/* -----------------------------------------------------------------------------
   1. Interface strings
   -------------------------------------------------------------------------- */

const UI = {
  // ---- language screen ----
  langTitle:      { en: "Oppija",
                    fi: "Oppija" },                                    // FI-REVIEW
  langPrompt:     { en: "Choose your language",
                    fi: "Valitse kieli" },                             // FI-REVIEW
  langEn:         { en: "English", fi: "English" },
  langFi:         { en: "Suomi",   fi: "Suomi" },

  // ---- home ----
  promise:        { en: "Three minutes a day keeps your AI literacy current.",
                    fi: "Kolme minuuttia päivässä pitää tekoälyosaamisesi ajan tasalla." }, // FI-REVIEW
  progressSummary:{ en: "{done} of {total} completed",
                    fi: "{done} / {total} suoritettu" },               // FI-REVIEW
  cardMeta:       { en: "5 cards · 3 min",
                    fi: "5 korttia · 3 min" },                         // FI-REVIEW
  soon:           { en: "In review",
                    fi: "Tarkistuksessa" },                            // FI-REVIEW
  savedHeading:   { en: "Your saved moves",
                    fi: "Tallentamasi keinot" },                       // FI-REVIEW
  savedEmpty:     { en: "Cards you save will collect here.",
                    fi: "Tallentamasi kortit kerääntyvät tähän." },    // FI-REVIEW
  footerResearch: { en: "Built on peer reviewed research at the University of Jyväskylä",
                    fi: "Perustuu vertaisarvioituun tutkimukseen Jyväskylän yliopistossa" }, // FI-REVIEW
  footerPrivacy:  { en: "No account. No tracking. Everything stays on your device.",
                    fi: "Ei tiliä. Ei seurantaa. Kaikki pysyy laitteellasi." }, // FI-REVIEW
  switchLang:     { en: "Suomeksi", fi: "In English" },

  // ---- player ----
  close:          { en: "Close and return to concepts",
                    fi: "Sulje ja palaa aiheisiin" },                  // FI-REVIEW
  tapBack:        { en: "Previous card",
                    fi: "Edellinen kortti" },                          // FI-REVIEW
  tapNext:        { en: "Next card",
                    fi: "Seuraava kortti" },                           // FI-REVIEW
  progressLabel:  { en: "Card {n} of {total}",
                    fi: "Kortti {n} / {total}" },                      // FI-REVIEW
  whyLink:        { en: "why this card",
                    fi: "miksi tämä kortti" },                         // FI-REVIEW
  whyHeading:     { en: "Why this card",
                    fi: "Miksi tämä kortti" },                         // FI-REVIEW
  sourceHeading:  { en: "Source",
                    fi: "Lähde" },                                     // FI-REVIEW
  closeSheet:     { en: "Close", fi: "Sulje" },                        // FI-REVIEW
  flag:           { en: "Something is wrong with this card",
                    fi: "Tässä kortissa on jotain vialla" },           // FI-REVIEW
  flagToast:      { en: "Thanks, noted",
                    fi: "Kiitos, merkitty" },                          // FI-REVIEW
  save:           { en: "Save this card",
                    fi: "Tallenna tämä kortti" },                      // FI-REVIEW
  saveToast:      { en: "Saved",
                    fi: "Tallennettu" },                               // FI-REVIEW
  unsaveToast:    { en: "Removed",
                    fi: "Poistettu" },                                 // FI-REVIEW

  // ---- first-run teaching overlay ----
  hintTitle:      { en: "Two taps to move",
                    fi: "Liiku kahdella napautuksella" },              // FI-REVIEW
  hintBody:       { en: "Tap the right side to continue. Tap the left side to go back.",
                    fi: "Napauta oikeaa reunaa jatkaaksesi. Napauta vasenta palataksesi." }, // FI-REVIEW
  hintDismiss:    { en: "Got it", fi: "Selvä" },                       // FI-REVIEW

  // ---- questions ----
  correct:        { en: "Correct", fi: "Oikein" },                     // FI-REVIEW
  notQuite:       { en: "Not quite", fi: "Ei aivan" },                 // FI-REVIEW
  yourChoice:     { en: "Your choice", fi: "Sinun valintasi" },        // FI-REVIEW
  splitCaption:   { en: "Illustrative split — pilot data will replace this",
                    fi: "Havainnollistava jakauma — pilottidata korvaa tämän" }, // FI-REVIEW

  // ---- completion ----
  completeTitle:  { en: "Concept complete",
                    fi: "Aihe suoritettu" },                           // FI-REVIEW
  completeLine:   { en: "Try it this week.",
                    fi: "Kokeile tätä tällä viikolla." },              // FI-REVIEW
  backToConcepts: { en: "Back to concepts",
                    fi: "Takaisin aiheisiin" },                        // FI-REVIEW
  soundOn:        { en: "Sound on",  fi: "Ääni päällä" },              // FI-REVIEW
  soundOff:       { en: "Sound off", fi: "Ääni pois" },                // FI-REVIEW

  // ---- about ----
  aboutLink:      { en: "About Oppija", fi: "Tietoa Oppijasta" },      // FI-REVIEW
  aboutHeading:   { en: "About Oppija", fi: "Tietoa Oppijasta" },      // FI-REVIEW
  aboutBody1:     { en: "Oppija is a microlearning tool that helps school teachers keep their AI literacy current, three minutes at a time.",
                    fi: "Oppija on mikro-oppimisen työkalu, joka auttaa opettajia pitämään tekoälyosaamisensa ajan tasalla kolme minuuttia kerrallaan." }, // FI-REVIEW
  aboutBody2:     { en: "Every concept is drawn from peer reviewed research on generative AI in teacher professional development. Oppija never sends your work to an AI model, and never asks who you are.",
                    fi: "Jokainen aihe perustuu vertaisarvioituun tutkimukseen generatiivisesta tekoälystä opettajien täydennyskoulutuksessa. Oppija ei lähetä työtäsi tekoälymallille eikä kysy kuka olet." }, // FI-REVIEW
  aboutAuthors:   { en: "Prashanth Shenoy · Mirka Saarela",
                    fi: "Prashanth Shenoy · Mirka Saarela" },
  aboutContact:   { en: "hello@oppija.com", fi: "hello@oppija.com" }
};

/* Full citation. Rendered on the About screen and inside every "why" sheet. */
const CITATION = {
  text: {
    en: "Shenoy, P., & Saarela, M. (2026). Generative AI in teacher professional development. Discover Education.",
    fi: "Shenoy, P., & Saarela, M. (2026). Generative AI in teacher professional development. Discover Education." // FI-REVIEW
  },
  doi: "https://doi.org/10.1007/s44217-026-01579-7",
  doiLabel: "10.1007/s44217-026-01579-7"
};

/* -----------------------------------------------------------------------------
   2. SVG label strings
   Kept beside the content, not inside svg.js, so a non-developer can retranslate
   a diagram without opening drawing code.
   -------------------------------------------------------------------------- */

const SVG_TEXT = {
  task:       { en: "TASK",        fi: "TEHTÄVÄ" },                    // FI-REVIEW
  answer:     { en: "ANSWER",      fi: "VASTAUS" },                    // FI-REVIEW
  noThinking: { en: "0 MIN THINKING", fi: "0 MIN AJATTELUA" },         // FI-REVIEW
  checkpoint: { en: "CHECKPOINT",  fi: "TARKISTUSPISTE" }              // FI-REVIEW
};

/* -----------------------------------------------------------------------------
   3. The sets
   Set 1 is authored. Sets 2–10 carry their titles only and are marked
   `draft: true`, which renders them on Home as locked tiles. Remove the flag and
   add a `cards` array to bring one live.
   -------------------------------------------------------------------------- */

const SETS = [
  {
    id: "shortcut",
    archetype: "flow",
    title: { en: "The whole-task shortcut",
             fi: "Koko tehtävän oikotie" },                            // FI-REVIEW
    why: {
      en: "Teachers in the study reported that policing AI use failed, while assessment that makes thinking visible held up. This set turns that finding into one classroom move.",
      fi: "Tutkimuksessa opettajat kertoivat, että tekoälyn valvonta epäonnistui, mutta ajattelun näkyväksi tekevä arviointi kesti. Tämä aihe muuttaa löydöksen yhdeksi keinoksi." // FI-REVIEW
    },
    cards: [
      { type: "learn", layer: 1,
        text: { en: "Most students don't ask AI for help. They hand it the whole task.",
                fi: "Useimmat oppilaat eivät pyydä tekoälyltä apua. He antavat sille koko tehtävän." } }, // FI-REVIEW

      { type: "learn", layer: 2,
        text: { en: "That shortcut isn't laziness. It's the cheapest path, and it's rational.",
                fi: "Oikotie ei ole laiskuutta. Se on halvin reitti, ja se on järkevä valinta." } }, // FI-REVIEW

      { type: "learn", layer: 3,
        text: { en: "Punishing the shortcut starts an arms race you can't win.",
                fi: "Oikotien rankaiseminen aloittaa kilpavarustelun, jota et voi voittaa." } }, // FI-REVIEW

      { type: "learn", layer: 4,
        text: { en: "Put one <b>checkpoint</b> before the task, and the shortcut stops paying.",
                fi: "Lisää yksi <b>tarkistuspiste</b> ennen tehtävää, niin oikotie lakkaa kannattamasta." } }, // FI-REVIEW

      { type: "question", mode: "judgement", layer: 4,
        text: { en: "Which checkpoint survives contact with a real class?",
                fi: "Mikä tarkistuspiste kestää oikeassa luokassa?" },  // FI-REVIEW
        options: [
          { en: "A plan drafted in class", fi: "Tunnilla laadittu suunnitelma" },   // FI-REVIEW
          { en: "A longer rubric",         fi: "Pidempi arviointikriteeristö" }     // FI-REVIEW
        ],
        split: [70, 30],
        feedback: {
          en: "Plans made in class leave a visible trail of the student's own thinking.",
          fi: "Tunnilla tehty suunnitelma jättää näkyvän jäljen oppilaan omasta ajattelusta." } // FI-REVIEW
      }
    ]
  },

  /* ---- outlined, not yet authored. See section 8 of the build spec. ---- */
  { id: "wrong",      archetype: "bigNumber",  draft: true,
    title: { en: "Confidently wrong",            fi: "Itsevarmasti väärässä" } },          // FI-REVIEW
  { id: "assessment", archetype: "beforeAfter", draft: true,
    title: { en: "Assessment that survives AI",  fi: "Arviointi joka kestää tekoälyn" } }, // FI-REVIEW
  { id: "explainer",  archetype: "steps",       draft: true,
    title: { en: "The 12-step explainer",        fi: "12 askeleen selitys" } },            // FI-REVIEW
  { id: "bias",       archetype: "scene",       draft: true,
    title: { en: "Bias hides in the examples",   fi: "Vinouma piiloutuu esimerkkeihin" } },// FI-REVIEW
  { id: "rehearsal",  archetype: "chat",        draft: true,
    title: { en: "The rehearsal partner",        fi: "Harjoittelukumppani" } },            // FI-REVIEW
  { id: "privacy",    archetype: "flow",        draft: true,
    title: { en: "What never goes in the prompt", fi: "Mitä kehotteeseen ei koskaan laiteta" } }, // FI-REVIEW
  { id: "rules",      archetype: "bars",        draft: true,
    title: { en: "Rules with an AI-first class", fi: "Säännöt tekoälyä käyttävän luokan kanssa" } }, // FI-REVIEW
  { id: "feedback",   archetype: "beforeAfter", draft: true,
    title: { en: "Feedback on drafts",           fi: "Palaute luonnoksista" } },           // FI-REVIEW
  { id: "notuse",     archetype: "rings",       draft: true,
    title: { en: "When not to use it",           fi: "Milloin tekoälyä ei käytetä" } }     // FI-REVIEW
];

/* -----------------------------------------------------------------------------
   4. Validator
   Stands in for the spec's build-time check. Runs on every page load; if any
   authored string breaks a rule it paints a red banner across the top of the
   site and logs the offenders. It cannot be missed, and it cannot reach
   production silently.
   -------------------------------------------------------------------------- */

const MAX_CHARS = 140;
const LANGS = ["en", "fi"];

function validateContent() {
  const errors = [];
  const plain = s => String(s).replace(/<[^>]+>/g, "");   // tags don't count

  SETS.forEach((set, si) => {
    if (set.draft) return;
    if (!set.cards || set.cards.length !== 5)
      errors.push(`Set "${set.id}" must have exactly 5 cards, found ${set.cards ? set.cards.length : 0}`);

    LANGS.forEach(lang => {
      const words = plain(set.why[lang]).trim().split(/\s+/).length;
      if (words > 40) errors.push(`Set "${set.id}" why note is ${words} words in ${lang} (max 40)`);
    });

    (set.cards || []).forEach((card, ci) => {
      LANGS.forEach(lang => {
        const n = plain(card.text[lang]).length;
        if (n > MAX_CHARS)
          errors.push(`Set ${si + 1} "${set.id}" card ${ci + 1}: ${n} chars in ${lang} (max ${MAX_CHARS})`);
      });
      if (card.type === "question") {
        if (!card.options || card.options.length !== 2)
          errors.push(`Set "${set.id}" question needs exactly 2 options`);
        if (card.mode === "correct" && typeof card.answer !== "number")
          errors.push(`Set "${set.id}" correct-mode question has no answer index`);
        if (card.mode === "judgement") {
          if (!card.split || card.split.length !== 2)
            errors.push(`Set "${set.id}" judgement question needs a two-value split`);
          else if (card.split[0] + card.split[1] !== 100)
            errors.push(`Set "${set.id}" split must total 100, got ${card.split[0] + card.split[1]}`);
        }
      }
    });
  });

  return errors;
}
