// Run with: node --test tests/engine.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const SI = require('./load');
const { rng, players } = require('./players');

const SAMPLE = players(6000, 99).map((a) => ({ a, r: SI.engine.interpret(a) }));

test('content is valid', () => {
  assert.deepEqual(SI.engine.validateContent(), []);
  assert.ok(SI.QUESTIONS.length >= 12, 'at least 12 questions');
  assert.ok(SI.DISHES.length >= 25, 'at least 25 dishes');
  assert.ok(SI.SPICES.length >= 20, 'at least 20 spices');
  assert.ok(SI.SPICE_NORMS && SI.DISH_BIAS, 'calibration file is present');
  SI.SPICES.forEach((s) => assert.ok(SI.SPICE_NORMS[s.id], 'calibration covers ' + s.id));
  SI.DISHES.forEach((d) => assert.ok(d.id in SI.DISH_BIAS, 'calibration covers ' + d.id));
});

test('every spice family is represented', () => {
  const families = new Set(SI.SPICES.map((s) => s.family));
  Object.keys(SI.SPICE_FAMILIES).forEach((f) => assert.ok(families.has(f), f));
});

test('question selection returns 10 distinct questions', () => {
  const rand = rng(1);
  for (let i = 0; i < 200; i++) {
    const qs = SI.engine.selectQuestions(10, rand);
    assert.equal(qs.length, 10);
    assert.equal(new Set(qs.map((q) => q.id)).size, 10);
  }
});

test('questions never mention spices, dishes or trait labels', () => {
  const names = SI.SPICES.map((s) => s.name.split(' ')[0].toLowerCase()).join('|');
  const banned = new RegExp('\\b(spices?|flavou?rs?|dish(es)?|' + names + '|adventurous|empathetic|ambitious|introvert|extrovert)\\b', 'i');
  SI.QUESTIONS.forEach((q) => {
    assert.doesNotMatch(q.prompt, banned, q.id);
    q.options.forEach((o) => assert.doesNotMatch(o.text, banned, q.id + ': ' + o.text));
  });
});

test('every blend uses only the dish’s own spices', () => {
  SAMPLE.forEach(({ r }) => {
    r.blend.forEach((b) => assert.ok(r.dish.spices[b.spice.id], `${b.spice.name} is not in ${r.dish.name}`));
  });
});

test('every blend has 3–6 spices, integer percentages summing to exactly 100', () => {
  SAMPLE.forEach(({ r }) => {
    assert.ok(r.blend.length >= 3 && r.blend.length <= 6, 'blend size ' + r.blend.length);
    assert.equal(r.blend.reduce((a, b) => a + b.pct, 0), 100);
    r.blend.forEach((b) => { assert.ok(Number.isInteger(b.pct)); assert.ok(b.pct >= SI.TUNING.minPct); });
    assert.equal(new Set(r.blend.map((b) => b.spice.id)).size, r.blend.length, 'no duplicate spices');
    for (let k = 1; k < r.blend.length; k++) assert.ok(r.blend[k - 1].pct >= r.blend[k].pct, 'sorted');
  });
});

test('same answers always give the same result', () => {
  SAMPLE.slice(0, 300).forEach(({ a, r }) => {
    const r2 = SI.engine.interpret(a.slice().reverse());
    assert.equal(r.dish.id, r2.dish.id);
    assert.deepEqual(r.blend.map((b) => [b.spice.id, b.pct]), r2.blend.map((b) => [b.spice.id, b.pct]));
    assert.equal(r.text.overview, r2.text.overview);
  });
});

test('every result has complete, personalised text', () => {
  SAMPLE.slice(0, 2000).forEach(({ r }) => {
    const t = r.text;
    assert.match(t.name, /^The /);
    assert.ok(t.overview.length > 40);
    assert.ok(t.flavour.length >= 3 && t.flavour.length <= 6);
    assert.equal(t.spices.length, r.blend.length);
    t.spices.forEach((s) => { assert.ok(s.role); assert.ok(s.line); });
    assert.ok(t.dish.mapping.includes(r.blend[0].spice.name.toLowerCase()));
    assert.equal(t.recap.length, 3);
    assert.ok(t.share.includes(r.dish.name));
    const c = t.card;
    assert.ok(c.heat >= 30 && c.heat <= 160 && c.heat % 10 === 0, 'heat ' + c.heat);
    assert.equal(c.moves.length, 2);
    c.moves.forEach((m) => { assert.ok(m.name && m.text); assert.ok(m.cost >= 1 && m.cost <= 3); });
    assert.ok(c.weakness && c.resists && c.recharge && c.clicks && c.origin);
    assert.equal(c.strengths.length, 3); assert.equal(new Set(c.strengths).size, 3);
    assert.ok(c.number >= 1 && c.number <= c.total);
    assert.doesNotMatch(JSON.stringify(t), /undefined|NaN/);
  });
});

test('overviews vary between participants', () => {
  const seen = new Set(SAMPLE.slice(0, 500).map(({ r }) => r.text.overview));
  assert.ok(seen.size > 40, 'distinct overviews: ' + seen.size);
});

test('every dish is reachable and none dominates', () => {
  const counts = {};
  SAMPLE.forEach(({ r }) => { counts[r.dish.id] = (counts[r.dish.id] || 0) + 1; });
  SI.DISHES.forEach((d) => {
    const f = (counts[d.id] || 0) / SAMPLE.length;
    assert.ok(f > 0.01, `${d.id} too rare: ${f}`);
    assert.ok(f < 0.08, `${d.id} too common: ${f}`);
  });
});

test('answers, not calibration, decide extreme players', () => {
  const extreme = (dim) => SI.QUESTIONS.slice(0, 10).map((q) => {
    let best = 0;
    q.options.forEach((o, i) => { if ((o.s[dim] || 0) > (q.options[best].s[dim] || 0)) best = i; });
    return { questionId: q.id, optionIndex: best };
  });
  // The leading spice of an extreme player expresses that dimension strongly.
  SI.DIMENSIONS.forEach((dim) => {
    const r = SI.engine.interpret(extreme(dim));
    assert.ok((r.blend[0].spice.vector[dim] || 0) >= 2, `${dim} led by ${r.blend[0].spice.id} in ${r.dish.id}`);
  });
});

test('answers shift the proportions within a dish', () => {
  // Players who land on the same dish don't all get the same mix.
  const byDish = {};
  SAMPLE.forEach(({ r }) => {
    (byDish[r.dish.id] = byDish[r.dish.id] || new Set()).add(r.blend.map((b) => b.spice.id + b.pct).join());
  });
  const varied = Object.values(byDish).filter((s) => s.size >= 3).length;
  assert.ok(varied >= SI.DISHES.length * 0.8, 'dishes with at least 3 distinct mixes: ' + varied);
});

test('invalid input is rejected clearly', () => {
  assert.throws(() => SI.engine.interpret([]), /No answers/);
  assert.throws(() => SI.engine.interpret([{ questionId: 'nope', optionIndex: 0 }]), /Unknown question/);
  assert.throws(() => SI.engine.interpret([{ questionId: 'menu', optionIndex: 9 }]), /Unknown option/);
});

test('percentage allocation always totals 100 for any weights', () => {
  const rand = rng(3);
  for (let i = 0; i < 5000; i++) {
    const k = 3 + Math.floor(rand() * 4);
    const picked = SI.SPICES.slice(0, k).map((spice, order) => ({ spice, order, weight: rand() * 3 }));
    assert.equal(SI.engine.allocatePercentages(picked).reduce((a, b) => a + b.pct, 0), 100);
  }
  const tied = SI.SPICES.slice(0, 3).map((spice, order) => ({ spice, order, weight: 1 }));
  assert.equal(SI.engine.allocatePercentages(tied).reduce((a, b) => a + b.pct, 0), 100);
});
