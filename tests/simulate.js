// Distribution report: run `node tests/simulate.js [runs]`.
const SI = require('./load');
const { players } = require('./players');

const runs = Number(process.argv[2] || 6000);
const dishes = {}, sizes = {}, names = new Set(), tops = {};
players(runs, 42).forEach((a) => {
  const r = SI.engine.interpret(a);
  dishes[r.dish.name] = (dishes[r.dish.name] || 0) + 1;
  sizes[r.blend.length] = (sizes[r.blend.length] || 0) + 1;
  tops[r.blend[0].spice.name] = (tops[r.blend[0].spice.name] || 0) + 1;
  names.add(r.text.name);
});
const pct = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${k.padEnd(26)} ${(100 * v / runs).toFixed(1)}%`).join('\n');
console.log('Dishes (' + Object.keys(dishes).length + '/' + SI.DISHES.length + '):\n' + pct(dishes));
console.log('Leading spice:\n' + pct(tops));
console.log('Blend size:\n' + pct(sizes));
console.log('Distinct blend names:', names.size);
