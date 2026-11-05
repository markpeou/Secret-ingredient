/*
 * Spice compatibility.
 *
 * A player's blend is turned into a trait profile (each spice's traits, weighted
 * by its percentage). That profile is compared with every spice the player does
 * not already have, using the trait chart in js/data/compatibility.js.
 *
 * Some spices span many traits and get on with almost everyone, so raw scores
 * would hand the same few spices to every player. Each spice's score is therefore
 * judged against how well that spice gets on with people in general, plus a small
 * calibrated offset (SI.MATCH_BIAS, from scripts/calibrate.js) that spreads matches
 * across spices. Offsets are capped so a player's answers still decide.
 */
(function (SI) {
  const cell = (a, b) => SI.PAIRINGS[a + '|' + b] || SI.PAIRINGS[b + '|' + a];

  // How well two trait profiles get on, plus the trait pairs behind the score.
  function vectorScore(A, B, withParts = false) {
    let total = 0, wa = 0, wb = 0;
    const parts = withParts ? [] : null;
    for (const a in A) wa += A[a];
    for (const b in B) wb += B[b];
    for (const a in A) {
      for (const b in B) {
        const c = A[a] * B[b] * cell(a, b).score;
        total += c;
        if (parts) parts.push({ a, b, c });
      }
    }
    return { score: wa && wb ? total / (wa * wb) : 0, parts };
  }

  function blendVector(blend) {
    const v = {};
    blend.forEach((b) => {
      for (const d in b.spice.vector) v[d] = (v[d] || 0) + (b.pct / 100) * b.spice.vector[d];
    });
    return v;
  }

  // How sociable each spice is on average: its mean score against every spice.
  let sociability = null;
  function baseline() {
    if (sociability) return sociability;
    sociability = {};
    SI.SPICES.forEach((s) => {
      const sum = SI.SPICES.reduce((acc, o) => acc + vectorScore(s.vector, o.vector).score, 0);
      sociability[s.id] = sum / SI.SPICES.length;
    });
    return sociability;
  }

  // The trait pairing that contributes most (or, for clashes, least). `avoid` skips pairings
  // already shown, so the extra matches don't just repeat the main one's nickname.
  const pairingFrom = (parts, pick, avoid = new Set()) => {
    const pool = pick === 'max' ? parts.filter((p) => p.c > 0) : parts;
    const fresh = pool.filter((p) => !avoid.has(SI.compat.key(p.a, p.b)));
    const list = fresh.length ? fresh : (pool.length ? pool : parts);
    const p = list.reduce((x, y) => (pick === 'max' ? (y.c > x.c ? y : x) : (y.c < x.c ? y : x)));
    return Object.assign({ key: SI.compat.key(p.a, p.b) }, cell(p.a, p.b));
  };

  /*
   * best  – your perfect complement, with the trait pairing that makes it work
   * also  – two more spices you get on with, each with its own pairing
   * clash – the spice you're least alike; `tension` is true when it's a real clash,
   *         in which case `pairing` names the friction behind it
   */
  function match(blend) {
    const mine = new Set(blend.map((b) => b.spice.id));
    const me = blendVector(blend);
    const social = baseline();
    const bias = SI.MATCH_BIAS || { best: {}, clash: {} };
    const ranked = SI.SPICES
      .map((spice, order) => {
        const r = vectorScore(me, spice.vector);
        return { spice, order, score: r.score, rel: r.score - social[spice.id] + (bias.best[spice.id] || 0), low: r.score + (bias.clash[spice.id] || 0) };
      })
      .filter((x) => !mine.has(x.spice.id))
      .sort((x, y) => y.rel - x.rel || x.order - y.order);
    const best = ranked[0];
    // The clash must score below every spice offered as a good match, whatever the offsets say.
    const floor = Math.min(...ranked.slice(0, 3).map((x) => x.score));
    const pool = ranked.filter((x) => x.score < floor);
    const worst = (pool.length ? pool : ranked).slice().sort((x, y) => x.low - y.low || x.order - y.order)[0];
    const tension = worst.score < 0;
    const partsOf = (x) => vectorScore(me, x.spice.vector, true).parts;
    const bestOut = { spice: best.spice, score: best.score, pairing: pairingFrom(partsOf(best), 'max') };
    const used = new Set([bestOut.pairing.key]);
    return {
      best: bestOut,
      also: ranked.slice(1, 3).map((x) => {
        const pairing = pairingFrom(partsOf(x), 'max', used);
        used.add(pairing.key);
        return { spice: x.spice, score: x.score, pairing };
      }),
      clash: { spice: worst.spice, score: worst.score, tension, pairing: tension ? pairingFrom(partsOf(worst), 'min') : null }
    };
  }

  const key = (a, b) => (SI.PAIRINGS[a + '|' + b] ? a + '|' + b : b + '|' + a);
  SI.compat = { cell, key, vectorScore, blendVector, match };
})(globalThis.SI = globalThis.SI || {});
