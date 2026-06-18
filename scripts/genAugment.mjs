// Regenerates paper.json `augment` from a per-paragraph annotation spec.
// Every annotated term gets a short inline `gloss` (always shown) + a richer
// card `content` (+ optional example/viz). Anchors must be verbatim substrings
// of the source paragraph; the script verifies and warns on any miss.
import fs from "node:fs";

const path = new URL("../data/paper.json", import.meta.url);
const p = JSON.parse(fs.readFileSync(path, "utf8"));

// anchor, domain, category, gloss (inline italic), content (card), [example], [viz]
const byPara = {
  p_abs: [
    { a: "benchmark datasets", d: "ml", c: "vocab", g: "tidy test data, not the real world", x: "Curated example sets a model is scored on — easy to ace, unlike messy hospital reality." },
    { a: "real-world deployment", d: "hci", c: "argument-role", g: "actually used on real patients", x: "The gap between 'works in the paper' and 'works on the ward' is the whole motivation here." },
    { a: "abandon", d: "hci", c: "argument-role", g: "quietly stop using it", x: "Clinicians didn't fight the tool — they just routed around it. That's the symptom being diagnosed." },
    { a: "intermediate stages", d: "argument-role", c: "concept-density", g: "the messy middle, not the final call", x: "Forming a hunch and gathering data — the steps before the diagnosis, where help is wanted." },
    { a: "prediction uncertainty", d: "stats", c: "vocab", g: "how unsure the model is", x: "Not just 'risk = 30%', but 'give or take how much' — a second number that builds trust." },
    { a: "heuristic evaluation", d: "hci", c: "vocab", g: "experts try it and react", x: "A lightweight usability check: let real clinicians use the prototype and gather feedback, vs. a formal trial." },
  ],
  p_sepsis_common: [
    { a: "Sepsis", d: "clinical", c: "vocab", g: "the body's defence gone haywire", x: "Not the infection itself — the immune response spiralling out of control and harming the body's own organs." },
    { a: "48.9 million patients per year", d: "stats", c: "numbers", g: "≈ 1 in 160 people, yearly",
      viz: { type: "fraction", filled: 11, total: 49, label: "≈ 11M deaths of 48.9M cases" },
      x: "One of the world's leading causes of death — which is why early detection is such a big deal." },
    { a: "organ dysfunction", d: "clinical", c: "vocab", g: "organs starting to fail" },
    { a: "dysregulated response to infection", d: "clinical", c: "concept-density", g: "immune system overreacting", x: "The damage comes from the over-the-top defence, not just the germs." },
    { a: "die within a few hours", d: "clinical", c: "argument-role", g: "the clock is brutal", x: "This speed is what makes a late warning useless — the core problem of the old tool." },
  ],
  p_challenging: [
    { a: "abnormal cell detection in medical imaging", d: "clinical", c: "background", g: "the 'easy' AI comparison", x: "In a scan, all the evidence is in the picture. Sepsis isn't like that — hence it's harder." },
    { a: "develop sepsis in the near future", d: "clinical", c: "concept-density", g: "not just now — what's coming", x: "Two questions at once: do they have it now, and will they get it soon? Forecasting, not just labelling." },
    { a: "blood culture", d: "clinical", c: "vocab", g: "the slow, definitive test", x: "Grow the patient's blood and watch for bacteria — reliable, but it needs hours." },
    { a: "Sepsis-3 guidelines", d: "clinical", c: "vocab", g: "the official rulebook for sepsis", x: "The current consensus definition clinicians are trained to follow." },
    { a: "8 hours", d: "stats", c: "numbers", g: "too slow to wait for", x: "By the time the gold-standard answer arrives, an untreated patient may already be in organ failure." },
  ],
  p_fourstep: [
    { a: "four stages of the medical decision-making workflow", d: "clinical", c: "concept-density", g: "how a diagnosis really unfolds", x: "Hunch → gather data → test hunch → decide. The paper's key map." },
    { a: "Generating hypotheses", d: "clinical", c: "vocab", g: "forming an initial hunch" },
    { a: "Testing hypotheses", d: "clinical", c: "vocab", g: "checking the hunch against new labs" },
    { a: "final diagnosis stage", d: "argument-role", c: "argument-role", g: "where the old AI aimed — the wrong spot", x: "The incumbent only helped at step 4; the redesign moves help to steps 1–3." },
  ],
  p_esm: [
    { a: "Epic Sepsis Module (ESM)", d: "clinical", c: "argument-role", g: "the widely-used incumbent tool", x: "Built into the Epic records system; the most common sepsis alert in US hospitals. Its failures drive the paper." },
    { a: "Electrical Health Record (EHR)", d: "clinical", c: "vocab", g: "the digital patient chart", x: "Every vital sign, lab and note in one system. (The paper writes 'Electrical'; the field's term is 'Electronic'.)" },
    { a: "machine learning algorithm", d: "ml", c: "vocab", g: "learns patterns, not rules", x: "Software that learned which records tend to precede sepsis, rather than following hand-written criteria." },
    { a: "biomarker data", d: "clinical", c: "vocab", g: "measurable body signals", x: "Lab values like lactate or white-cell count that hint at what's happening inside." },
    { a: "sepsis risk score", e: "E.g. score = 13 on a 0–100 scale → an alert fires, but you still dont know why.", d: "stats", c: "concept-density", g: "one number for the whole patient", x: "The model boils everything down to a single score — convenient, but it hides the reasoning." },
    { a: "higher than a threshold", e: "E.g. threshold = 13 → a patient at 14 trips the alarm, one at 12 doesnt.", d: "stats", c: "concept-density", g: "cross the line → alarm", x: "Where you set that line trades off catching every case against crying wolf — the tension in the next section." },
    { a: "agree, disagree, or dismiss", d: "hci", c: "argument-role", g: "the human's only role: react", x: "The AI decides; the clinician just rubber-stamps or rejects. That framing is what feels like a competitor." },
  ],
  p_belated: [
    { a: "too late and thus useless", d: "argument-role", c: "argument-role", g: "the #1 complaint", x: "If the alert fires after you've already acted, it adds nothing." },
    { a: "time-sensitive decision", d: "clinical", c: "concept-density", g: "must decide fast, now", x: "The window is hours, so you can't wait for the data the AI needs." },
    { a: "first encounter", d: "clinical", c: "background", g: "the moment of arrival", x: "Exactly when the chart is emptiest — and when the model has least to work with." },
    { a: "huge uncertainty", d: "stats", c: "concept-density", g: "deciding with little evidence" },
    { a: "not digitalized yet", d: "clinical", c: "background", g: "data exists but isn't typed in", x: "Early on, vitals and labs may be on paper or not taken — so the AI is flying blind." },
  ],
  p_inaccurate: [
    { a: "low sensitivity threshold at 13%", d: "stats", c: "concept-density", g: "set to never miss a case", x: "Lower the bar to catch every real sepsis — but that floods you with false alarms (next note)." },
    { a: "high false positive rate at 87%", d: "stats", c: "numbers", g: "≈ 9 of 10 alarms are false",
      viz: { type: "dots", filled: 9, total: 10, label: "≈ 9 of 10 alarms are false" },
      x: "Of 100 alerts it raises, ~87 are false → staff learn to ignore it (alert fatigue)." },
    { a: "alert fatigue", d: "clinical", c: "vocab", g: "so many warnings you tune out", x: "A real patient-safety hazard: cry wolf often enough and people stop reacting at all." },
    { a: "20 interruptions per hour", d: "stats", c: "numbers", g: "one every ~3 minutes", x: "On top of actually treating patients — no wonder the alerts get ignored." },
  ],
  p_explanation: [
    { a: "hard to interpret", d: "ml", c: "vocab", g: "the 'black box' problem", x: "It gives an answer but no 'why' — so an expert can't tell when to trust or override it." },
    { a: "lower risk score than the score of a less obvious case", d: "stats", c: "argument-role", g: "the scores don't make sense", x: "When an obvious case scores lower than a subtle one, the number loses all credibility." },
    { a: "relativeness of the score", d: "stats", c: "concept-density", g: "is 40 a lot? compared to what?", x: "Without a reference point, a bare score is impossible to act on." },
  ],
  p_actionable: [
    { a: "limited utility", d: "argument-role", c: "argument-role", g: "doesn't actually help", x: "Even when the score is right, it doesn't tell you what to do." },
    { a: "simply ignored the risk score", d: "hci", c: "argument-role", g: "so they tuned it out" },
    { a: "actionable next step", d: "hci", c: "concept-density", g: "a concrete 'do this next'", x: "What clinicians wanted instead of a number: a suggestion they can act on — like which lab to order." },
  ],
  p_challenger: [
    { a: "final decision outcomes", d: "argument-role", c: "concept-density", g: "the AI grabs the verdict", x: "It predicts the answer itself, instead of helping the human reach one." },
    { a: "challenges", d: "hci", c: "argument-role", g: "steps on the doctor's turf" },
    { a: "human-AI competition", d: "hci", c: "concept-density", g: "rival, not teammate", x: "The core diagnosis: aiming the AI at the verdict turns it into a competitor that intimidates experts." },
    { a: "intimidates their authorities", d: "hci", c: "argument-role", g: "undermines their expertise" },
  ],
  p_ds: [
    { a: "five design strategies", d: "argument-role", c: "concept-density", g: "the redesign in 5 rules", x: "Each rule answers one of the five complaints from the formative study." },
    { a: "Future Risk Score Prediction", d: "ml", c: "vocab", g: "forecast, don't just label now" },
    { a: "Accessible Model Explanation", d: "ml", c: "vocab", g: "explain itself, plainly" },
    { a: "Actionable Insights and Suggestions", d: "hci", c: "concept-density", g: "tell them what to do next" },
    { a: "Displaying Uncertainty beyond the Risk Score", d: "stats", c: "vocab", g: "show the doubt, not just the number" },
    { a: "Supporting Intermediate Stages", d: "argument-role", c: "argument-role", g: "help the middle, not the verdict", x: "The big one: this single shift is what the whole paper argues for." },
  ],
  p_future: [
    { a: "predictive algorithm", d: "ml", c: "vocab", g: "the forecasting engine" },
    { a: "future prediction of sepsis risk scores", d: "clinical", c: "concept-density", g: "where the risk is heading", x: "The old tool answered 'is it sepsis now?'. This answers 'where is this going in the next few hours?'" },
    { a: "time-series plot", d: "stats", c: "vocab", g: "a value drawn over time", x: "A line chart of risk across hours — easy to read at a glance." },
    { a: "the solid line", d: "ml", c: "background", g: "what has happened so far" },
    { a: "the dashed line", e: "E.g. solid stops at now (risk 13); dashed climbs to ~30 over the next 10 hours → act early.", d: "ml", c: "background", g: "the model's forecast ahead", x: "Solid = history, dashed = prediction. The dashed part is the whole point: it buys time to act early." },
  ],
  p_uncertainty: [
    { a: "uncertainty range", d: "stats", c: "concept-density", g: "the 'give or take'", x: "Not 'risk is 30%' but 'around 30%, give or take' — honesty about how sure the model is." },
    { a: "gray area", d: "stats", c: "background", g: "the shaded band of doubt", x: "The wider the band, the less sure the model — shown around the forecast line." },
    { a: "confidence intervals", d: "stats", c: "vocab", g: "a standard 'give or take' band", x: "A common way to draw uncertainty; chosen here because studies show people trust it." },
    { a: "evoke high levels of trust", d: "hci", c: "argument-role", g: "a design choice for trust, not math", x: "They picked this picture because it makes doctors trust the tool — adoption matters as much as accuracy." },
  ],
  p_labrec: [
    { a: "feature important visualization", d: "ml", c: "vocab", g: "which inputs mattered most", x: "A ranking of which lab values are driving the prediction — doubles as the model's explanation." },
    { a: "lab tests recommendation function", d: "clinical", c: "concept-density", g: "tells you which test to run next", x: "The feature clinicians loved: a concrete next action that fits their 'gather data' step." },
    { a: "ranked by their importance", d: "stats", c: "concept-density", g: "most useful test on top", x: "Ordered by how much each test would shrink the model's uncertainty." },
    { a: "the red dashed line", d: "ml", c: "background", g: "the 'what if' forecast" },
    { a: "counterfactual values", e: "E.g. you havent run a lactate test → it previews: ‘this would likely push risk from 13 to 25’.", d: "ml", c: "vocab", g: "a 'what if I ran this test?' preview", x: "Estimated results for a test you haven't done yet, so you can weigh whether it's worth it." },
  ],
  p_lstm: [
    { a: "Recurrent Neural Network (RNN)", d: "ml", c: "vocab", g: "a network that reads sequences", x: "Built to process things in order, feeding each step's memory into the next — good for a timeline." },
    { a: "irregular time intervals", d: "clinical", c: "background", g: "labs taken at random times", x: "Real records are messy — readings come at odd hours, some not at all. The model must cope with gaps." },
    { a: "Long Short-Term Memory (LSTM)", d: "ml", c: "vocab", g: "an RNN that remembers longer", x: "A neural net that holds onto what mattered earlier — so last night's reading still informs today's." },
    { a: "variable attention module", d: "ml", c: "concept-density", g: "weighs which inputs matter", x: "Handles a varying number of inputs and learns what to focus on — also produces the explanation." },
    { a: "attention weights", d: "ml", c: "vocab", g: "how much each input counted", x: "The 'focus' numbers double as a plain-language reason for the prediction." },
  ],
  p_mcs: [
    { a: "Monte Carlo Simulation (MCS)", d: "ml", c: "vocab", g: "guess the gaps many times over", x: "A missing value? Try 500 plausible versions, predict each, and see how much the answer swings." },
    { a: "missing values", d: "clinical", c: "background", g: "labs not taken yet" },
    { a: "standard deviation of the outputs", d: "stats", c: "concept-density", g: "how much the answers spread", x: "If the predictions jump around a lot across guesses, the model is uncertain." },
    { a: "Shannon entropy", e: "E.g. 50/50 coin-flip → entropy ≈ 1 (max doubt); 99% sure → entropy ≈ 0.", d: "stats", c: "vocab", g: "a 0–1 'how unsure' score", x: "50/50 coin-flip → entropy high; 99% sure either way → near 0." },
    { a: "collect more clinical variables", d: "clinical", c: "argument-role", g: "go get the lab that settles it", x: "When too unsure, the system names the one test that would reduce the doubt most." },
  ],
  p_results: [
    { a: "full observation setting models", d: "stats", c: "concept-density", g: "best case: knows every lab", x: "A model that already has all the data — the ceiling SepsisLab nearly reaches." },
    { a: "masked setting models", d: "stats", c: "background", g: "worst case: a fresh arrival", x: "A model with almost no data, like a patient who just walked into the ER." },
    { a: "approximately 10%", e: "E.g. AUC rose from ~0.79 (data-starved) toward ~0.89, near the ~0.90 full-data ceiling.", d: "stats", c: "numbers", g: "the accuracy gain (AUC)", x: "Their LSTM rose from ~0.79 (data-starved) toward ~0.89 — near the ~0.90 full-data ceiling." },
    { a: "9.6% extra laboratory values", d: "stats", c: "numbers", g: "for only a few more tests", x: "Big accuracy jump for a small extra cost — the whole pitch of the lab recommendation." },
    { a: "MIMIC-III", d: "clinical", c: "vocab", g: "a public ICU records dataset", x: "A widely-used, de-identified database of real intensive-care data for research." },
  ],
  p_eval: [
    { a: "evaluation study", d: "hci", c: "vocab", g: "the real-user test", x: "The same six clinicians tried the prototype and were interviewed about it." },
    { a: "ease feelings of being in competition", d: "hci", c: "argument-role", g: "felt less like a rival", x: "The key win: moving the AI off the verdict made it feel like a teammate." },
    { a: "retain the role of final decision-maker", d: "argument-role", c: "concept-density", g: "the human still decides", x: "By design the AI suggests; the clinician chooses — which is exactly what restored trust." },
  ],
  p_beyond: [
    { a: "highly uncertain, high-stakes, and time-sensitive", d: "argument-role", c: "concept-density", g: "the recipe where this idea fits", x: "The paper's thesis about WHERE its lesson generalizes — these three traits together." },
    { a: "stroke, heart attack, and meningitis", d: "clinical", c: "background", g: "other fast, deadly calls" },
    { a: "major depressive disorder with suicidal ideation", d: "clinical", c: "background", g: "high-stakes mental-health calls" },
    { a: "non-healthcare complex decision-making", d: "argument-role", c: "argument-role", g: "even beyond medicine", x: "Disaster response, military, business crises — anywhere fast, uncertain, high-stakes calls are made." },
  ],
  p_risks: [
    { a: "cognitive load", d: "hci", c: "vocab", g: "more for the brain to juggle", x: "Richer tools can overwhelm — participants asked for info a step at a time." },
    { a: "mistakes and errors made by AI", d: "ml", c: "argument-role", g: "the model can still be wrong" },
    { a: "potential biases embedded in AI algorithms", d: "ml", c: "argument-role", g: "unfair patterns baked in", x: "Models can inherit skew from their training data — not solved by this redesign." },
    { a: "over-dependence on AI systems", d: "hci", c: "argument-role", g: "leaning on it too hard", x: "Trust it too much and your own vigilance dulls — a subtle long-term risk." },
  ],
  p_limits: [
    { a: "study population is limited", d: "stats", c: "argument-role", g: "small sample, one hospital", x: "Six clinicians at one site — findings are suggestive, not definitive." },
    { a: "not integrated into the EHR system", d: "clinical", c: "background", g: "a prototype, not a live tool", x: "It was tested as a mock-up, so real-world behaviour may differ." },
    { a: "design probe", d: "hci", c: "vocab", g: "a prompt to spark feedback", x: "The prototype's job was to provoke reactions and surface needs, not to prove performance." },
    { a: "different responsibilities", d: "clinical", c: "argument-role", g: "nurses vs doctors need different tools", x: "A parting insight: one-size-fits-all interfaces overlook distinct clinical roles." },
  ],
};

// build augment per segment from the source paragraphs it zooms into
const origText = Object.fromEntries(p.original.map((o) => [o.id, o.text]));
let id = 0;
let total = 0, misses = 0;
const augment = {};
for (const seg of p.skeleton) {
  const anns = [];
  const seen = new Set();
  for (const pid of seg.source) {
    for (const spec of byPara[pid] ?? []) {
      const key = pid + "::" + spec.a;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!(origText[pid] || "").includes(spec.a)) {
        console.log("MISS anchor not in", pid, "->", JSON.stringify(spec.a));
        misses++;
        continue;
      }
      const ann = {
        id: "n" + ++id,
        anchor: spec.a,
        domain: spec.d,
        category: spec.c,
        display: "inline",
        content: spec.x ? spec.x : spec.g,
        gloss: spec.g,
      };
      if (spec.x && spec.x !== spec.g) ann.content = spec.x;
      if (spec.e) ann.example = spec.e;
      if (spec.viz) ann.viz = spec.viz;
      anns.push(ann);
      total++;
    }
  }
  if (anns.length) augment[seg.id] = { annotations: anns };
}

p.augment = augment;
fs.writeFileSync(path, JSON.stringify(p, null, 2) + "\n");
console.log(`\nsegments with notes: ${Object.keys(augment).length} | annotations: ${total} | anchor misses: ${misses}`);
