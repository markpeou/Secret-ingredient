// Simulated players shared by tests, calibration and the distribution report.
// "random" players pick uniformly; "persona" players have a consistent hidden
// personality and pick the answers that suit it, with some noise.
const SI = require('./load');

function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }

function randomPlayer(rand) {
  return SI.engine.selectQuestions(10, rand).map((q) => ({ questionId: q.id, optionIndex: Math.floor(rand() * q.options.length) }));
}

function personaPlayer(rand) {
  const w = {};
  SI.DIMENSIONS.forEach((d) => { w[d] = Math.pow(rand(), 2); });
  return SI.engine.selectQuestions(10, rand).map((q) => {
    let best = 0, bv = -Infinity;
    q.options.forEach((o, k) => {
      let v = rand() * 1.5;
      for (const d in o.s) v += o.s[d] * w[d];
      if (v > bv) { bv = v; best = k; }
    });
    return { questionId: q.id, optionIndex: best };
  });
}

function players(n, seed = 1) {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) out.push(i % 2 ? personaPlayer(rand) : randomPlayer(rand));
  return out;
}

module.exports = { rng, randomPlayer, personaPlayer, players };
