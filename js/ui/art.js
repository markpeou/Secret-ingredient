/*
 * Inline SVG illustrations: dishes, the cloche and stars. Characters live in characters.js.
 * Flat, chunky-outline "cooking game" style. No external images.
 */
(function (SI) {
  const INK = '#4A2616';
  const O = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const o2 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const ow = (w) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  /* ---------- Toppings ----------
     Each ingredient is drawn with enough detail to be recognised at small sizes.
     All take (x, y) plus optional rotation and scale. */
  const at = (x, y, r = 0, s = 1) => `transform="translate(${x} ${y}) rotate(${r}) scale(${s})"`;

  function prawn(x, y, r = 0, s = 1) {
    // A smooth curled body that tapers from head to tail, with shell stripes and a tail fan.
    const R = 11, steps = 14, a0 = -60, a1 = 170;
    const pt = (t, off) => {
      const a = (a0 + (a1 - a0) * t) * Math.PI / 180, w = 9 - 5.5 * t, rad = R + off * w / 2;
      return [rad * Math.cos(a), rad * Math.sin(a)];
    };
    const outer = [], inner = [];
    for (let i = 0; i <= steps; i++) { outer.push(pt(i / steps, 1)); inner.push(pt(i / steps, -1)); }
    const f = (p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    const body = 'M' + outer.map(f).join(' L') + ' L' + inner.reverse().map(f).join(' L') + ' Z';
    const stripes = [0.2, 0.36, 0.52, 0.68, 0.84].map((t) => `<path d="M${f(pt(t, -0.8))} L${f(pt(t, 0.8))}" stroke="#FFD9C4" stroke-width="1.7" stroke-linecap="round"/>`).join('');
    const head = pt(0, 0), tail = pt(1, 0), ta = a1 * Math.PI / 180;
    const tailRot = (a1 + 90) % 360;
    return `<g ${at(x, y, r, s)}>
      <path d="M${f([head[0] + 3, head[1] - 3])} Q${head[0] + 14} ${head[1] - 16} ${head[0] + 22} ${head[1] - 9} M${f([head[0] + 1, head[1] - 4])} Q${head[0] + 6} ${head[1] - 20} ${head[0] + 17} ${head[1] - 21}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>
      <g transform="translate(${f(tail)}) rotate(${tailRot})"><path d="M0 -1 L-6 -9 L0 -6 L6 -9 Z" fill="#FF6E3A" ${ow(2)}/></g>
      <path d="${body}" fill="#FF8A57" ${ow(2.4)}/>
      <path d="M${f(pt(0.05, 0.35))} ${outer.slice(1, 9).map((p, i) => 'L' + f(pt((i + 1) / steps * 0.9, 0.35))).join(' ')}" fill="none" stroke="#FFB08A" stroke-width="2" stroke-linecap="round"/>
      ${stripes}
      <circle cx="${(head[0] + 1.5).toFixed(1)}" cy="${(head[1] - 1).toFixed(1)}" r="1.5" fill="${INK}"/>
    </g>`;
  }

  const T = {
    prawn: (x, y) => prawn(x, y, 0, 0.9),
    beef: (x, y) => `<g ${at(x, y)}>
      <path d="M-18 2 Q-14 -9 2 -8 Q14 -7 16 2 Q4 8 -18 2 Z" fill="#B9675C" ${ow(2.4)}/>
      <path d="M-8 6 Q-2 -4 12 -2 Q22 0 22 7 Q8 12 -8 6 Z" fill="#C97A6E" ${ow(2.4)}/>
      <path d="M-14 0 Q-4 -5 8 -4 M-2 5 Q6 1 16 3" fill="none" stroke="#F2C4BA" stroke-width="1.8" stroke-linecap="round"/></g>`,
    herbs: (x, y) => {
      const leaf = (lx, ly, rot, c) => `<path transform="translate(${lx} ${ly}) rotate(${rot})" d="M0 0 C-5 -2 -6 -8 -2 -10 C-1 -13 3 -13 4 -10 C8 -9 8 -3 3 -1 Z" fill="${c}" ${ow(1.8)}/>`;
      return `<g ${at(x, y)}><path d="M-6 6 Q0 0 8 -2" fill="none" stroke="#3E7D2E" stroke-width="2" stroke-linecap="round"/>
        ${leaf(-6, 6, -40, '#5DB044')}${leaf(2, 2, 10, '#72C255')}${leaf(8, -2, 55, '#5DB044')}</g>`;
    },
    basil: (x, y) => `<g ${at(x, y, -18)}><path d="M-13 0 C-8 -9 8 -9 13 0 C8 9 -8 9 -13 0 Z" fill="#3F8E3A" ${ow(2.2)}/>
      <path d="M-11 0 L11 0 M-4 0 L-1 -5 M2 0 L5 -5 M-4 0 L-1 5 M2 0 L5 5" fill="none" stroke="#8FD06F" stroke-width="1.4" stroke-linecap="round"/></g>`,
    lime: (x, y, r = 0) => `<g ${at(x, y, r)}>
      <path d="M-15 3 A15 15 0 0 1 15 3 Z" fill="#5FA62B" ${ow(2.4)}/>
      <path d="M-12 3 A12 12 0 0 1 12 3 Z" fill="#F4F9D8"/>
      <path d="M-10.5 3 A10.5 10.5 0 0 1 10.5 3 Z" fill="#CFE878"/>
      <path d="M0 3 L0 -7.5 M0 3 L-7.4 -4.4 M0 3 L7.4 -4.4" stroke="#F4F9D8" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M-15 3 L15 3" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>`,
    chilli: (x, y) => {
      const ring = (cx, cy, rr) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#E2362E" ${ow(2)}/><circle cx="${cx}" cy="${cy}" r="${rr - 2.4}" fill="#FFB7A3"/><circle cx="${cx - 1}" cy="${cy}" r="1" fill="#FFE27A"/><circle cx="${cx + 1.2}" cy="${cy + 0.8}" r="1" fill="#FFE27A"/>`;
      return `<g ${at(x, y)}>${ring(0, 0, 6)}${ring(11, 4, 5.4)}</g>`;
    },
    egg: (x, y) => `<g ${at(x, y)}><ellipse rx="15" ry="11" fill="#FFFDF5" ${ow(2.6)}/>
      <circle cy="1" r="7.5" fill="#FFB43A" ${ow(1.8)}/><circle cy="1" r="4.6" fill="#FF8A1E"/><circle cx="-2" cy="-1.5" r="1.4" fill="#FFE2A8"/></g>`,
    nori: (x, y) => `<g ${at(x, y, -12)}><rect x="-8" y="-22" width="18" height="28" rx="2" fill="#24331F" ${ow(2.4)}/>
      <path d="M-4 -18 L-4 2 M1 -18 L1 2 M6 -18 L6 2" stroke="#3D5534" stroke-width="1.4"/></g>`,
    chilliOil: (x, y) => `<g ${at(x, y)} opacity=".92"><ellipse rx="17" ry="5" fill="#D8342B"/><ellipse cx="-25" cy="8" rx="9" ry="3.5" fill="#D8342B"/><ellipse cx="20" cy="9" rx="5" ry="2.4" fill="#D8342B"/>
      <circle cx="6" cy="-1" r="1.6" fill="#7A1410"/><circle cx="-6" cy="1" r="1.6" fill="#7A1410"/><circle cx="-24" cy="8" r="1.3" fill="#7A1410"/><ellipse cx="-4" cy="-2" rx="5" ry="1.2" fill="#FF8A6B"/></g>`,
    spring: (x, y) => `<g ${at(x, y)}>${[[0, 0], [9, 3], [2, 8], [-8, 5]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="4" fill="#E8F7C9" ${ow(1.8)}/><circle cx="${cx}" cy="${cy}" r="2.2" fill="none" stroke="#6CBF45" stroke-width="1.6"/>`).join('')}</g>`,
    eggplant: (x, y) => `<g ${at(x, y)}><circle r="10" fill="#8BBF4C" ${ow(2.2)}/><circle r="7.4" fill="#F2EBC9"/>
      ${[0, 60, 120, 180, 240, 300].map((d) => `<circle cx="${(4 * Math.cos(d * Math.PI / 180)).toFixed(1)}" cy="${(4 * Math.sin(d * Math.PI / 180)).toFixed(1)}" r="1" fill="#B08A4A"/>`).join('')}</g>`,
    cream: (x, y) => `<g ${at(x, y)}><path d="M-22 0 q11 -10 22 0 t22 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round" opacity=".25"/><path d="M-22 0 q11 -10 22 0 t22 0" fill="none" stroke="#FFF6E8" stroke-width="5" stroke-linecap="round"/></g>`,
    chicken: (x, y) => `<g ${at(x, y, -8)}><path d="M-12 -6 Q-2 -12 10 -7 Q14 2 8 8 Q-4 11 -12 5 Q-15 0 -12 -6 Z" fill="#D26E2C" ${ow(2.4)}/>
      <path d="M-7 -7 L-2 6 M1 -8 L5 6" stroke="#8C3A12" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="-4" cy="-4" rx="3" ry="1.5" fill="#F2A15E"/></g>`,
    peanut: (x, y) => `<g ${at(x, y)}>${[[0, 0, 0], [8, 2, 40], [3, 8, 80], [-7, 5, 20], [12, 9, 60]].map(([cx, cy, r]) => `<path transform="translate(${cx} ${cy}) rotate(${r})" d="M-3 -2 L2 -3 L4 1 L0 3 L-3 2 Z" fill="#D9A45E" ${ow(1.6)}/><path transform="translate(${cx} ${cy}) rotate(${r})" d="M-1.5 -1 L1.5 -1.5" stroke="#F4D49C" stroke-width="1.2" stroke-linecap="round"/>`).join('')}</g>`,
    cheese: (x, y) => `<g ${at(x, y)}><path d="M-12 0 l20 -7 l3 6 z" fill="#FFF3B8" ${ow(1.8)}/><path d="M0 8 l18 -5 l1 6 z" fill="#FFE98C" ${ow(1.8)}/></g>`,
    staranise: (x, y) => `<path ${at(x, y)} d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3 Z" fill="#7A4A2A" ${ow(2)}/>`,
    sprouts: (x, y, r = 0) => `<g ${at(x, y, r)}>${[[-10, 4, -20], [-2, 0, 10], [6, 4, 35], [-6, 9, -5], [4, 10, 20]].map(([sx, sy, rot]) => `<g transform="translate(${sx} ${sy}) rotate(${rot})">
        <path d="M0 0 Q3 -10 0 -18" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="M0 0 Q3 -10 0 -18" fill="none" stroke="#FFFBEA" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="0" cy="-19" rx="2.8" ry="3.6" fill="#F2DE7A" ${ow(1.4)}/></g>`).join('')}</g>`,
    tofu: (x, y) => `<g ${at(x, y)}><path d="M-8 -3 L0 -7 L8 -3 L8 5 L0 9 L-8 5 Z" fill="#E3A23C" ${ow(2.2)}/><path d="M-8 -3 L0 1 L8 -3 L0 -7 Z" fill="#F5C766" ${ow(1.6)}/><path d="M0 1 L0 9" stroke="${INK}" stroke-width="1.6"/></g>`,
    eggBits: (x, y) => `<g ${at(x, y)}>${[[0, 0, 5], [10, 3, 4], [4, 9, 3.6]].map(([cx, cy, rr]) => `<path transform="translate(${cx} ${cy})" d="M${-rr} 0 Q${-rr} ${-rr} 0 ${-rr} Q${rr} ${-rr * 1.2} ${rr} 0 Q${rr * 0.8} ${rr} 0 ${rr * 0.9} Q${-rr * 1.1} ${rr} ${-rr} 0 Z" fill="#FFD54A" ${ow(1.6)}/>`).join('')}</g>`,
    chives: (x, y) => `<g ${at(x, y)}>${[[0, 0, 20], [8, -6, -30], [-6, 6, 60], [12, 6, 10]].map(([cx, cy, r]) => `<path transform="translate(${cx} ${cy}) rotate(${r})" d="M-4 0 L4 0" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path transform="translate(${cx} ${cy}) rotate(${r})" d="M-4 0 L4 0" stroke="#5DB044" stroke-width="2.4" stroke-linecap="round"/>`).join('')}</g>`,
    carrot: (x, y) => `<g ${at(x, y)}><ellipse rx="8" ry="6" fill="#F28C28" ${ow(2.2)}/><ellipse rx="4" ry="3" fill="none" stroke="#FFC078" stroke-width="1.6"/></g>`,
    drumstick: (x, y) => `<g ${at(x, y, -20)}><rect x="-16" y="-4" width="32" height="8" rx="4" fill="#6FA845" ${ow(2.2)}/><path d="M-10 -4 L-10 4 M0 -4 L0 4 M10 -4 L10 4" stroke="#4E7F2E" stroke-width="1.4"/></g>`,
    curryLeaf: (x, y) => `<g ${at(x, y, 25)}><path d="M-12 0 C-6 -7 6 -7 12 0 C6 7 -6 7 -12 0 Z" fill="#2F6E2A" ${ow(2)}/><path d="M-10 0 L10 0" stroke="#6FB04E" stroke-width="1.3"/></g>`,
    mustardSeeds: (x, y) => `<g ${at(x, y)}>${[[0, 0], [6, 3], [-5, 4], [10, -2], [-9, -3], [3, -5], [14, 4]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.6" fill="#2E1A10"/>`).join('')}</g>`,
    okra: (x, y) => `<g ${at(x, y)}><path d="M0 -8 L3 -3 L8 -2 L4 2 L5 8 L0 5 L-5 8 L-4 2 L-8 -2 L-3 -3 Z" fill="#8BBF4C" ${ow(1.8)}/>${[[0, -3], [2.5, 1], [-2.5, 1]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.1" fill="#F4F0D0"/>`).join('')}</g>`,
    stewBeef: (x, y) => `<g ${at(x, y, 8)}><path d="M-11 -7 Q0 -11 11 -6 Q14 2 9 8 Q-2 11 -11 7 Q-14 0 -11 -7 Z" fill="#6E3220" ${ow(2.4)}/><path d="M-6 -5 Q0 -7 5 -5" fill="none" stroke="#A85A3E" stroke-width="2" stroke-linecap="round"/></g>`,
    potato: (x, y) => `<g ${at(x, y, -10)}><path d="M-9 -6 Q2 -10 10 -4 Q12 4 6 8 Q-4 10 -10 5 Q-12 -1 -9 -6 Z" fill="#F2D88A" ${ow(2.2)}/><ellipse cx="-2" cy="-3" rx="3" ry="1.5" fill="#FFF0C0"/></g>`,
    plantain: (x, y, r = 0) => `<g ${at(x, y, r)}><ellipse rx="10" ry="6" fill="#B8641E" ${ow(2)}/><ellipse rx="7" ry="3.8" fill="#F6B83C"/></g>`,
    peas: (x, y) => `<g ${at(x, y)}>${[[0, 0], [7, 2], [3, 7], [-6, 4], [12, -3]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3" fill="#6CBF45" ${ow(1.4)}/>`).join('')}</g>`,
    pepperStrip: (x, y, r = 0) => `<g ${at(x, y, r)}><path d="M-12 0 Q0 -6 12 0" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/><path d="M-12 0 Q0 -6 12 0" fill="none" stroke="#E2362E" stroke-width="3.6" stroke-linecap="round"/></g>`,
    mussel: (x, y, r = 0) => `<g ${at(x, y, r)}><path d="M-12 0 C-10 -10 10 -10 14 0 C10 8 -8 8 -12 0 Z" fill="#2B2B3A" ${ow(2.2)}/><path d="M-8 0 C-6 -5 6 -5 9 0 C6 4 -5 4 -8 0 Z" fill="#F08A3C"/></g>`,
    lemon: (x, y, r = 0) => `<g ${at(x, y, r)}><path d="M-13 3 A13 13 0 0 1 13 3 Z" fill="#F2D23A" ${ow(2.2)}/><path d="M-10 3 A10 10 0 0 1 10 3 Z" fill="#FFF3A8"/><path d="M0 3 L0 -6 M0 3 L-6 -3.5 M0 3 L6 -3.5" stroke="#F2D23A" stroke-width="1.5"/><path d="M-13 3 L13 3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></g>`,
    sesameSeeds: (x, y) => `<g ${at(x, y)}>${[[0, 0, 20], [8, 3, -30], [-7, 4, 60], [4, -5, 0], [-3, 8, 40], [12, -2, 80]].map(([cx, cy, r]) => `<ellipse cx="${cx}" cy="${cy}" rx="2.2" ry="1.2" transform="rotate(${r} ${cx} ${cy})" fill="#FFF8E6" stroke="${INK}" stroke-width="0.8"/>`).join('')}</g>`,
    mint: (x, y) => `<g ${at(x, y, -20)}><path d="M0 0 C-6 -3 -8 -10 -2 -12 C4 -12 6 -4 0 0 Z" fill="#4FB06A" ${ow(1.8)}/><path d="M0 0 C6 -2 10 4 6 8 C0 10 -2 4 0 0 Z" fill="#62C47C" ${ow(1.8)}/></g>`,
    friedOnion: (x, y) => `<g ${at(x, y)}>${[[0, 0, 20], [6, 3, -40], [-5, 4, 70], [9, -3, 10]].map(([cx, cy, r]) => `<path transform="translate(${cx} ${cy}) rotate(${r})" d="M-5 0 Q0 -4 5 0" fill="none" stroke="#8A4A1A" stroke-width="2.6" stroke-linecap="round"/>`).join('')}</g>`,
    flakes: (x, y) => `<g ${at(x, y)}>${[[0, 0], [7, -3], [13, 2], [4, 6], [-6, 4], [10, 8]].map(([cx, cy]) => `<rect x="${cx}" y="${cy}" width="2.6" height="1.8" rx="0.6" fill="#C9241C" transform="rotate(${cx * 7} ${cx} ${cy})"/>`).join('')}</g>`,
    fish: (x, y) => `<g ${at(x, y)}>${[[-8, -2, -10], [6, 2, 14], [-1, 7, 4]].map(([cx, cy, r]) => `<g transform="translate(${cx} ${cy}) rotate(${r})"><rect x="-7" y="-5.5" width="14" height="11" rx="3" fill="#FBF3EA" ${ow(2)}/><path d="M-4 -3 Q0 0 -4 3 M1 -3 Q5 0 1 3" fill="none" stroke="#F2C9B4" stroke-width="1.4" stroke-linecap="round"/></g>`).join('')}</g>`,
    redOnion: (x, y) => `<g ${at(x, y)}>${[[0, 0, 10], [9, 4, -30], [-8, 5, 50]].map(([cx, cy, r]) => `<path transform="translate(${cx} ${cy}) rotate(${r})" d="M-8 2 Q0 -8 8 2" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path transform="translate(${cx} ${cy}) rotate(${r})" d="M-8 2 Q0 -8 8 2" fill="none" stroke="#B5487E" stroke-width="2.6" stroke-linecap="round"/>`).join('')}</g>`,
    tomato: (x, y) => `<g ${at(x, y)}><circle r="9" fill="#E2362E" ${ow(2.2)}/><circle r="6" fill="#FF7A62"/>${[[-2.5, -1.5], [2.5, -1.5], [0, 3]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="1.4" ry="2" fill="#FFE27A"/>`).join('')}</g>`,
    pita: (x, y) => `<g ${at(x, y)}>${[[0, 0, 15], [12, 5, -25]].map(([cx, cy, r]) => `<path transform="translate(${cx} ${cy}) rotate(${r})" d="M-8 5 L0 -8 L8 5 Z" fill="#E8B35E" ${ow(2)}/><circle cx="${cx}" cy="${cy}" r="1.2" fill="#B8722A"/>`).join('')}</g>`,
    cucumber: (x, y) => `<g ${at(x, y)}><circle r="9" fill="#4E8F3A" ${ow(2.2)}/><circle r="7" fill="#DDF0B8"/>${[0, 120, 240].map((d) => `<ellipse cx="${(3 * Math.cos(d * Math.PI / 180)).toFixed(1)}" cy="${(3 * Math.sin(d * Math.PI / 180)).toFixed(1)}" rx="1.2" ry="2" transform="rotate(${d + 90} ${(3 * Math.cos(d * Math.PI / 180)).toFixed(1)} ${(3 * Math.sin(d * Math.PI / 180)).toFixed(1)})" fill="#A8CF7A"/>`).join('')}</g>`,
    sumac: (x, y) => `<g ${at(x, y)}>${[[0, 0], [6, 3], [-5, 4], [10, -2], [-9, -3], [3, -5], [14, 4], [-2, 8]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.7" fill="#8E1F3A"/>`).join('')}</g>`,
    // Drawn across the middle of the bowl whatever slot it lands in.
    cinnamonLines: () => `<g fill="none" stroke="#9A4E1E" stroke-width="2.4" stroke-linecap="round"><path d="M62 98 L138 98 M68 108 L132 108"/><path d="M86 90 L80 114 M114 90 L120 114"/></g>`,
    pistachio: (x, y) => `<g ${at(x, y)}>${[[0, 0, 20], [7, 4, -40], [-6, 5, 70]].map(([cx, cy, r]) => `<ellipse cx="${cx}" cy="${cy}" rx="3.4" ry="2.2" transform="rotate(${r} ${cx} ${cy})" fill="#8DBF4A" ${ow(1.2)}/>`).join('')}</g>`,
    almond: (x, y) => `<g ${at(x, y)}>${[[0, 0, -20], [9, 2, 30]].map(([cx, cy, r]) => `<ellipse cx="${cx}" cy="${cy}" rx="4.6" ry="2.4" transform="rotate(${r} ${cx} ${cy})" fill="#FFF3DC" ${ow(1.4)}/>`).join('')}</g>`,
    chickpeas: (x, y) => `<g ${at(x, y)}>${[[0, 0], [7, 2], [3, 7], [-6, 4], [-2, -5]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#E6C27A" ${ow(1.4)}/><circle cx="${cx - 1}" cy="${cy - 1}" r="1" fill="#F6E0A8"/>`).join('')}</g>`,
    macaroni: (x, y) => `<g ${at(x, y)}>${[[0, 0, 10], [10, 4, -40], [-8, 5, 60]].map(([cx, cy, r]) => `<g transform="translate(${cx} ${cy}) rotate(${r})"><path d="M-5 2 Q0 -6 5 2" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-5 2 Q0 -6 5 2" fill="none" stroke="#F6D27A" stroke-width="3.6" stroke-linecap="round"/></g>`).join('')}</g>`,
    pineapple: (x, y) => `<g ${at(x, y)}>${[[0, 0, 0], [10, 4, 30]].map(([cx, cy, r]) => `<g transform="translate(${cx} ${cy}) rotate(${r})"><path d="M-8 5 L0 -8 L8 5 Z" fill="#F6D33A" ${ow(2)}/><path d="M-4.6 2.6 L0 -4.4 L4.6 2.6" fill="none" stroke="#FFEE9A" stroke-width="1.5"/></g>`).join('')}</g>`,
    gingerShreds: (x, y) => `<g ${at(x, y)}>${[[0, 0, 20], [4, -3, -10], [-4, 2, 40], [8, 2, 70], [-2, -4, -40]].map(([cx, cy, r]) => `<path transform="translate(${cx} ${cy}) rotate(${r})" d="M-7 0 L7 0" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path transform="translate(${cx} ${cy}) rotate(${r})" d="M-7 0 L7 0" stroke="#F6DC8A" stroke-width="1.8" stroke-linecap="round"/>`).join('')}</g>`,
    greenChilli: (x, y) => `<g ${at(x, y)}>${[[0, 0, 5.6], [10, 4, 5]].map(([cx, cy, rr]) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#3E8E2E" ${ow(1.8)}/><circle cx="${cx}" cy="${cy}" r="${rr - 2.2}" fill="#C8E89A"/><circle cx="${cx}" cy="${cy}" r="0.9" fill="#F4F0D0"/>`).join('')}</g>`,
    redOil: (x, y) => `<g ${at(x, y)}><ellipse rx="13" ry="3.2" fill="#E8542A" opacity=".85"/><ellipse cx="-16" cy="7" rx="6" ry="2" fill="#E8542A" opacity=".85"/><ellipse cx="-3" cy="-0.6" rx="5" ry="1" fill="#FFA070"/></g>`,
    sausage: (x, y) => `<g ${at(x, y)}>${[[0, 0], [11, 4]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="6.5" ry="5" fill="#8A2E22" ${ow(2)}/><ellipse cx="${cx}" cy="${cy - 0.5}" rx="4.4" ry="3.2" fill="#C8574A"/><circle cx="${cx - 1.5}" cy="${cy - 1}" r="0.9" fill="#F4C4B8"/><circle cx="${cx + 1.5}" cy="${cy + 0.5}" r="0.9" fill="#F4C4B8"/>`).join('')}</g>`
  };
  const slots = [[64, 98], [104, 88], [138, 100], [96, 110], [148, 90]];

  function steam() {
    return `<g class="steam" fill="none" stroke="#A9C4D6" stroke-width="5" stroke-linecap="round" opacity=".9">
      <path d="M70 60 q-8 -10 0 -20 t0 -20"/><path d="M100 54 q-8 -10 0 -20 t0 -20"/><path d="M130 60 q-8 -10 0 -20 t0 -20"/></g>`;
  }

  function noodles(colour = '#F6DD9A') {
    return `<g fill="none" stroke="${colour}" stroke-width="4" stroke-linecap="round">
      <path d="M44 102 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0"/><path d="M50 110 q10 -8 20 0 t20 0 t20 0 t20 0 t16 0"/></g>`;
  }

  function bowl(art, rim = art.rim || '#FFFFFF', band = art.band || '#C8285E') {
    const tops = (art.toppings || []).map((t, i) => T[t] ? T[t](slots[i % slots.length][0], slots[i % slots.length][1]) : '').join('');
    return `${art.cold ? '' : steam()}
      <ellipse cx="100" cy="176" rx="62" ry="8" fill="${INK}" opacity=".15"/>
      <path d="M22 100 Q24 170 100 170 Q176 170 178 100 Z" fill="${rim}" ${O}/>
      <path d="M34 136 Q100 152 166 136" fill="none" stroke="${band}" stroke-width="7"/>
      <rect x="78" y="164" width="44" height="10" rx="4" fill="${rim}" ${O}/>
      <ellipse cx="100" cy="100" rx="78" ry="24" fill="${rim}" ${O}/>
      <ellipse cx="100" cy="102" rx="67" ry="17" fill="${art.broth}"/>
      ${art.noodles ? noodles(art.noodleColour) : ''}
      ${tops}`;
  }

  function plate(art) {
    const tops = (art.toppings || []).map((t, i) => T[t] ? T[t](slots[i % slots.length][0], slots[i % slots.length][1] + 14) : '').join('');
    let food = '';
    if (art.style === 'rice') {
      food = `<ellipse cx="100" cy="116" rx="58" ry="22" fill="${art.base}" ${O}/>
        ${[...Array(14)].map((_, i) => `<ellipse cx="${56 + (i * 37) % 88}" cy="${104 + (i * 13) % 22}" rx="4" ry="2.2" fill="#FFE59A"/>`).join('')}`;
    } else if (art.style === 'padthai') {
      const ribbons = ['M48 118 q10 -10 22 -2 t22 0 t22 -2 t22 2 t14 -2', 'M54 108 q12 -9 22 0 t22 -2 t22 2 t20 -3', 'M50 128 q12 -8 24 -1 t22 1 t22 -2 t22 1', 'M64 100 q10 -6 20 0 t20 -1 t20 1 t14 -1'];
      food = `<ellipse cx="100" cy="117" rx="62" ry="23" fill="#C9772E" ${O}/>
        ${ribbons.map((d) => `<path d="${d}" fill="none" stroke="#8A4A1A" stroke-width="7.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#F1CF95" stroke-width="4.4" stroke-linecap="round"/>`).join('')}
        ${T.tofu(54, 120)}${T.tofu(146, 128)}${T.eggBits(96, 100)}${T.eggBits(112, 126)}
        ${prawn(80, 110, -15, 0.95)}${prawn(120, 106, 20, 0.95)}
        ${T.peanut(96, 124)}${T.chives(68, 128)}${T.chives(132, 128)}${T.flakes(56, 108)}${T.herbs(148, 112)}
        ${T.sprouts(168, 128, 10)}${T.lime(36, 126, -14)}`;
    } else if (art.style === 'rendang') {
      food = `<ellipse cx="76" cy="118" rx="38" ry="18" fill="#FFFDF5" ${O}/>
        ${[...Array(10)].map((_, i) => `<ellipse cx="${52 + (i * 23) % 48}" cy="${110 + (i * 7) % 14}" rx="3.4" ry="1.8" fill="#EDE6D2"/>`).join('')}
        ${[[120, 112], [138, 122], [114, 128], [134, 106], [150, 116]].map(([x, y], i) => `<g ${at(x, y, i * 30)}><path d="M-11 -7 Q0 -11 11 -6 Q14 2 9 8 Q-2 11 -11 7 Q-14 0 -11 -7 Z" fill="#5A2414" ${ow(2.4)}/><path d="M-6 -4 Q0 -6 5 -4" fill="none" stroke="#A8502E" stroke-width="2" stroke-linecap="round"/></g>`).join('')}
        ${T.chilli(128, 96)}${T.herbs(64, 104)}`;
    } else if (art.style === 'biryani') {
      food = `<ellipse cx="100" cy="116" rx="60" ry="22" fill="#FFF8E8" ${O}/>
        ${[...Array(26)].map((_, i) => `<ellipse cx="${48 + (i * 37) % 104}" cy="${104 + (i * 11) % 24}" rx="3.6" ry="1.6" transform="rotate(${(i * 47) % 180} ${48 + (i * 37) % 104} ${104 + (i * 11) % 24})" fill="${['#F6B83C', '#FFFDF5', '#F08A3C', '#FFE9A8'][i % 4]}"/>`).join('')}
        ${T.chicken(78, 112)}${T.chicken(124, 118)}${T.egg(102, 104)}${T.friedOnion(64, 124)}${T.friedOnion(138, 104)}${T.mint(150, 120)}`;
    } else if (art.style === 'jollof') {
      food = `<ellipse cx="92" cy="116" rx="56" ry="22" fill="#D9471E" ${O}/>
        ${[...Array(22)].map((_, i) => `<ellipse cx="${44 + (i * 31) % 96}" cy="${104 + (i * 13) % 24}" rx="3.4" ry="1.6" transform="rotate(${(i * 53) % 180} ${44 + (i * 31) % 96} ${104 + (i * 13) % 24})" fill="#F27A3C"/>`).join('')}
        ${T.plantain(146, 118, 20)}${T.plantain(160, 128, -10)}${T.plantain(148, 134, 30)}
        <g ${at(96, 108, -20)}><path d="M-16 -8 Q0 -16 14 -6 Q18 4 8 10 Q-6 14 -16 4 Z" fill="#B8551E" ${ow(2.4)}/><rect x="12" y="-2" width="16" height="6" rx="3" fill="#FFF3DC" ${ow(2)}/><path d="M-10 -6 L-4 8 M0 -8 L6 8" stroke="#7A2E0E" stroke-width="2" stroke-linecap="round"/></g>
        ${T.herbs(64, 104)}${T.pepperStrip(70, 124, 10)}`;
    } else if (art.style === 'steak') {
      const fries = [...Array(7)].map((_, i) => `<g transform="translate(${142 + (i % 4) * 7} ${110 + Math.floor(i / 4) * 10}) rotate(${-30 + i * 11})"><rect x="-3" y="-14" width="6" height="28" rx="2" fill="#F6CB4E" ${ow(1.8)}/></g>`).join('');
      food = `<ellipse cx="80" cy="128" rx="50" ry="13" fill="#F2DDB4" ${ow(2.4)}/>
        ${fries}
        <g transform="translate(80 114) rotate(-8)">
          <path d="M-40 -6 Q-38 -22 -4 -22 Q34 -22 38 -6 Q40 12 6 14 Q-38 14 -40 -6 Z" fill="#7A3A22" ${O}/>
          <path d="M-26 -14 L-12 10 M-8 -16 L6 10 M10 -16 L24 8" stroke="#4A1E10" stroke-width="3" stroke-linecap="round"/>
          <path d="M-30 -8 Q-10 -18 20 -14" fill="none" stroke="#A85A3E" stroke-width="3" stroke-linecap="round"/>
          ${[[-30, -2], [-18, -12], [-6, 2], [6, -12], [18, 0], [28, -8], [-22, 6], [12, 8], [-2, -18], [30, 4]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${i % 3 === 1 ? '#E06A90' : '#2E2826'}" stroke="${INK}" stroke-width="1"/>`).join('')}
          <path d="M38 -2 Q46 0 44 8 Q36 12 30 8" fill="#E07A7A" ${ow(2)}/>
        </g>
        ${T.herbs(48, 108)}`;
    } else if (art.style === 'bratwurst') {
      const sausage = (y, r) => `<g transform="translate(96 ${y}) rotate(${r})"><rect x="-44" y="-9" width="88" height="18" rx="9" fill="#C8763A" ${O}/>
        <path d="M-28 -8 L-20 8 M-6 -8 L2 8 M16 -8 L24 8" stroke="#6E3414" stroke-width="3" stroke-linecap="round"/><path d="M-36 -4 Q0 -8 36 -4" fill="none" stroke="#E8A066" stroke-width="2.4" stroke-linecap="round"/></g>`;
      food = `<g>${[...Array(14)].map((_, i) => `<path d="M${120 + (i * 7) % 40} ${126 + (i * 5) % 14} q8 -6 16 0" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M${120 + (i * 7) % 40} ${126 + (i * 5) % 14} q8 -6 16 0" fill="none" stroke="#F4E7A8" stroke-width="2" stroke-linecap="round"/>`).join('')}</g>
        ${sausage(108, -6)}${sausage(124, 4)}
        <path d="M58 104 q8 -6 16 0 t16 0 t16 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M58 104 q8 -6 16 0 t16 0 t16 0" fill="none" stroke="#F2C230" stroke-width="3.4" stroke-linecap="round"/>
        ${T.herbs(152, 112)}`;
    } else if (art.style === 'mole') {
      food = `<ellipse cx="146" cy="120" rx="26" ry="13" fill="#FFFDF5" ${ow(3)}/>
        <path d="M50 118 Q52 96 92 96 Q130 98 128 120 Q124 140 88 140 Q52 140 50 118 Z" fill="#3A1A10" ${O}/>
        <path d="M68 110 Q86 100 108 106" fill="none" stroke="#7A3A22" stroke-width="4" stroke-linecap="round"/>
        ${T.sesameSeeds(78, 116)}${T.sesameSeeds(104, 122)}${T.sesameSeeds(90, 106)}${T.herbs(148, 114)}`;
    } else if (art.style === 'jerk') {
      const leg = (x, y, r) => `<g ${at(x, y, r)}><path d="M-18 -10 Q0 -16 10 -4 Q14 6 2 10 Q-14 12 -18 -10 Z" fill="#5A2414" ${ow(2.6)}/>
        <rect x="8" y="-3" width="18" height="7" rx="3.5" fill="#FFF3DC" ${ow(2)}/><circle cx="27" cy="-2" r="4" fill="#FFF3DC" ${ow(1.8)}/><circle cx="27" cy="5" r="4" fill="#FFF3DC" ${ow(1.8)}/>
        <path d="M-12 -8 L-6 6 M-4 -10 L2 6" stroke="#1E0A04" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-6" cy="-6" rx="4" ry="2" fill="#A8502E"/></g>`;
      food = `<ellipse cx="136" cy="120" rx="34" ry="15" fill="#FFFDF5" ${ow(3)}/>
        ${[...Array(9)].map((_, i) => `<ellipse cx="${112 + (i * 13) % 48}" cy="${112 + (i * 7) % 16}" rx="2.8" ry="1.8" fill="#8A2A2A"/>`).join('')}
        ${leg(70, 112, -10)}${leg(84, 128, 12)}
        ${T.lime(150, 106, 10)}
        <g ${at(110, 136)}><path d="M-6 -4 Q0 -10 6 -4 Q8 4 0 6 Q-8 4 -6 -4 Z" fill="#FF8A1E" ${ow(2)}/><path d="M0 -8 L0 -12" stroke="#58A845" stroke-width="2.4" stroke-linecap="round"/></g>`;
    } else if (art.style === 'larb') {
      const lettuce = (x, y, r) => `<g ${at(x, y, r)}><path d="M-30 4 Q-34 -14 -14 -18 Q0 -26 14 -18 Q34 -14 30 4 Q16 14 0 12 Q-16 14 -30 4 Z" fill="#9BD06A" ${O}/>
        <path d="M-22 -2 Q-8 -12 0 -10 Q10 -12 22 -2" fill="none" stroke="#C9EC98" stroke-width="3" stroke-linecap="round"/><path d="M0 10 L0 -14" stroke="#7DB64C" stroke-width="2"/></g>`;
      const mince = (cx, cy) => [...Array(16)].map((_, i) => `<circle cx="${cx - 18 + (i * 13) % 36}" cy="${cy - 8 + (i * 7) % 14}" r="${3 + (i % 3)}" fill="${['#9A5A3A', '#B8734E', '#7E4428'][i % 3]}" ${ow(1.4)}/>`).join('');
      food = `${lettuce(76, 118, -8)}${lettuce(128, 122, 10)}
        ${mince(78, 112)}${mince(128, 116)}
        ${T.mint(66, 104)}${T.mint(136, 106)}${T.chilli(92, 116)}${T.flakes(114, 112)}${T.spring(144, 122)}
        ${T.lime(42, 128, -16)}`;
    } else if (art.style === 'bulgogi') {
      const strip = (x, y, r) => `<g ${at(x, y, r)}><path d="M-16 0 Q-8 -8 0 -2 Q8 4 16 -4 L18 2 Q8 10 0 4 Q-8 -2 -16 6 Z" fill="#6E3220" ${ow(2.2)}/><path d="M-10 0 Q-4 -4 2 0" fill="none" stroke="#A85A3E" stroke-width="1.8" stroke-linecap="round"/></g>`;
      food = `<ellipse cx="100" cy="118" rx="60" ry="20" fill="#5A2414" ${O}/>
        ${[[70, 112, -10], [96, 106, 15], [124, 112, -5], [84, 124, 20], [112, 126, -15], [140, 120, 10], [62, 124, 5]].map(([x, y, r]) => strip(x, y, r)).join('')}
        ${T.sesameSeeds(86, 110)}${T.sesameSeeds(118, 118)}${T.spring(100, 114)}${T.spring(136, 108)}
        <g ${at(160, 104, 20)}><path d="M-6 -14 Q4 -2 -2 14" fill="none" stroke="#F4F0D0" stroke-width="6" stroke-linecap="round"/></g>`;
    } else if (art.style === 'merguez') {
      const link = (y, r) => `<g transform="translate(86 ${y}) rotate(${r})"><path d="M-46 0 Q-24 -10 0 -4 Q24 2 46 -6" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M-46 0 Q-24 -10 0 -4 Q24 2 46 -6" fill="none" stroke="#9E2F1E" stroke-width="10" stroke-linecap="round"/>
        <path d="M-30 -8 L-26 2 M-6 -8 L-2 2 M20 -6 L24 2" stroke="#4A1208" stroke-width="2.6" stroke-linecap="round"/><path d="M-36 -5 Q-14 -11 10 -6" fill="none" stroke="#D2604A" stroke-width="2" stroke-linecap="round"/></g>`;
      food = `${link(106, -4)}${link(122, 6)}
        <ellipse cx="148" cy="122" rx="20" ry="11" fill="#C8241E" ${O}/>
        <path d="M136 120 Q148 112 160 120" fill="none" stroke="#F06A4A" stroke-width="3" stroke-linecap="round"/>
        ${[[142, 124], [152, 126], [148, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#5A0A06"/>`).join('')}
        ${T.mint(54, 132)}${T.lemon(150, 102, 20)}`;
    } else if (art.style === 'skewers') {
      // Xinjiang chuanr: lamb and fat alternating on bamboo, crusted with cumin and chilli.
      const skewer = (y, r) => `<g transform="translate(96 ${y}) rotate(${r})"><path d="M-66 0 L64 0" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-66 0 L64 0" stroke="#E8C48A" stroke-width="2.6" stroke-linecap="round"/>
        ${[-40, -22, -6, 10, 28].map((x, i) => i === 2
          ? `<path transform="translate(${x} 0) rotate(${i * 11})" d="M-6 -6 Q0 -8 6 -5 Q8 2 5 6 Q-2 8 -6 5 Q-8 0 -6 -6 Z" fill="#F2DCC0" ${ow(2)}/>`
          : `<path transform="translate(${x} 0) rotate(${i * 13})" d="M-9 -7 Q0 -10 9 -6 Q12 2 8 7 Q-2 9 -9 7 Q-12 0 -9 -7 Z" fill="#7A3418" ${ow(2.2)}/>`).join('')}
        ${[...Array(16)].map((_, i) => `<ellipse cx="${-46 + i * 5.6}" cy="${(i * 7) % 9 - 4}" rx="1.6" ry=".9" transform="rotate(${i * 40} ${-46 + i * 5.6} ${(i * 7) % 9 - 4})" fill="${i % 3 ? '#D9B26A' : '#D8342B'}"/>`).join('')}</g>`;
      food = `${skewer(100, -8)}${skewer(121, -1)}${skewer(142, 6)}
        ${T.spring(150, 108)}${T.flakes(56, 140)}`;
    } else if (art.style === 'toast') {
      const slice = (x, y, r) => `<g ${at(x, y, r)}>
        <path d="M-30 18 L-30 -10 Q-30 -26 -14 -26 Q-6 -34 4 -28 Q22 -30 26 -14 L28 18 Z" fill="#C88A3E" ${O}/>
        <path d="M-24 14 L-24 -8 Q-24 -20 -12 -20 Q-4 -26 4 -22 Q18 -24 20 -12 L22 14 Z" fill="#F2B83A"/>
        ${[[-14, -10, 4], [6, -14, 3], [10, 2, 5], [-8, 6, 3.4], [-16, 4, 2.4]].map(([cx, cy, r]) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.7}" fill="#B8641E" opacity=".85"/>`).join('')}
        <path d="M-20 -4 Q-8 -12 6 -10" fill="none" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/></g>`;
      food = `${slice(76, 114, -8)}${slice(126, 118, 8)}
        ${[[60, 104], [90, 112], [118, 108], [138, 122], [102, 126]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#2E2826"/>`).join('')}
        ${T.chives(100, 104)}`;
    } else if (art.style === 'noodles') {
      food = `<ellipse cx="100" cy="116" rx="58" ry="22" fill="${art.base}" ${O}/>
        <g fill="none" stroke="#F7C77A" stroke-width="4" stroke-linecap="round"><path d="M52 112 q12 -10 24 0 t24 0 t24 0 t20 0"/><path d="M58 122 q12 -10 24 0 t24 0 t24 0 t14 0"/></g>`;
    } else if (art.style === 'duck') {
      food = [0, 1, 2, 3, 4].map((i) => `<path d="M${50 + i * 20} 128 q10 -30 22 -6 l-4 10 z" fill="#B8552E" ${O} transform="rotate(${-8 + i * 4} ${60 + i * 20} 116)"/><path d="M${54 + i * 20} 118 q8 -12 14 -2" stroke="#E08A4E" stroke-width="3" fill="none"/>`).join('');
    }
    return `${steam()}
      <ellipse cx="100" cy="150" rx="90" ry="14" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="124" rx="92" ry="34" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="124" rx="74" ry="25" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${food}${tops}`;
  }

  function tacos() {
    // Three small open corn tortillas piled with red al pastor pork, pineapple, onion and coriander.
    const taco = (x, y, r) => `<g ${at(x, y, r, 1.12)}>
      <ellipse rx="30" ry="15" fill="#F2D48A" ${O}/>
      ${[[-20, -4], [18, -6], [-10, 8], [22, 4]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="2.2" fill="#C8963E"/>`).join('')}
      ${[[-12, -3, 0], [-2, -6, 30], [8, -3, -20], [-6, 4, 60], [6, 5, 10], [14, 1, 40]].map(([cx, cy, rr]) => `<path transform="translate(${cx} ${cy}) rotate(${rr})" d="M-6 -4 Q0 -7 6 -3 Q7 3 2 5 Q-5 6 -6 -4 Z" fill="${rr % 20 ? '#C8461E' : '#E0662C'}" ${ow(1.8)}/>`).join('')}
      ${[[-4, -1], [10, -6], [-14, 3]].map(([cx, cy]) => `<rect x="${cx - 3}" y="${cy - 3}" width="6" height="6" rx="1.4" fill="#FFD23F" ${ow(1.4)}/>`).join('')}
      ${[[0, 2], [4, -8], [-10, -6], [14, 6], [-16, -1]].map(([cx, cy]) => `<rect x="${cx - 1.6}" y="${cy - 1.6}" width="3.2" height="3.2" rx="0.6" fill="#FFFFFF" stroke="${INK}" stroke-width="0.7"/>`).join('')}
      ${[[-8, -8, 20], [6, 0, -30], [16, -4, 60], [-2, 6, 0]].map(([cx, cy, rr]) => `<path transform="translate(${cx} ${cy}) rotate(${rr})" d="M0 0 C-3 -1 -3.6 -4.6 -1 -5.4 C0 -7 2.4 -6.6 2.6 -5 C4.6 -4 4 -1 1.6 0 Z" fill="#5DB044" stroke="${INK}" stroke-width="1"/>`).join('')}
      <path d="M-30 0 Q-28 16 0 16 Q28 16 30 0 Q24 10 0 10 Q-24 10 -30 0 Z" fill="#E8C070" ${ow(2.6)}/></g>`;
    return `${shadow(162, 88, 12)}
      <ellipse cx="100" cy="134" rx="92" ry="30" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="134" rx="76" ry="22" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${taco(100, 112, 0)}${taco(62, 132, -8)}${taco(138, 132, 8)}
      ${T.lime(36, 146, -20)}${T.lime(166, 148, 20)}`;
  }

  function tagine() {
    return `${steam()}
      <ellipse cx="100" cy="170" rx="80" ry="9" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="146" rx="80" ry="20" fill="#2E7D8C" ${O}/>
      <ellipse cx="100" cy="140" rx="64" ry="12" fill="#C8752E"/>
      ${T.chicken(80, 138)}<circle cx="116" cy="138" r="6" fill="#F2A541" ${o2}/>${T.herbs(100, 134)}
      <g class="tagine-lid" transform="translate(18 -22) rotate(12 100 124)">
        <path d="M30 126 Q66 108 90 40 Q100 24 110 40 Q134 108 170 126 Z" fill="#D9603B" ${O}/>
        <path d="M46 116 Q100 100 154 116" fill="none" stroke="#FFC93C" stroke-width="5"/>
        <path d="M68 86 Q100 78 132 86" fill="none" stroke="#FFF1D6" stroke-width="4"/>
        <circle cx="100" cy="32" r="9" fill="#D9603B" ${O}/></g>`;
  }

  function banhmi() {
    return `<ellipse cx="100" cy="162" rx="88" ry="10" fill="${INK}" opacity=".15"/>
      <path d="M18 120 Q16 90 50 86 L156 82 Q186 82 184 112 Z" fill="#E3A55A" ${O}/>
      <path d="M22 116 L182 110" stroke="#B45A4E" stroke-width="10" stroke-linecap="round"/>
      <path d="M26 110 l12 -8 12 8 12 -8 12 8 12 -8 12 8 12 -8 12 8 12 -8 12 8 12 -8 12 8" fill="none" stroke="#7CC45A" stroke-width="5" stroke-linecap="round"/>
      <path d="M30 112 L170 104" stroke="#FF9A3C" stroke-width="5" stroke-dasharray="14 8" stroke-linecap="round"/>
      ${T.chilli(120, 100)}
      <path d="M16 122 Q20 150 60 150 L150 148 Q186 148 186 114 Z" fill="#F0BC70" ${O}/>
      <path d="M50 134 l14 -6 M86 136 l14 -6 M122 134 l14 -6" stroke="#C07B32" stroke-width="4" stroke-linecap="round"/>`;
  }

  function hotpot() {
    return `${steam()}
      <ellipse cx="100" cy="174" rx="76" ry="9" fill="${INK}" opacity=".15"/>
      <path d="M26 108 Q28 166 100 166 Q172 166 174 108 Z" fill="#B8BEC6" ${O}/>
      <rect x="6" y="108" width="24" height="10" rx="5" fill="#B8BEC6" ${O}/><rect x="170" y="108" width="24" height="10" rx="5" fill="#B8BEC6" ${O}/>
      <ellipse cx="100" cy="106" rx="76" ry="24" fill="#D7DCE2" ${O}/>
      <path d="M100 84 A66 20 0 0 0 100 126 C80 116 120 96 100 84 Z" fill="#F4E8D0"/>
      <path d="M100 84 A66 20 0 0 1 100 126 C80 116 120 96 100 84 Z" fill="#D8342B"/>
      <ellipse cx="100" cy="105" rx="66" ry="20" fill="none" ${o2}/>
      ${T.chilli(140, 102)}${T.staranise(124, 112)}${T.spring(62, 100)}${T.beef(70, 112)}`;
  }

  function bibimbap() {
    const seg = (a, c) => {
      const r = 58, ry = 16, rad = (d) => d * Math.PI / 180;
      const x1 = 100 + r * Math.cos(rad(a)), y1 = 104 + ry * Math.sin(rad(a));
      const x2 = 100 + r * Math.cos(rad(a + 60)), y2 = 104 + ry * Math.sin(rad(a + 60));
      return `<path d="M100 104 L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${ry} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${c}" ${ow(2)}/>`;
    };
    const colours = ['#7CC45A', '#FF9A3C', '#B45A4E', '#F6E7A8', '#D8342B', '#6B3F7A'];
    return `${steam()}
      <ellipse cx="100" cy="176" rx="62" ry="8" fill="${INK}" opacity=".15"/>
      <path d="M22 100 Q24 170 100 170 Q176 170 178 100 Z" fill="#4E4A48" ${O}/>
      <path d="M40 134 Q100 150 160 134" fill="none" stroke="#6E6966" stroke-width="5"/>
      <ellipse cx="100" cy="100" rx="78" ry="24" fill="#5E5956" ${O}/>
      <ellipse cx="100" cy="104" rx="66" ry="18" fill="#FFFBF0"/>
      ${colours.map((c, i) => seg(i * 60, c)).join('')}
      ${T.egg(100, 102)}`;
  }

  function pan() {
    return `${steam()}
      <ellipse cx="96" cy="168" rx="72" ry="9" fill="${INK}" opacity=".15"/>
      <rect x="150" y="112" width="48" height="14" rx="7" fill="#3E3633" ${O} transform="rotate(-8 150 118)"/>
      <ellipse cx="90" cy="128" rx="78" ry="32" fill="#3E3633" ${O}/>
      <ellipse cx="90" cy="124" rx="66" ry="24" fill="#D24A2E"/>
      ${T.egg(64, 120)}${T.egg(112, 130)}${T.egg(108, 108)}${T.herbs(78, 138)}${T.herbs(136, 116)}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${44 + i * 19}" cy="${112 + (i % 3) * 9}" r="1.8" fill="${INK}"/>`).join('')}`;
  }

  function wrap() {
    return `<ellipse cx="100" cy="176" rx="40" ry="6" fill="${INK}" opacity=".15"/>
      <g transform="rotate(-10 100 110)">
        <path d="M66 70 L134 70 L106 174 L94 174 Z" fill="#E8C084" ${O}/>
        ${T.chicken(88, 66)}${T.chicken(112, 64)}
        <path d="M70 64 Q80 50 92 58 Q100 46 110 56 Q122 48 130 64" fill="#7CC45A" ${ow(2.4)}/>
        <circle cx="84" cy="58" r="7" fill="#E2362E" ${ow(2.2)}/><circle cx="84" cy="58" r="3.6" fill="#FF8A7A"/>
        <rect x="112" y="52" width="14" height="8" rx="3" fill="#A6C24A" ${ow(2)}/>
        <path d="M96 52 q4 -6 10 -2" fill="none" stroke="#C0457A" stroke-width="3" stroke-linecap="round"/>
        ${[[100, 50], [118, 46], [90, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#8E2A4A"/>`).join('')}
        <path d="M74 72 Q86 80 100 74 Q114 80 128 72" fill="none" stroke="#FFFDF5" stroke-width="5" stroke-linecap="round"/>
        <path d="M70 100 L130 100 L112 174 L88 174 Z" fill="#FFFFFF" ${O}/>
        <path d="M76 116 L124 116" stroke="#C8285E" stroke-width="6"/><path d="M80 132 L120 132" stroke="#C8285E" stroke-width="6"/>
      </g>`;
  }

  function injera() {
    const holes = [...Array(40)].map((_, i) => `<circle cx="${(30 + (i * 47) % 140)}" cy="${(106 + (i * 23) % 44)}" r="1.4" fill="#A8977E"/>`).join('');
    return `${steam()}
      <ellipse cx="100" cy="160" rx="92" ry="14" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="128" rx="92" ry="34" fill="#D9C8AA" ${O}/>
      ${holes}
      <path d="M44 118 Q46 96 80 96 Q118 96 120 118 Q118 140 80 140 Q44 140 44 118 Z" fill="#7A2414" ${O}/>
      <path d="M58 108 Q76 100 98 104" fill="none" stroke="#B8462A" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="86" cy="116" rx="14" ry="10" fill="#FFFDF5" ${ow(2.6)}/><path d="M78 116 Q86 112 94 116" fill="none" stroke="#EEE2CC" stroke-width="2"/>
      ${T.chicken(66, 124)}
      <g transform="translate(150 118) rotate(-8)"><rect x="-22" y="-10" width="44" height="20" rx="10" fill="#CDBB9C" ${O}/><path d="M-12 -10 L-12 10 M0 -10 L0 10 M12 -10 L12 10" stroke="#A8977E" stroke-width="2"/></g>`;
  }

  function lasagne(a = {}) {
    const stripes = a.stripes || ['#F4D58A', '#C8361E', '#FFF6E6', '#F4D58A', '#C8361E', '#FFF6E6'];
    const top = a.top || '#E2A23C', spots = a.spots || '#B8641E', side = a.side || '#D9A050';
    return `${steam()}
      <ellipse cx="100" cy="164" rx="88" ry="13" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="148" rx="90" ry="22" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="148" rx="72" ry="15" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      <path d="M56 92 L134 86 L152 102 L72 110 Z" fill="${top}" ${O}/>
      ${[[80, 98], [104, 94], [126, 96], [94, 102], [116, 100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" fill="${spots}"/>`).join('')}
      <path d="M72 110 L152 102 L152 146 L72 154 Z" fill="${stripes[0]}" ${O}/>
      ${stripes.slice(1).map((c, i) => `<path d="M72 ${117 + i * 7} L152 ${109 + i * 7}" stroke="${c}" stroke-width="6"/>`).join('')}
      <path d="M72 110 L152 102 L152 146 L72 154 Z" fill="none" ${O}/>
      <path d="M56 92 L72 110 L72 154 L56 138 Z" fill="${side}" ${O}/>
      <path d="M62 112 L62 130" stroke="${spots}" stroke-width="3" stroke-linecap="round"/>
      ${(T[a.garnish] || T.basil)(112, 92)}`;
  }

  function paella() {
    return `${steam()}
      <ellipse cx="100" cy="164" rx="92" ry="12" fill="${INK}" opacity=".15"/>
      <rect x="2" y="114" width="26" height="10" rx="5" fill="#3E3633" ${O}/><rect x="172" y="114" width="26" height="10" rx="5" fill="#3E3633" ${O}/>
      <ellipse cx="100" cy="124" rx="80" ry="32" fill="#3E3633" ${O}/>
      <ellipse cx="100" cy="120" rx="70" ry="25" fill="#F2B22E"/>
      ${[...Array(24)].map((_, i) => `<ellipse cx="${40 + (i * 37) % 120}" cy="${104 + (i * 11) % 32}" rx="3.2" ry="1.6" fill="#FFD866"/>`).join('')}
      ${prawn(70, 112, -20, 0.8)}${prawn(128, 108, 25, 0.8)}
      ${T.mussel(98, 104, 10)}${T.mussel(110, 132, -15)}${T.mussel(56, 128, 30)}
      ${T.pepperStrip(84, 128, -15)}${T.pepperStrip(142, 124, 20)}${T.peas(92, 118)}${T.peas(140, 106)}
      ${T.lemon(154, 120, 30)}${T.lemon(46, 112, -30)}`;
  }

  function roast() {
    // A whole golden bird seen side-on, legs up at the front, on a platter
    // with roast potatoes, lemon and lavender.
    const sprig = (x, y, r) => `<g ${at(x, y, r)}><path d="M0 0 L0 -24" stroke="#5E8A3E" stroke-width="2.4" stroke-linecap="round"/>${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${i % 2 ? 2.4 : -2.4}" cy="${-8 - i * 4}" rx="2.4" ry="3.2" fill="#9C82C9" stroke="${INK}" stroke-width="1.1"/>`).join('')}</g>`;
    const potato = (x, y, r) => `<g ${at(x, y, r)}><path d="M-9 -6 Q2 -10 10 -4 Q12 4 6 8 Q-4 10 -10 5 Q-12 -1 -9 -6 Z" fill="#E8A83A" ${ow(2.2)}/><path d="M-5 -4 Q1 -6 6 -3" fill="none" stroke="#F8D27A" stroke-width="2" stroke-linecap="round"/><circle cx="2" cy="3" r="1.2" fill="#B8641E"/></g>`;
    const leg = (dx, dy, back) => `<g transform="translate(${dx} ${dy})">
      <path d="M-6 16 Q-20 6 -10 -8 Q-2 -18 10 -14 L24 -32 L30 -26 L18 -8 Q20 8 6 16 Q0 18 -6 16 Z" fill="${back ? '#B8621A' : '#C8691E'}" ${O}/>
      <path d="M22 -30 L30 -40" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M22 -30 L30 -40" stroke="#FFF3DC" stroke-width="5" stroke-linecap="round"/>
      <circle cx="28" cy="-44" r="4.4" fill="#FFF3DC" ${ow(2)}/><circle cx="34" cy="-40" r="4.4" fill="#FFF3DC" ${ow(2)}/>
      ${back ? '' : '<ellipse cx="-2" cy="0" rx="5" ry="3.4" fill="#E8913A"/>'}</g>`;
    return `${steam()}
      ${shadow(164, 90, 13)}
      <ellipse cx="100" cy="144" rx="94" ry="26" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="144" rx="76" ry="18" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${leg(144, 96, true)}
      <path d="M40 138 Q30 96 80 86 Q122 80 146 108 Q154 130 134 142 Q90 154 40 138 Z" fill="#D9822A" ${O}/>
      <path d="M52 118 Q62 94 96 90 Q118 90 132 102" fill="none" stroke="#F6C070" stroke-width="7" stroke-linecap="round" opacity=".9"/>
      <path d="M58 132 Q90 140 128 130" fill="none" stroke="#B8621A" stroke-width="3" stroke-linecap="round"/>
      <path d="M62 124 Q74 110 96 114 Q90 128 70 132 Q62 132 62 124 Z" fill="#C8691E" ${ow(2.6)}/>
      ${[[86, 102], [104, 98], [74, 108], [116, 112], [96, 122], [124, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#6E3A12"/>`).join('')}
      ${leg(118, 116, false)}
      ${potato(30, 146, -10)}${potato(48, 156, 20)}${potato(168, 146, 30)}${potato(150, 158, -15)}
      ${T.lemon(176, 132, 20)}
      ${sprig(34, 136, -30)}${sprig(156, 140, 20)}${sprig(68, 158, -10)}`;
  }

  function buns() {
    const bun = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-26 6 Q-28 -18 0 -20 Q28 -18 26 6 Q22 18 0 18 Q-22 18 -26 6 Z" fill="#D9963E" ${O}/>
      <path d="M0 -2 m-16 0 a16 12 0 1 1 32 0 a12 9 0 1 1 -24 0 a8 6 0 1 1 16 0 a4 3 0 1 1 -8 0" fill="none" stroke="#8A4A1A" stroke-width="3.2" stroke-linecap="round"/>
      ${[[-12, -10], [6, -13], [14, -4], [-4, 6], [-16, 0], [10, 8]].map(([cx, cy]) => `<rect x="${cx}" y="${cy}" width="3.4" height="3" rx="1" fill="#FFFFFF" stroke="${INK}" stroke-width="0.8"/>`).join('')}</g>`;
    return `<ellipse cx="100" cy="162" rx="88" ry="12" fill="${INK}" opacity=".15"/>
      <rect x="14" y="132" width="172" height="22" rx="10" fill="#C98A4E" ${O}/>
      <path d="M28 142 L172 142" stroke="#A86A34" stroke-width="2"/>
      ${bun(60, 122, 0.95)}${bun(142, 122, 0.95)}${bun(100, 108, 1.05)}`;
  }

  function churros() {
    const stick = (x, r) => `<g transform="translate(${x} 92) rotate(${r})"><rect x="-8" y="-52" width="16" height="96" rx="8" fill="#D9963E" ${O}/>
      <path d="M-3 -46 L-3 40 M3 -46 L3 40" stroke="#B8722A" stroke-width="2"/>
      ${[[-5, -36], [4, -20], [-4, -6], [5, 8], [-5, 22]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.4" fill="#FFF6E6"/>`).join('')}</g>`;
    return `<ellipse cx="100" cy="174" rx="80" ry="8" fill="${INK}" opacity=".15"/>
      ${stick(58, -14)}${stick(76, -4)}${stick(94, 8)}
      <path d="M40 104 L112 104 L102 170 L50 170 Z" fill="#FFFFFF" ${O}/>
      <path d="M46 124 L106 124 M48 142 L104 142" stroke="#C8285E" stroke-width="6"/>
      <path d="M126 130 Q126 170 152 170 Q178 170 178 130 Z" fill="#FFFFFF" ${O}/>
      <ellipse cx="152" cy="130" rx="26" ry="8" fill="#FFFFFF" ${O}/>
      <ellipse cx="152" cy="131" rx="21" ry="5.5" fill="#4A2214"/>
      <path d="M144 129 Q152 126 160 130" fill="none" stroke="#7A3A22" stroke-width="2" stroke-linecap="round"/>
      <path d="M178 138 Q192 140 190 152 Q188 162 176 158" fill="none" ${O}/>
      ${T.chilli(150, 116)}`;
  }

  function pie() {
    // A wedge pointing at the viewer: orange filling on top, fluted crust along the back.
    const flutes = [...Array(7)].map((_, i) => { const t = i / 6, x = 96 + t * 70, y = 88 + Math.sin(t * Math.PI) * -10 + t * 22; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#D9A050" ${ow(2.6)}/>`; }).join('');
    return `<ellipse cx="100" cy="164" rx="88" ry="13" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="146" rx="90" ry="22" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="146" rx="72" ry="15" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      <path d="M40 140 L166 110 L166 128 L40 156 Z" fill="#E68A2E" ${O}/>
      <path d="M40 150 L166 122 L166 128 L40 156 Z" fill="#D9A050"/>
      <path d="M40 140 L96 88 Q130 80 166 110 Z" fill="#F29A36" ${O}/>
      <path d="M58 128 L100 96" stroke="#F8B866" stroke-width="3" stroke-linecap="round"/>
      ${flutes}
      <path d="M92 108 Q88 94 102 92 Q106 80 118 88 Q130 86 128 100 Q128 110 110 112 Q96 114 92 108 Z" fill="#FFFDF5" ${O}/>
      <path d="M104 98 Q112 94 118 100" fill="none" stroke="#EEE2CC" stroke-width="2.4" stroke-linecap="round"/>
      ${[[102, 90], [112, 86], [120, 96], [106, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#A85A2A"/>`).join('')}`;
  }

  function pizza() {
    // Whole pie on a board with one slice pulled out towards the viewer.
    const R = 62, cx = 96, cy = 112, ry = 0.42;
    const pt = (deg, r = R) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * ry * Math.sin(deg * Math.PI / 180)];
    const f = (p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    const [a1, a2] = [40, 85];
    const salami = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="#B8302A" ${ow(2)}/><circle cx="${x - 2.5}" cy="${y - 1}" r="1.1" fill="#F4C4B8"/><circle cx="${x + 2.5}" cy="${y + 1}" r="1.1" fill="#F4C4B8"/><circle cx="${x}" cy="${y - 2}" r="0.9" fill="#F4C4B8"/>`;
    const cheese = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#FFF6D8"/>`;
    const tops = [[70, 100], [112, 96], [86, 120], [128, 110], [62, 116], [100, 106]];
    const slice = `<g transform="translate(14 22)">
      <path d="M${cx} ${cy} L${f(pt(a1))} A${R} ${R * ry} 0 0 1 ${f(pt(a2))} Z" fill="#E0A04E" ${O}/>
      <path d="M${cx} ${cy} L${f(pt(a1, R - 7))} A${R - 7} ${(R - 7) * ry} 0 0 1 ${f(pt(a2, R - 7))} Z" fill="#D8402E"/>
      ${cheese(112, 128)}${salami(116, 130)}${T.flakes(104, 122)}</g>`;
    return `${steam()}
      <ellipse cx="100" cy="166" rx="88" ry="12" fill="${INK}" opacity=".15"/>
      <rect x="150" y="104" width="44" height="14" rx="7" fill="#B8783A" ${O}/>
      <ellipse cx="96" cy="124" rx="84" ry="38" fill="#C98A4E" ${O}/>
      <path d="M${cx} ${cy} L${f(pt(a2))} A${R} ${R * ry} 0 1 1 ${f(pt(a1))} Z" fill="#E0A04E" ${O}/>
      <path d="M${cx} ${cy} L${f(pt(a2, R - 7))} A${R - 7} ${(R - 7) * ry} 0 1 1 ${f(pt(a1, R - 7))} Z" fill="#D8402E"/>
      ${tops.map(([x, y], i) => i % 2 ? cheese(x, y) : '').join('')}
      ${tops.map(([x, y], i) => i % 2 ? '' : salami(x, y)).join('')}${salami(122, 98)}${salami(80, 92)}
      ${T.flakes(92, 98)}${T.flakes(60, 104)}${T.basil(108, 116)}
      ${slice}`;
  }

  function flatbread() {
    // One lahmacun flat, one rolled up around parsley the way it's eaten.
    const roll = `<g transform="translate(150 100) rotate(-28)">
      <path d="M-8 -26 Q-14 -40 -2 -42 Q2 -50 10 -42 Q20 -44 16 -30" fill="#5DB044" ${ow(2.2)}/>
      <rect x="-14" y="-28" width="28" height="70" rx="12" fill="#E8B866" ${O}/>
      <path d="M-14 -10 Q0 -4 14 -12 M-14 12 Q0 18 14 10" fill="none" stroke="#C88A3E" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M8 -26 Q12 6 8 40" fill="none" stroke="#B8402A" stroke-width="3" stroke-linecap="round"/></g>`;
    return `<ellipse cx="100" cy="166" rx="88" ry="12" fill="${INK}" opacity=".15"/>
      <rect x="10" y="114" width="180" height="40" rx="18" fill="#C98A4E" ${O}/>
      <path d="M22 132 L178 132" stroke="#A86A34" stroke-width="2"/>
      <path d="M14 128 Q16 102 74 100 Q132 102 134 128 Q132 152 74 154 Q16 152 14 128 Z" fill="#E8B866" ${O}/>
      <path d="M22 127 Q24 108 74 106 Q124 108 126 127 Q124 146 74 148 Q24 146 22 127 Z" fill="#B8402A"/>
      ${[...Array(24)].map((_, i) => `<circle cx="${28 + (i * 37) % 94}" cy="${110 + (i * 17) % 36}" r="${1.5 + (i % 3) * 0.7}" fill="${['#7A2216', '#D8603E', '#5A1A10'][i % 3]}"/>`).join('')}
      ${T.herbs(52, 116)}${T.redOnion(84, 132)}${T.sumac(100, 118)}
      ${roll}
      ${T.lemon(176, 140, 25)}${T.tomato(40, 142)}`;
  }

  function ramekin() {
    const crack = 'M80 100 L92 108 L88 116 M92 108 L104 104 L112 112 M104 104 L108 96';
    return `<ellipse cx="100" cy="170" rx="80" ry="9" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="156" rx="84" ry="14" fill="#FFFFFF" ${O}/>
      <path d="M36 104 L40 148 Q100 162 160 148 L164 104 Z" fill="#FFFFFF" ${O}/>
      ${[48, 64, 80, 96, 112, 128, 144].map((x) => `<path d="M${x + 4} 108 L${x + 4} 150" stroke="#E4E8EC" stroke-width="3"/>`).join('')}
      <ellipse cx="100" cy="104" rx="64" ry="18" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="105" rx="56" ry="13" fill="#D9862A"/>
      <ellipse cx="94" cy="102" rx="36" ry="7" fill="#F0A84A"/>
      ${[[70, 108], [124, 100], [132, 110], [80, 98]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" fill="#A85A1E" opacity=".75"/>`).join('')}
      <path d="${crack}" fill="none" stroke="#7A3A12" stroke-width="2.2" stroke-linecap="round"/>
      <g transform="translate(150 70) rotate(35)"><rect x="-5" y="-36" width="10" height="44" rx="5" fill="#C8CED6" ${O}/><ellipse cx="0" cy="12" rx="11" ry="14" fill="#C8CED6" ${O}/></g>
      <g ${at(62, 88, -20)}>${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${i % 2 ? 2.5 : -2.5}" cy="${-i * 4}" rx="2.6" ry="3.4" fill="#9C82C9" stroke="${INK}" stroke-width="1.2"/>`).join('')}<path d="M0 6 L0 -20" stroke="#5E8A3E" stroke-width="2" stroke-linecap="round"/></g>`;
  }

  function empanadas() {
    const pie = (x, y, r) => {
      const crimps = [...Array(9)].map((_, i) => { const a = Math.PI + (i / 8) * Math.PI, px = 34 * Math.cos(a), py = 24 * Math.sin(a) + 8; return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.4" fill="#D9963E" ${ow(2)}/>`; }).join('');
      return `<g ${at(x, y, r)}>${crimps}<path d="M-32 8 A32 26 0 0 1 32 8 Z" fill="#E8B05A" ${O}/>
        <path d="M-20 -2 Q0 -14 20 -2" fill="none" stroke="#F6D08A" stroke-width="3.6" stroke-linecap="round"/>
        ${[[-8, -6], [6, -10], [14, 0]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.3" fill="#B8722A"/>`).join('')}</g>`;
    };
    return `${steam()}
      <ellipse cx="100" cy="164" rx="88" ry="12" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="142" rx="90" ry="24" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="142" rx="72" ry="16" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${pie(66, 128, -10)}${pie(134, 128, 10)}${pie(100, 112, 0)}
      <g ${at(166, 116)}><ellipse rx="14" ry="8" fill="#FFFFFF" ${O}/><ellipse rx="10" ry="5" fill="#4E8F3A"/>${T.flakes(-6, -2)}</g>`;
  }

  /* ---------- Shared bits for the redrawn dishes ---------- */
  // Clip a straight line to an ellipse so patterns stay on the food surface.
  function clipToEllipse(x1, y1, x2, y2, cx, cy, rx, ry) {
    const dx = x2 - x1, dy = y2 - y1, ex = (x1 - cx) / rx, ey = (y1 - cy) / ry, fx = dx / rx, fy = dy / ry;
    const A = fx * fx + fy * fy, B = 2 * (ex * fx + ey * fy), C = ex * ex + ey * ey - 1, D = B * B - 4 * A * C;
    if (D <= 0) return '';
    const t0 = Math.max(0, (-B - Math.sqrt(D)) / (2 * A)), t1 = Math.min(1, (-B + Math.sqrt(D)) / (2 * A));
    if (t1 <= t0) return '';
    return `M${(x1 + dx * t0).toFixed(1)} ${(y1 + dy * t0).toFixed(1)} L${(x1 + dx * t1).toFixed(1)} ${(y1 + dy * t1).toFixed(1)}`;
  }
  const shadow = (cy, rx, ry = 12) => `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${INK}" opacity=".15"/>`;
  // A wide, deep coupe plate: rim plus a sunken well.
  const coupe = (cy = 128, rx = 90, ry = 32) => `${shadow(cy + ry - 4, rx - 4)}
    <ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF" ${O}/>
    <ellipse cx="100" cy="${cy + 2}" rx="${rx - 18}" ry="${ry - 9}" fill="#EEF3F6"/>
    <path d="M${100 - rx + 18} ${cy + 2} A${rx - 18} ${ry - 9} 0 0 1 ${100 + rx - 18} ${cy + 2}" fill="none" stroke="#D4DEE6" stroke-width="3"/>`;
  const sweetPotato = (x, y, r = 0) => `<g ${at(x, y, r)}><ellipse rx="14" ry="9" fill="#E0782A" ${ow(2.4)}/><ellipse rx="10" ry="6" fill="#F59A3E"/><ellipse cx="-3" cy="-2" rx="4" ry="1.8" fill="#FFC27A"/></g>`;
  const choclo = (x, y, r = 0) => `<g ${at(x, y, r)}><rect x="-15" y="-9" width="30" height="18" rx="8" fill="#F4E3A0" ${ow(2.4)}/>
    ${[-9, -3, 3, 9].map((cx) => [-4, 3].map((cy) => `<ellipse cx="${cx}" cy="${cy}" rx="2.6" ry="2.8" fill="#FFF6CC" stroke="#D9C070" stroke-width="1"/>`).join('')).join('')}</g>`;
  const cancha = (x, y) => `<g ${at(x, y)}>${[[0, 0, 10], [8, 3, -30], [-7, 4, 50], [4, -5, 80], [12, -2, 20]].map(([cx, cy, r]) => `<ellipse cx="${cx}" cy="${cy}" rx="3.4" ry="2.4" transform="rotate(${r} ${cx} ${cy})" fill="#C8862E" ${ow(1.2)}/>`).join('')}</g>`;

  function ceviche() {
    // Peruvian style: a deep plate, fish in leche de tigre, red onion on top,
    // sweet potato and choclo on the side, toasted cancha scattered.
    const cubes = [[78, 118], [92, 112], [106, 116], [120, 112], [86, 126], [100, 124], [114, 126], [96, 104], [110, 104]];
    return `${coupe()}
      <ellipse cx="100" cy="128" rx="58" ry="18" fill="#F6F1E2" opacity=".95"/>
      ${cubes.map(([x, y], i) => `<g ${at(x, y, (i * 23) % 40 - 20)}><rect x="-7.5" y="-6" width="15" height="12" rx="3.4" fill="#FCF6EE" ${ow(2.2)}/><path d="M-4 -3 Q0 0 -4 3 M1 -3 Q5 0 1 3" fill="none" stroke="#F0CDB8" stroke-width="1.4" stroke-linecap="round"/></g>`).join('')}
      ${T.redOnion(92, 102)}${T.redOnion(116, 108)}
      ${T.chilli(78, 106)}${T.herbs(124, 100)}
      ${sweetPotato(44, 126, -10)}${sweetPotato(52, 140, 8)}
      ${choclo(156, 132, -12)}
      ${cancha(138, 146)}${cancha(62, 112)}
      ${T.lime(160, 112, 15)}`;
  }

  function fattoush() {
    // A heaped salad on a flat platter, crowned with pita crisps and a dusting of sumac.
    const leaf = (x, y, r, c) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M-20 4 Q-22 -10 -6 -12 Q4 -18 14 -10 Q24 -4 18 6 Q4 12 -20 4 Z" fill="${c}" ${ow(2.2)}/>`;
    const radish = (x, y) => `<g ${at(x, y)}><circle r="7" fill="#D23A6A" ${ow(2)}/><circle r="4.6" fill="#FFF4F6"/></g>`;
    const halfCuc = (x, y, r) => `<g ${at(x, y, r)}><path d="M-9 0 A9 9 0 0 1 9 0 Z" fill="#4E8F3A" ${ow(2)}/><path d="M-7 0 A7 7 0 0 1 7 0 Z" fill="#DDF0B8"/><circle cx="-2.5" cy="-2.5" r="1" fill="#A8CF7A"/><circle cx="2.5" cy="-2.5" r="1" fill="#A8CF7A"/></g>`;
    const wedge = (x, y, r) => `<g ${at(x, y, r)}><path d="M-10 4 Q-10 -8 0 -9 Q10 -8 10 4 Z" fill="#E2362E" ${ow(2)}/><path d="M-6 2 Q-6 -5 0 -6 Q6 -5 6 2 Z" fill="#FF8A6E"/><circle cx="-2" cy="-1" r="1.2" fill="#FFE27A"/><circle cx="2" cy="-2" r="1.2" fill="#FFE27A"/></g>`;
    const chip = (x, y, r) => `<g ${at(x, y, r)}><path d="M-10 6 L0 -10 L10 6 Z" fill="#E8B35E" ${ow(2.2)}/><path d="M-5 3 L0 -5" stroke="#F8D59A" stroke-width="2" stroke-linecap="round"/><circle cx="2" cy="2" r="1.2" fill="#B8722A"/></g>`;
    return `${shadow(160, 90, 13)}
      <ellipse cx="100" cy="134" rx="94" ry="28" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="134" rx="78" ry="20" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${leaf(62, 128, -15, '#7DBF4C')}${leaf(138, 128, 15, '#7DBF4C')}${leaf(100, 132, 0, '#94D05E')}${leaf(80, 116, -30, '#94D05E')}${leaf(122, 116, 30, '#7DBF4C')}
      ${wedge(72, 122, -15)}${wedge(126, 126, 20)}${halfCuc(102, 124, 0)}${halfCuc(140, 118, 25)}${radish(88, 128)}${radish(116, 112)}
      ${T.mint(60, 112)}${T.mint(148, 132)}
      ${chip(96, 104, -10)}${chip(110, 98, 25)}${chip(82, 108, 40)}${chip(132, 106, -30)}
      ${T.sumac(92, 116)}${T.sumac(118, 120)}${T.sumac(68, 132)}
      ${T.lemon(40, 140, -20)}`;
  }

  function koshari() {
    // Packed in a bowl, turned out onto a plate as a dome, then crowned with
    // tomato sauce and a big pile of crispy onions. Chickpeas tumble round the base.
    const grains = [...Array(30)].map((_, i) => { const x = 58 + (i * 37) % 84, y = 104 + (i * 13) % 34; return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" transform="rotate(${(i * 41) % 180} ${x} ${y})" fill="${['#FFF6DE', '#7A4A26', '#FFF6DE', '#9A6A3A'][i % 4]}"/>`; }).join('');
    const mac = (x, y, r) => `<g ${at(x, y, r)}><path d="M-5 2 Q0 -6 5 2" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-5 2 Q0 -6 5 2" fill="none" stroke="#F6D27A" stroke-width="3.6" stroke-linecap="round"/></g>`;
    return `${steam()}
      ${shadow(160, 88, 13)}
      <ellipse cx="100" cy="138" rx="90" ry="24" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="138" rx="72" ry="16" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      <path d="M50 140 Q48 100 100 94 Q152 100 150 140 Q100 152 50 140 Z" fill="#C8A274" ${O}/>
      ${grains}
      ${mac(64, 132, 20)}${mac(138, 132, -30)}${mac(80, 140, -10)}${mac(122, 140, 40)}${mac(144, 120, 10)}${mac(58, 118, -40)}
      <path d="M66 110 Q70 92 100 90 Q130 92 134 110 Q120 104 100 106 Q80 104 66 110 Z" fill="#C8341E" ${O}/>
      <path d="M76 102 Q90 94 104 96" fill="none" stroke="#F06A4A" stroke-width="3" stroke-linecap="round"/>
      ${T.friedOnion(86, 90)}${T.friedOnion(100, 84)}${T.friedOnion(110, 92)}${T.friedOnion(92, 96)}
      ${T.chickpeas(44, 146)}${T.chickpeas(156, 146)}${T.herbs(126, 88)}`;
  }

  function suya() {
    // Off the skewer, cut up, dusted with yaji and wrapped in paper with raw onion and tomato.
    const meat = (x, y, r) => `<g ${at(x, y, r)}><path d="M-11 -6 Q0 -10 11 -5 Q14 2 9 7 Q-2 10 -11 6 Q-14 0 -11 -6 Z" fill="#6E2A14" ${ow(2.2)}/>
      ${[[-5, -3], [3, -4], [0, 2], [6, 2], [-6, 3], [-1, -1]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.3" fill="#D8602A"/>`).join('')}</g>`;
    const ring = (x, y, r, s = 1) => `<g ${at(x, y, r, s)}><ellipse rx="12" ry="7" fill="none" stroke="${INK}" stroke-width="5"/><ellipse rx="12" ry="7" fill="none" stroke="#F6EEF4" stroke-width="3"/><ellipse rx="12" ry="7" fill="none" stroke="#C894B8" stroke-width="1" opacity=".7"/></g>`;
    const slice = (x, y) => `<g ${at(x, y)}><circle r="9" fill="#E2362E" ${ow(2.2)}/><circle r="6.4" fill="#FF7A62"/>${[0, 72, 144, 216, 288].map((d) => `<ellipse cx="${(3.6 * Math.cos(d * Math.PI / 180)).toFixed(1)}" cy="${(3.6 * Math.sin(d * Math.PI / 180)).toFixed(1)}" rx="1.4" ry="1" fill="#FFE27A"/>`).join('')}</g>`;
    return `${shadow(162, 86, 11)}
      <path d="M20 132 L72 92 L184 112 L134 160 Z" fill="#ECE6D8" ${O}/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${44 + i * 14} ${116 - i * 3} L${70 + i * 14} ${120 - i * 3}" stroke="#B8B0A0" stroke-width="2" stroke-linecap="round"/>`).join('')}
      <path d="M72 92 L184 112 L176 120 L76 100 Z" fill="#D8D0BE"/>
      ${meat(84, 120, -10)}${meat(102, 116, 20)}${meat(120, 122, -30)}${meat(94, 132, 10)}${meat(112, 134, -5)}${meat(132, 132, 25)}${meat(104, 126, 45)}
      ${ring(64, 132, -20)}${ring(146, 120, 15)}${ring(76, 142, 10, 0.8)}
      ${slice(140, 140)}${slice(156, 132)}
      <g ${at(56, 112)}><ellipse rx="11" ry="5" fill="#C8461E" ${ow(2)}/>${T.flakes(-6, -3)}</g>
      ${T.herbs(126, 108)}`;
  }

  function larb() {
    // Lao style: a mound of larb with herbs, lettuce leaves and a scoop of sticky rice.
    const lettuce = (x, y, r) => `<g ${at(x, y, r)}><path d="M-22 4 Q-26 -10 -10 -14 Q0 -20 10 -14 Q26 -10 22 4 Q12 10 0 9 Q-12 10 -22 4 Z" fill="#9BD06A" ${ow(2.4)}/>
      <path d="M-16 -2 Q-6 -9 0 -8 Q8 -9 16 -2" fill="none" stroke="#C9EC98" stroke-width="2.6" stroke-linecap="round"/></g>`;
    const mince = [...Array(26)].map((_, i) => { const x = 62 + (i * 29) % 64, y = 104 + (i * 11) % 30; return `<circle cx="${x}" cy="${y}" r="${2.6 + (i % 3)}" fill="${['#A8643E', '#C47E52', '#8A4A2C'][i % 3]}" ${ow(1.2)}/>`; }).join('');
    return `${shadow(162, 88, 12)}
      <ellipse cx="100" cy="134" rx="92" ry="28" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="134" rx="76" ry="20" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${lettuce(42, 128, -20)}${lettuce(54, 144, 10)}
      <path d="M56 130 Q54 102 94 98 Q132 100 132 130 Q94 144 56 130 Z" fill="#B87A50" ${O}/>
      ${mince}
      ${[[70, 112], [90, 106], [108, 118], [120, 108], [80, 126], [100, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#F2DDA8"/>`).join('')}
      ${T.mint(78, 104)}${T.mint(112, 100)}${T.spring(96, 118)}${T.flakes(70, 120)}${T.chilli(120, 120)}
      ${T.lime(104, 148, 8)}
      <path d="M132 136 Q128 112 150 108 Q170 108 168 132 Q152 142 132 136 Z" fill="#FFFDF5" ${O}/>
      ${[...Array(18)].map((_, k) => { const x = 138 + (k * 17) % 26, y = 114 + (k * 7) % 22; return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" transform="rotate(${(k * 53) % 180} ${x} ${y})" fill="none" stroke="#E2DACA" stroke-width="1.2"/>`; }).join('')}
      <path d="M140 118 Q148 112 158 116" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>`;
  }

  function sholehzard() {
    // A shallow dessert dish of saffron pudding with a cinnamon lattice and a nut flower.
    const cx = 100, cy = 106, rx = 66, ry = 18;
    const lattice = [];
    for (let k = -5; k <= 5; k++) {
      lattice.push(clipToEllipse(cx + k * 18 - 40, cy - 30, cx + k * 18 + 40, cy + 30, cx, cy, rx - 4, ry - 2));
      lattice.push(clipToEllipse(cx + k * 18 + 40, cy - 30, cx + k * 18 - 40, cy + 30, cx, cy, rx - 4, ry - 2));
    }
    const petals = [0, 60, 120, 180, 240, 300].map((d) => { const a = d * Math.PI / 180, x = cx + 9 * Math.cos(a), y = cy + 4 * Math.sin(a); return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="2.4" transform="rotate(${d} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#FFF3DC" ${ow(1.3)}/>`; }).join('');
    return `${shadow(166, 60, 9)}
      <path d="M78 150 L72 164 L128 164 L122 150 Z" fill="#FFFFFF" ${O}/>
      <path d="M30 108 Q38 152 100 154 Q162 152 170 108 Z" fill="#FFFFFF" ${O}/>
      <path d="M44 132 Q100 146 156 132" fill="none" stroke="#2E8FB8" stroke-width="5"/>
      ${[56, 78, 100, 122, 144].map((x) => `<circle cx="${x}" cy="${x === 100 ? 142 : (x < 100 ? 138 + (x - 56) / 11 : 138 + (144 - x) / 11)}" r="2.4" fill="#2E8FB8"/>`).join('')}
      <ellipse cx="${cx}" cy="${cy}" rx="72" ry="22" fill="#FFFFFF" ${O}/>
      <ellipse cx="${cx}" cy="${cy + 1}" rx="${rx}" ry="${ry}" fill="#F6B92E"/>
      <ellipse cx="${cx - 10}" cy="${cy - 4}" rx="34" ry="6" fill="#FAD066"/>
      <path d="${lattice.filter(Boolean).join(' ')}" fill="none" stroke="#8A4318" stroke-width="2.2" stroke-linecap="round"/>
      ${petals}<circle cx="${cx}" cy="${cy}" r="3.4" fill="#8DBF4A" ${ow(1.2)}/>
      ${[[64, 106], [136, 106]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2" fill="#8DBF4A" ${ow(1)}/>`).join('')}`;
  }

  function handi() {
    // Butter chicken in a hammered copper handi, with naan alongside.
    const naan = `<g transform="translate(160 150) rotate(72) scale(0.85)">
      <path d="M-18 -30 Q6 -38 16 -14 Q24 14 8 32 Q-14 40 -22 14 Q-28 -14 -18 -30 Z" fill="#EFC27A" ${O}/>
      ${[[-8, -18, 5], [6, -8, 4], [-10, 6, 4.6], [6, 16, 3.6], [-4, 24, 3]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#B8641E" opacity=".8"/>`).join('')}
      <path d="M-14 -20 Q-2 -28 8 -18" fill="none" stroke="#FBE0A8" stroke-width="3" stroke-linecap="round"/></g>`;
    return `${steam()}
      ${shadow(170, 74, 9)}
      ${naan}
      <path d="M26 104 Q28 162 92 164 Q156 162 158 104 Z" fill="#C8682E" ${O}/>
      ${[[48, 128], [64, 146], [88, 152], [112, 148], [134, 132], [56, 112], [130, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#E08A4E" opacity=".8"/>`).join('')}
      <path d="M40 124 Q50 150 76 156" fill="none" stroke="#F2A66A" stroke-width="5" stroke-linecap="round"/>
      <path d="M14 104 Q8 92 20 92" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M14 104 Q8 92 20 92" fill="none" stroke="#C8682E" stroke-width="5" stroke-linecap="round"/>
      <path d="M170 104 Q176 92 164 92" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M170 104 Q176 92 164 92" fill="none" stroke="#C8682E" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="92" cy="102" rx="70" ry="20" fill="#D9783A" ${O}/>
      <ellipse cx="92" cy="104" rx="60" ry="14" fill="#E8762E"/>
      ${T.chicken(70, 102)}${T.chicken(110, 106)}${T.chicken(94, 96)}
      <path d="M64 110 q8 -6 16 0 t16 0 t16 0" fill="none" stroke="#FFF6E8" stroke-width="4" stroke-linecap="round"/>
      ${T.herbs(118, 96)}${T.herbs(78, 92)}
      ${naan}`;
  }

  function katori() {
    // South Indian meal: sambar in a steel bowl on a banana leaf, with idli.
    const idli = (x, y) => `<g ${at(x, y)}><ellipse cy="4" rx="20" ry="9" fill="#F2EEE4" ${O}/><ellipse rx="20" ry="9" fill="#FFFFFF" ${O}/>
      ${[[-8, -1], [2, -3], [9, 1], [-2, 3]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1" fill="#E4DCC8"/>`).join('')}</g>`;
    return `${steam()}
      ${shadow(166, 90, 11)}
      <path d="M8 140 Q40 112 100 110 Q170 108 196 128 Q170 162 100 162 Q30 162 8 140 Z" fill="#4FA83C" ${O}/>
      <path d="M14 140 Q100 128 190 128" fill="none" stroke="#8ED06A" stroke-width="3"/>
      ${[30, 52, 74, 96, 118, 140, 162].map((x) => `<path d="M${x} ${136 - (x - 14) * 0.05} L${x + 10} ${150 - (x - 14) * 0.02}" stroke="#3E8E2E" stroke-width="1.6"/>`).join('')}
      ${idli(150, 136)}${idli(164, 122)}
      <g transform="translate(-14 0)">
        <path d="M44 104 Q46 150 96 152 Q146 150 148 104 Z" fill="#C8CED6" ${O}/>
        <path d="M56 128 Q96 140 136 128" fill="none" stroke="#E6EAEE" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="96" cy="104" rx="54" ry="16" fill="#DDE2E8" ${O}/>
        <ellipse cx="96" cy="106" rx="45" ry="11" fill="#C8742E"/>
        ${T.drumstick(84, 104)}${T.carrot(110, 108)}${T.curryLeaf(72, 108)}${T.mustardSeeds(98, 100)}${T.okra(120, 102)}
      </g>`;
  }

  function kadai(a = {}) {
    // A black iron kadai (karahi). Default is Goan vindaloo: deep-red, oil-glossed curry
    // with potato, whole dried Kashmiri chillies and coriander. `meat: 'chicken'` with
    // `garnish: 'ginger'` gives a Pakistani chicken karahi with tomato, ginger and green chilli.
    const driedChilli = (x, y, r) => `<g ${at(x, y, r)}><path d="M-14 0 Q-4 -7 12 -3 Q16 0 12 3 Q-4 7 -14 0 Z" fill="#9E1A14" ${ow(2.2)}/><path d="M-10 -1 Q0 -4 10 -2" fill="none" stroke="#D8463A" stroke-width="1.8" stroke-linecap="round"/><path d="M12 0 L18 -3" stroke="#5E8A3E" stroke-width="3" stroke-linecap="round"/></g>`;
    const ring = (x) => `<ellipse cx="${x}" cy="106" rx="9" ry="7" fill="none" stroke="${INK}" stroke-width="9"/><ellipse cx="${x}" cy="106" rx="9" ry="7" fill="none" stroke="#5A504C" stroke-width="4.6"/>`;
    return `${steam()}
      ${shadow(168, 76, 10)}
      ${ring(18)}${ring(182)}
      <path d="M24 106 Q30 160 100 162 Q170 160 176 106 Z" fill="#3E3633" ${O}/>
      <path d="M40 128 Q48 150 80 156" fill="none" stroke="#6A605C" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="100" cy="106" rx="80" ry="22" fill="#4A403C" ${O}/>
      <ellipse cx="100" cy="108" rx="70" ry="16" fill="${a.sauce || '#9E2216'}"/>
      <ellipse cx="100" cy="108" rx="62" ry="12" fill="none" stroke="#D84A1E" stroke-width="3" opacity=".7"/>
      <ellipse cx="80" cy="102" rx="24" ry="4" fill="${a.glaze || '#E8642E'}" opacity=".75"/>
      ${a.meat === 'chicken'
        ? `${T.tomato(60, 106)}${T.chicken(76, 110)}${T.chicken(118, 112)}${T.chicken(98, 102)}${T.tomato(136, 104)}`
        : `${T.stewBeef(72, 110)}${T.stewBeef(118, 112)}${T.stewBeef(96, 102)}${T.potato(132, 102)}${T.potato(58, 104)}`}
      ${a.garnish === 'ginger'
        ? `${T.gingerShreds(96, 98)}${T.greenChilli(66, 116)}${T.greenChilli(122, 116)}${T.herbs(140, 98)}${T.herbs(78, 96)}`
        : `${driedChilli(100, 116, -8)}${driedChilli(138, 116, 25)}${T.herbs(84, 96)}${T.herbs(122, 98)}`}`;
  }

  /* ---------- Shared bits for the Chinese, Southeast Asian and South Asian dishes ---------- */
  const plateShell = (steel = false) => `<ellipse cx="100" cy="150" rx="90" ry="14" fill="${INK}" opacity=".15"/>
    <ellipse cx="100" cy="124" rx="92" ry="34" fill="${steel ? '#D4DAE2' : '#FFFFFF'}" ${O}/>
    <ellipse cx="100" cy="124" rx="74" ry="25" fill="none" stroke="${steel ? '#EEF1F5' : '#8ED3E8'}" stroke-width="4"/>`;
  // A small steel katori seen from the front: rim, contents, then whatever sits in it.
  const steelBowl = (x, y, rx, ry, fill, inner = '') => `<g ${at(x, y)}>
    <path d="M${-rx} 0 Q${-rx + 3} ${(ry * 2.3).toFixed(1)} 0 ${(ry * 2.4).toFixed(1)} Q${rx - 3} ${(ry * 2.3).toFixed(1)} ${rx} 0 Z" fill="#B8C0CA" ${ow(2.6)}/>
    <path d="M${-rx + 6} ${(ry * 0.9).toFixed(1)} Q${-rx + 8} ${(ry * 1.9).toFixed(1)} ${-rx / 3} ${(ry * 2.1).toFixed(1)}" fill="none" stroke="#E6EAEE" stroke-width="3" stroke-linecap="round"/>
    <ellipse rx="${rx}" ry="${ry}" fill="#DDE2E8" ${ow(2.6)}/>
    <ellipse cy="1" rx="${rx - 4.5}" ry="${ry - 3}" fill="${fill}"/>${inner}</g>`;
  const friedEgg = (x, y, s = 1) => `<g ${at(x, y, 0, s)}>
    <path d="M-22 2 Q-25 -10 -10 -12 Q-2 -18 10 -12 Q25 -12 22 0 Q25 10 8 12 Q-6 16 -16 10 Q-26 8 -22 2 Z" fill="#FFFDF5" ${ow(2.4)}/>
    <path d="M-21 5 Q-20 10 -12 11 M18 -9 Q23 -6 22 0" fill="none" stroke="#D89A4A" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="1" cy="-1" r="8" fill="#FFB43A" ${ow(2)}/><circle cx="-1.6" cy="-3.6" r="2.4" fill="#FFE2A8"/></g>`;
  const bokchoy = (x, y, r = 0) => `<g ${at(x, y, r)}>
    <path d="M-12 -8 Q-15 -26 0 -30 Q15 -26 12 -8 Q6 -3 0 -9 Q-6 -3 -12 -8 Z" fill="#3E8E3A" ${ow(2)}/>
    <path d="M-4 10 Q-7 -2 -3 -11 L3 -11 Q7 -2 4 10 Z" fill="#E6F2C8" ${ow(2)}/>
    <path d="M0 -27 L0 -10" stroke="#8FCF6F" stroke-width="1.6" stroke-linecap="round"/></g>`;
  const lettuceLeaf = (x, y, r, s = 1) => `<g ${at(x, y, r, s)}><path d="M-22 4 Q-26 -10 -10 -14 Q0 -20 10 -14 Q26 -10 22 4 Q12 10 0 9 Q-12 10 -22 4 Z" fill="#9BD06A" ${ow(2.4)}/>
    <path d="M-16 -2 Q-6 -9 0 -8 Q8 -9 16 -2" fill="none" stroke="#C9EC98" stroke-width="2.6" stroke-linecap="round"/></g>`;
  // Points spread evenly over an ellipse, for scattering grains and pieces.
  const scatter = (n, cx, cy, rx, ry) => [...Array(n)].map((_, i) => {
    const r = Math.sqrt((i + 0.5) / n), a = i * 2.39996;
    return [+(cx + rx * r * Math.cos(a)).toFixed(1), +(cy + ry * r * Math.sin(a)).toFixed(1), i];
  });
  const grains = (n, cx, cy, rx, ry, colours) => scatter(n, cx, cy, rx, ry).map(([x, y, i]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.5" transform="rotate(${(i * 53) % 180} ${x} ${y})" fill="${colours[i % colours.length]}"/>`).join('');
  const sichuanCorns = (pts) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#6A1E14" stroke="${INK}" stroke-width=".8"/><path d="M${x - 1} ${y - 0.6} L${x + 1} ${y + 0.6}" stroke="#C8644A" stroke-width=".9"/>`).join('');
  const cinnamonStick = (x, y, r) => `<g ${at(x, y, r)}><rect x="-12" y="-3.6" width="24" height="7.2" rx="3.6" fill="#A85A2A" ${ow(1.8)}/><path d="M-9 0 L9 0" stroke="#7A3A1A" stroke-width="1.4" stroke-linecap="round"/></g>`;
  const leafMat = (rx = 80, ry = 27) => {
    const veins = [];
    for (let x = 36; x <= 164; x += 16) veins.push(clipToEllipse(x, 124, x + 12, 104, 100, 124, rx - 3, ry - 3), clipToEllipse(x, 124, x + 12, 144, 100, 124, rx - 3, ry - 3));
    return `<ellipse cx="100" cy="124" rx="${rx}" ry="${ry}" fill="#4FA83C" ${ow(3)}/>
      <path d="M${100 - rx + 6} 124 L${100 + rx - 6} 124 ${veins.filter(Boolean).join(' ')}" fill="none" stroke="#7CC85E" stroke-width="2" stroke-linecap="round"/>`;
  };

  function mapo() {
    // Silky tofu in a glossy red sauce with minced pork, Sichuan pepper and spring onion.
    const cube = (x, y, r) => `<g ${at(x, y, r)}><path d="M-9 -3 L-2 -8 L9 -6 L9 4 L2 9 L-9 6 Z" fill="#FFF6E6" ${ow(2.2)}/>
      <path d="M-9 -3 L2 -1 L9 -6 M2 -1 L2 9" fill="none" stroke="#EBD3B8" stroke-width="1.6"/><path d="M-6 -3.6 L0 -6.6" stroke="#E2362E" stroke-width="2.4" stroke-linecap="round" opacity=".55"/></g>`;
    const cubes = [[78, 112], [98, 108], [120, 110], [140, 118], [62, 122], [88, 122], [110, 124], [132, 130], [74, 136], [98, 138], [120, 140], [150, 132]];
    const mince = scatter(24, 100, 126, 58, 18).map(([x, y, i]) => `<circle cx="${x}" cy="${y}" r="${2 + (i % 3) * 0.6}" fill="${['#7A3418', '#94461E', '#5E2410'][i % 3]}"/>`).join('');
    return `${steam()}${coupe(126, 90, 34)}
      <ellipse cx="100" cy="127" rx="66" ry="22" fill="#A81E14"/>
      <ellipse cx="100" cy="129" rx="58" ry="17" fill="#D8342B"/>
      ${mince}
      ${cubes.map(([x, y], i) => cube(x, y, (i * 17) % 24 - 12)).join('')}
      <path d="M50 124 Q66 112 88 114" fill="none" stroke="#F0704A" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      ${sichuanCorns([[70, 118], [108, 116], [128, 122], [86, 132], [112, 134], [142, 126], [60, 130]])}
      ${T.spring(86, 104)}${T.spring(130, 112)}${T.spring(104, 130)}`;
  }

  function dandan() {
    // A small bowl: chilli oil and sesame sauce underneath, noodles, crispy pork and bok choy on top.
    const lines = ['M62 102 q9 -5 18 0 t18 0 t18 0 t18 0 t14 0', 'M68 96 q9 -5 18 0 t18 0 t18 0 t14 0', 'M76 90 q9 -5 16 0 t16 0 t16 0 t8 0', 'M60 106 q10 4 20 0 t20 0 t20 0 t20 0'];
    const mince = scatter(16, 100, 86, 16, 6).map(([x, y, i]) => `<circle cx="${x}" cy="${y}" r="${2.4 + (i % 3) * 0.5}" fill="${['#8A4A2C', '#A85E36', '#6E3418'][i % 3]}" ${ow(1)}/>`).join('');
    return `${bowl({ broth: '#B8281A' }, '#FFFFFF', '#2E6FB8')}
      <path d="M44 104 Q100 124 156 104 Q150 114 100 119 Q50 114 44 104 Z" fill="#D8342B"/>
      <path d="M50 106 Q54 84 100 80 Q146 84 150 106 Q100 116 50 106 Z" fill="#F4DA94" ${O}/>
      ${lines.map((d) => `<path d="${d}" fill="none" stroke="#D8B464" stroke-width="2.2" stroke-linecap="round"/>`).join('')}
      ${bokchoy(138, 96, 50)}
      ${mince}
      ${T.peanut(66, 98)}${T.spring(112, 82)}${sichuanCorns([[84, 92], [120, 96], [96, 100]])}
      <ellipse cx="62" cy="112" rx="8" ry="2.4" fill="#FF8A6B" opacity=".9"/>`;
  }

  function charsiu() {
    // Glossy slices of char siu fanned over rice, with blanched choy sum.
    // Each slice lies flat: lacquered red edge round a pink middle, shingled down the plate.
    const slice = (x, y) => `<g ${at(x, y, -28)}><path d="M-17 -5 Q-15 -11 0 -11 Q15 -11 17 -5 L17 5 Q15 11 0 11 Q-15 11 -17 5 Z" fill="#A82A20" ${ow(2.2)}/>
      <path d="M-12.6 -2.4 Q-11 -6.6 0 -6.6 Q11 -6.6 12.6 -2.4 L12.6 2.4 Q11 6.6 0 6.6 Q-11 6.6 -12.6 2.4 Z" fill="#E9876E"/><path d="M-8 -2 L8 -2" stroke="#F6B8A2" stroke-width="2" stroke-linecap="round"/></g>`;
    return `${steam()}${plateShell()}
      <path d="M30 130 Q28 98 66 96 Q104 98 104 130 Q66 142 30 130 Z" fill="#FFFDF5" ${O}/>
      ${grains(16, 66, 116, 28, 12, ['#ECE4D0'])}
      ${[0, 1, 2, 3, 4, 5].map((i) => slice(100 + i * 10, 100 + i * 6)).join('')}
      <path d="M98 96 Q124 102 152 128" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".3"/>
      <path d="M98 96 Q124 102 152 128" fill="none" stroke="#7A1A14" stroke-width="3.4" stroke-linecap="round"/>
      ${T.sesameSeeds(116, 108)}
      ${bokchoy(56, 138, 75)}${bokchoy(70, 146, 92)}${T.spring(150, 136)}`;
  }

  function hongshao() {
    // Mahogany cubes of braised pork belly, layered skin, fat and meat, in a blue-rimmed dish.
    const cube = (x, y, r) => `<g ${at(x, y, r)}>
      <path d="M-12 -4 L-4 -10 L14 -10 L6 -4 Z" fill="#8A2A12" ${ow(2)}/>
      <path d="M6 -4 L14 -10 L14 6 L6 12 Z" fill="#561608" ${ow(2)}/>
      <rect x="-12" y="-4" width="18" height="16" fill="#7A2410" ${ow(2)}/>
      <path d="M-11 1 L5 1" stroke="#F2D2A0" stroke-width="2.6"/><path d="M-11 7 L5 7" stroke="#F2D2A0" stroke-width="1.8"/>
      <path d="M-7 -6 L7 -8.4" stroke="#E07A4A" stroke-width="2" stroke-linecap="round"/></g>`;
    return `${steam()}${coupe(126, 90, 34)}
      <ellipse cx="100" cy="126" rx="88" ry="32" fill="none" stroke="#2E6FB8" stroke-width="3"/>
      <ellipse cx="100" cy="128" rx="62" ry="19" fill="#5E1A0C"/>
      <ellipse cx="86" cy="124" rx="30" ry="5" fill="#9A3A1C" opacity=".8"/>
      ${[[84, 110, 0], [108, 108, 6], [130, 114, -4], [66, 122, 4], [94, 124, -6], [118, 126, 3], [140, 130, -3], [80, 138, 5], [106, 140, -2]].map(([x, y, r]) => cube(x, y, r)).join('')}
      ${T.staranise(56, 136)}${T.spring(124, 104)}${T.spring(150, 120)}${T.chilli(60, 110)}`;
  }

  function teaeggs() {
    // Marbled eggs steeping in a bowl of dark spiced tea.
    const shell = (x, y, r) => `<g ${at(x, y, r)}><ellipse rx="15" ry="11" fill="#9A6A40" ${ow(2.4)}/>
      <path d="M-10 -4 L-4 0 L-7 5 M-4 0 L3 -3 L6 2 L12 0 M3 -3 L1 -8 M6 2 L4 8" fill="none" stroke="#4E2A12" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="-5" cy="-5" rx="4" ry="2" fill="#C8986A"/></g>`;
    const web = '<path d="M-12 -2 Q-6 -6 -2 -2 T8 -4 M-9 4 Q-3 1 2 5 T12 3 M-4 -9 Q-2 -4 -5 0 M4 -9 Q6 -4 3 0 L5 9 M-2 2 L-4 9" fill="none" stroke="#7A4A28" stroke-width="1.3" stroke-linecap="round"/>';
    const marbled = (x, y, r) => `<g ${at(x, y, r)}><ellipse rx="15" ry="11" fill="#F2DDB8" ${ow(2.4)}/>${web}</g>`;
    const halved = (x, y) => `<g ${at(x, y)}><ellipse rx="15" ry="11" fill="#E8CDA2" ${ow(2.4)}/>${web}<ellipse rx="10.5" ry="7.4" fill="#FFF8EC"/><circle r="5.2" fill="#F2B83A" ${ow(1.4)}/></g>`;
    return `${bowl({ broth: '#4A2814' }, '#FFFFFF', '#2E6FB8')}
      <ellipse cx="86" cy="96" rx="34" ry="4" fill="#7A4A2A" opacity=".7"/>
      ${marbled(102, 90, 8)}${shell(72, 96, -12)}${shell(134, 96, 14)}${halved(90, 108)}${marbled(120, 110, -6)}
      ${T.staranise(56, 110)}${cinnamonStick(150, 110, -20)}`;
  }

  function nasilemak() {
    // Coconut rice on banana leaf with sambal, egg, cucumber, ikan bilis and peanuts.
    const anchovies = [[96, 142, 10], [104, 138, -20], [110, 144, 30], [100, 148, -5], [116, 140, 60], [92, 136, -40]].map(([x, y, r]) => `<g ${at(x, y, r)}><path d="M-6 0 Q0 -3 6 0 Q0 3 -6 0 Z" fill="#E0A04A" ${ow(1.2)}/><circle cx="-3.8" cy="-0.4" r="0.8" fill="${INK}"/></g>`).join('');
    return `${plateShell()}${leafMat()}
      <path d="M56 128 Q54 92 88 90 Q122 92 120 128 Q88 136 56 128 Z" fill="#FFFDF5" ${O}/>
      ${grains(18, 88, 112, 26, 14, ['#ECE4D0'])}
      <path d="M74 98 Q86 92 100 96" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      <path d="M124 116 Q120 98 140 96 Q162 96 162 114 Q160 128 142 128 Q126 128 124 116 Z" fill="#9E1E14" ${O}/>
      <path d="M132 106 Q142 100 152 104" fill="none" stroke="#E0503A" stroke-width="3" stroke-linecap="round"/>
      ${T.redOnion(142, 114)}
      ${T.cucumber(48, 134)}${T.cucumber(62, 142)}
      ${T.egg(138, 140)}${anchovies}${T.peanut(74, 138)}`;
  }

  function roticanai() {
    // Flaky roti on a steel plate with little bowls of dhal and curry.
    const roti = (x, y, r, s) => `<g ${at(x, y, r, s)}>
      <path d="M-40 -2 Q-38 -24 -6 -22 Q30 -24 38 -6 Q42 16 8 20 Q-34 22 -40 -2 Z" fill="#F0C470" ${O}/>
      <path d="M-30 -4 Q-20 -16 0 -14 Q22 -14 26 -2 M-24 6 Q-8 -4 14 2 M-14 12 Q0 8 18 12" fill="none" stroke="#D49A48" stroke-width="2.4" stroke-linecap="round"/>
      ${[[-18, -8, 5], [8, -10, 4], [20, 4, 4.6], [-6, 10, 3.6], [-28, 6, 3]].map(([cx, cy, rr]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rr}" ry="${rr * 0.6}" fill="#B8701E" opacity=".7"/>`).join('')}
      <path d="M-26 -10 Q-12 -20 4 -18" fill="none" stroke="#FBE2A8" stroke-width="3" stroke-linecap="round"/></g>`;
    return `${steam()}${plateShell(true)}
      ${roti(80, 110, -6, 1)}${roti(62, 132, -14, 0.72)}
      ${steelBowl(144, 104, 26, 9, '#F2B830', `${T.curryLeaf(-6, 0)}${T.mustardSeeds(6, -1)}`)}
      ${steelBowl(148, 132, 24, 8, '#B8401E', `${T.potato(-6, 1)}${T.chicken(8, 0)}`)}`;
  }

  function satay() {
    // Turmeric-gold skewers on banana leaf with peanut sauce, cucumber, onion and ketupat.
    const skewer = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-66 0 L58 0" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-66 0 L58 0" stroke="#E8C48A" stroke-width="2.6" stroke-linecap="round"/>
      ${[-30, -10, 10, 30].map((cx, i) => `<g transform="translate(${cx} 0) rotate(${i * 17 - 20})"><path d="M-9 -6 Q0 -9 9 -5 Q11 2 8 6 Q-2 8 -9 6 Q-11 0 -9 -6 Z" fill="#D08A2A" ${ow(2)}/><path d="M-4 -5 L-1 5 M3 -5 L5 4" stroke="#6A3410" stroke-width="2" stroke-linecap="round"/><ellipse cx="-3" cy="-3" rx="3" ry="1.4" fill="#F2C060"/></g>`).join('')}</g>`;
    const ketupat = (x, y) => `<g ${at(x, y)}><rect x="-9" y="-7" width="18" height="14" rx="2" fill="#FFFDF5" ${ow(2)}/><path d="M-9 -7 L9 -7" stroke="#6FB04E" stroke-width="3"/></g>`;
    return `${plateShell()}${leafMat()}
      ${skewer(80, 104, -8)}${skewer(80, 122, -2)}${skewer(80, 140, 4)}
      <ellipse cx="158" cy="116" rx="24" ry="8" fill="${INK}" opacity=".15"/>
      <ellipse cx="156" cy="108" rx="22" ry="8.5" fill="#FFFFFF" ${O}/>
      <ellipse cx="156" cy="109" rx="17" ry="5.6" fill="#B8642A"/>
      ${T.peanut(150, 106)}<path d="M146 110 Q156 104 164 110" fill="none" stroke="#D8342B" stroke-width="2.4" stroke-linecap="round"/>
      ${T.cucumber(160, 128)}${ketupat(150, 146)}${ketupat(168, 140)}`;
  }

  function nasigoreng() {
    // Fried rice crowned with a fried egg, prawn crackers, cucumber and tomato.
    const krupuk = (x, y, r) => `<g ${at(x, y, r)}><path d="M-18 0 Q-18 -12 -4 -14 Q10 -16 16 -6 Q22 4 10 10 Q-6 16 -14 8 Q-20 4 -18 0 Z" fill="#FBF2E4" ${ow(2.2)}/>
      ${[[-8, -4], [4, -8], [8, 2], [-4, 5], [-12, 2]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.6" fill="#F0B8B0"/>`).join('')}<circle cx="2" cy="-2" r="3" fill="none" stroke="#EADBC8" stroke-width="1.4"/></g>`;
    return `${steam()}${plateShell()}
      ${krupuk(44, 112, -10)}${krupuk(36, 128, 20)}
      <path d="M54 130 Q50 98 96 94 Q142 98 140 130 Q96 142 54 130 Z" fill="#B0602A" ${O}/>
      ${grains(36, 97, 118, 38, 14, ['#D8884A', '#8A3E1A', '#E8A060'])}
      ${T.chives(70, 122)}${T.flakes(120, 124)}${T.chives(124, 112)}
      ${friedEgg(98, 100, 0.95)}
      ${T.cucumber(152, 120)}${T.cucumber(164, 130)}${T.tomato(148, 138)}
      ${T.friedOnion(78, 132)}${T.friedOnion(114, 134)}`;
  }

  function amok() {
    // Fish amok set like a soft custard in a pinned banana-leaf cup, with coconut cream and chilli.
    const tip = (d) => `<path d="${d}" fill="#5FB04A" ${ow(2.4)}/>`;
    const pin = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#E8C48A" stroke-width="1.6" stroke-linecap="round"/>`;
    return `${plateShell()}
      ${tip('M64 94 L62 82 L76 90 Z')}${tip('M124 90 L138 82 L136 94 Z')}${tip('M48 102 L36 100 L46 112 Z')}${tip('M152 102 L164 100 L154 112 Z')}
      ${pin(60, 86, 68, 93)}${pin(140, 86, 132, 93)}
      <path d="M44 104 Q46 144 100 150 Q154 144 156 104 Z" fill="#4E9A3C" ${O}/>
      ${[58, 72, 86, 100, 114, 128, 142].map((x) => `<path d="M${x} ${118 + Math.abs(x - 100) * -0.1} Q${x + (x - 100) * 0.06} 132 ${x + (x - 100) * 0.1} ${144 - Math.abs(x - 100) * 0.12}" fill="none" stroke="#3A7A2E" stroke-width="2" stroke-linecap="round"/>`).join('')}
      <ellipse cx="100" cy="104" rx="56" ry="18" fill="#5FB04A" ${O}/>
      <ellipse cx="100" cy="106" rx="49" ry="13.5" fill="#F2C24A"/>
      <ellipse cx="88" cy="102" rx="26" ry="4" fill="#F8D878"/>
      <path d="M68 108 Q84 98 100 106 Q116 114 132 104" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity=".2"/>
      <path d="M68 108 Q84 98 100 106 Q116 114 132 104" fill="none" stroke="#FFFBF0" stroke-width="4.6" stroke-linecap="round"/>
      ${T.pepperStrip(92, 102, -20)}${T.pepperStrip(116, 108, 15)}
      <path d="M78 112 L88 110 M122 98 L132 100 M104 96 L112 94" stroke="#2E6E2A" stroke-width="2" stroke-linecap="round"/>`;
  }

  function loklak() {
    // Seared beef cubes on lettuce and tomato with a fried egg and a lime and Kampot pepper dip.
    return `${steam()}${plateShell()}
      ${lettuceLeaf(76, 118, -10, 1.35)}${lettuceLeaf(118, 124, 8, 1.3)}
      ${T.tomato(50, 132)}${T.tomato(64, 142)}${T.redOnion(126, 106)}
      ${[[76, 120], [92, 112], [108, 118], [84, 130], [100, 128], [116, 132], [68, 110]].map(([x, y]) => T.stewBeef(x, y)).join('')}
      ${friedEgg(110, 104, 0.78)}
      <ellipse cx="158" cy="134" rx="20" ry="8" fill="${INK}" opacity=".15"/>
      <ellipse cx="156" cy="126" rx="18" ry="7.5" fill="#FFFFFF" ${O}/>
      <ellipse cx="156" cy="127" rx="13.5" ry="4.6" fill="#F4ECC8"/>
      ${[[150, 126], [154, 128], [158, 125], [161, 128], [156, 130], [152, 129]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#2E2826"/>`).join('')}
      ${T.lime(160, 108, 15)}`;
  }

  function chole() {
    // A puffed bhatura beside a katori of spiced chickpeas, onion, chilli and lemon.
    return `${steam()}${plateShell(true)}
      <g ${at(72, 106)}><path d="M-44 6 Q-46 -30 0 -32 Q46 -30 44 6 Q40 22 0 24 Q-40 22 -44 6 Z" fill="#F0BE62" ${O}/>
        ${[[-24, -8, 6], [10, -18, 5], [22, 2, 6], [-6, 10, 4], [-30, 10, 3.4], [28, -12, 3]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="#D8913A" opacity=".8"/>`).join('')}
        <path d="M-30 -14 Q-16 -26 6 -24" fill="none" stroke="#FCE2A8" stroke-width="4" stroke-linecap="round"/></g>
      ${steelBowl(136, 114, 34, 12, '#8E3E1A', `${T.chickpeas(-14, 0)}${T.chickpeas(2, -2)}${T.chickpeas(16, 2)}${T.herbs(-2, 4)}`)}
      ${T.redOnion(50, 142)}${T.greenChilli(78, 142)}${T.lemon(102, 146, 6)}`;
  }

  function dosa() {
    // A long crisp dosa roll with coconut chutney, tomato chutney and sambar.
    return `${plateShell(true)}
      <g ${at(98, 104, -8)}>
        <rect x="-80" y="-13" width="156" height="26" rx="13" fill="#E09A3A" ${O}/>
        ${[[-60, -4, 6], [-38, 4, 5], [-16, -6, 4], [4, 4, 6], [26, -4, 5], [48, 5, 4], [-50, 6, 3], [36, 2, 3]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}" fill="#B8661E" opacity=".6"/>`).join('')}
        <path d="M-70 -7 Q0 -12 66 -7" fill="none" stroke="#F6C878" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="76" cy="0" rx="8" ry="13" fill="#C8782A" ${ow(3)}/>
        <ellipse cx="76" cy="1" rx="4.6" ry="9" fill="#F2C83A"/><path d="M74 -3 Q78 0 75 4" fill="none" stroke="#C8962A" stroke-width="1.4"/>
      </g>
      ${steelBowl(56, 138, 18, 6, '#FFF8EC', T.mustardSeeds(-4, 0))}
      ${steelBowl(100, 144, 18, 6, '#D8462A')}
      ${steelBowl(144, 138, 18, 6, '#E08A2E', T.curryLeaf(0, 0))}`;
  }

  function chapli() {
    // Two flat chapli kebabs on naan, each with a tomato slice pressed into it.
    const kebab = (x, y, r) => `<g ${at(x, y, r)}><path d="M-32 0 Q-34 -15 -8 -16 Q22 -18 32 -4 Q36 10 10 14 Q-28 16 -32 0 Z" fill="#5A2410" ${O}/>
      <ellipse cx="0" cy="-1" rx="26" ry="10.5" fill="#8A4220"/>
      ${scatter(14, 0, -1, 22, 8).map(([cx, cy, i]) => `<circle cx="${cx}" cy="${cy}" r="1.5" fill="${['#D9B26A', '#C9241C', '#5DB044', '#D9B26A'][i % 4]}"/>`).join('')}
      <circle cx="2" cy="-2" r="7.5" fill="#E2362E" ${ow(1.8)}/><circle cx="2" cy="-2" r="5" fill="#FF7A62"/></g>`;
    return `${steam()}${plateShell()}
      <path d="M36 124 Q34 100 96 98 Q160 98 164 122 Q160 144 98 146 Q38 146 36 124 Z" fill="#EFC27A" ${O}/>
      ${[[52, 116, 4], [150, 128, 5], [64, 136, 3.4], [142, 108, 3]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#B8641E" opacity=".8"/>`).join('')}
      ${kebab(80, 112, -6)}${kebab(122, 126, 8)}
      ${T.redOnion(54, 136)}${T.mint(148, 108)}${T.lemon(160, 142, 15)}`;
  }

  function kottu() {
    // Chopped roti stir-fried with egg, carrot, leek and chilli, with a little curry on the side.
    const bits = scatter(40, 98, 116, 48, 16).map(([x, y, i]) => {
      const r = (i * 47) % 180;
      if (i % 7 === 3) return `<path d="M${x - 5} ${y} L${x + 5} ${y}" transform="rotate(${r} ${x} ${y})" stroke="#F28C28" stroke-width="2.6" stroke-linecap="round"/>`;
      if (i % 7 === 5) return `<path d="M${x - 5} ${y} L${x + 5} ${y}" transform="rotate(${r} ${x} ${y})" stroke="#5DB044" stroke-width="2.6" stroke-linecap="round"/>`;
      return `<rect x="${x - 6}" y="${y - 2.4}" width="12" height="4.8" rx="1.4" transform="rotate(${r} ${x} ${y})" fill="${['#F4D79A', '#F0C878', '#FBE4B0'][i % 3]}" stroke="${INK}" stroke-width="1.1"/>`;
    }).join('');
    return `${steam()}${plateShell()}
      <path d="M40 132 Q38 100 96 94 Q156 98 158 132 Q100 148 40 132 Z" fill="#D8A860" ${O}/>
      ${bits}${T.eggBits(80, 110)}${T.eggBits(116, 124)}${T.chilli(126, 106)}
      ${steelBowl(160, 136, 18, 6, '#A83A1E')}`;
  }

  function ambulthiyal() {
    // Dark, peppery tuna in a terracotta clay pot with curry leaves.
    const chunk = (x, y, r) => `<g ${at(x, y, r)}><path d="M-10 -7 Q0 -10 10 -6 Q13 2 9 7 Q-2 10 -10 7 Q-13 0 -10 -7 Z" fill="#3E2214" ${ow(2.2)}/>
      ${[[-5, -3], [3, -4], [0, 2], [6, 2], [-6, 3], [-1, -1]].map(([cx, cy], i) => `<circle cx="${cx}" cy="${cy}" r="1.2" fill="${i % 2 ? '#7A4A2A' : '#150904'}"/>`).join('')}</g>`;
    return `${shadow(170, 76, 10)}
      <path d="M28 104 Q24 150 60 162 Q100 172 140 162 Q176 150 172 104 Z" fill="#B8582E" ${O}/>
      <path d="M44 126 Q48 150 78 160" fill="none" stroke="#D8784A" stroke-width="5" stroke-linecap="round"/>
      <path d="M32 126 Q100 142 168 126" fill="none" stroke="#8A3A1A" stroke-width="2.4"/>
      <ellipse cx="100" cy="104" rx="74" ry="22" fill="#C8683A" ${O}/>
      <ellipse cx="100" cy="107" rx="64" ry="16" fill="#2E1A10"/>
      ${[[76, 104, 0], [100, 100, 20], [124, 104, -10], [88, 112, 15], [114, 114, -20], [62, 110, 30], [140, 110, 5]].map(([x, y, r]) => chunk(x, y, r)).join('')}
      ${T.curryLeaf(70, 98)}${T.curryLeaf(130, 96)}${T.curryLeaf(104, 116)}${cinnamonStick(146, 116, 20)}`;
  }

  function hoppers() {
    // Two bowl-shaped egg hoppers, lacy and crisp, with seeni sambol and pol sambol.
    const hopper = (x, y, s) => `<g ${at(x, y, 0, s)}>
      <path d="M-36 0 Q-30 26 0 28 Q30 26 36 0 Z" fill="#C8823A" ${O}/>
      ${[[-20, 10], [-8, 18], [8, 18], [20, 10], [0, 22], [-26, 4], [26, 4]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="3" ry="1.8" fill="#8A4A1A" opacity=".55"/>`).join('')}
      <ellipse rx="36" ry="13" fill="#E8B060" ${O}/>
      <ellipse cy="2" rx="31" ry="10" fill="#F6E2B8"/>
      ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => `<circle cx="${(27 * Math.cos(d * Math.PI / 180)).toFixed(1)}" cy="${(2 + 8.5 * Math.sin(d * Math.PI / 180)).toFixed(1)}" r="1.4" fill="#D89A4A"/>`).join('')}
      <ellipse cy="4" rx="20" ry="6.5" fill="#FFF6E6"/>
      <ellipse cy="3" rx="13" ry="5" fill="#FFFFFF" ${ow(1.4)}/><circle cy="2.4" r="4.4" fill="#FFB43A" ${ow(1.4)}/></g>`;
    const seeni = [...Array(9)].map((_, i) => `<path d="M${132 + (i * 7) % 26} ${132 + (i * 5) % 12} q4 -5 8 0" fill="none" stroke="#5A1E08" stroke-width="2.8" stroke-linecap="round"/>`).join('');
    return `${plateShell()}
      ${hopper(130, 96, 0.88)}${hopper(76, 112, 1)}
      <path d="M128 140 Q126 126 142 124 Q160 124 162 138 Q146 148 128 140 Z" fill="#8A3A14" ${O}/>${seeni}
      <path d="M96 150 Q96 140 108 138 Q122 138 122 148 Q110 154 96 150 Z" fill="#E8643A" ${ow(3)}/>
      ${[[102, 144], [108, 142], [114, 146], [106, 148]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#FFF3DC"/>`).join('')}`;
  }

  function crab() {
    // A whole crab wok-tossed with sprigs of fresh green Kampot peppercorns.
    const leg = (sx, y, k) => { const d = `M${sx * 24} ${y} L${sx * (44 + k)} ${y - 8} L${sx * (58 + k)} ${y + 6}`;
      return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#D8462A" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>`; };
    const claw = (sx) => { const arm = `M${sx * 16} -12 L${sx * 30} -22 L${sx * 30} -30`;
      return `<path d="${arm}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${arm}" fill="none" stroke="#D8462A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <g transform="translate(${sx * 28} -38) rotate(${sx * -20})"><path d="M-9 8 Q-14 -6 -4 -14 L0 -6 L4 -14 Q14 -6 9 8 Q0 13 -9 8 Z" fill="#E0502A" ${ow(2.4)}/><path d="M-4 -12 L-2 -16 M4 -12 L2 -16" stroke="#3A1A10" stroke-width="2.4" stroke-linecap="round"/></g>`; };
    const sprig = (x, y, r) => `<g ${at(x, y, r)}><path d="M-16 0 Q0 -4 16 0" fill="none" stroke="#4E7A2A" stroke-width="2" stroke-linecap="round"/>
      ${[-12, -7, -2, 3, 8, 13].map((cx, i) => `<circle cx="${cx}" cy="${i % 2 ? 3 : -3}" r="3.2" fill="#5E9A32" ${ow(1.3)}/><circle cx="${cx - 1}" cy="${(i % 2 ? 3 : -3) - 1}" r="1" fill="#A8D86A"/>`).join('')}</g>`;
    const body = `<g transform="translate(100 118) scale(1 .82)">
      ${[-1, 1].map((sx) => leg(sx, -2, 0) + leg(sx, 6, 4) + leg(sx, 14, 2) + leg(sx, 20, -4)).join('')}
      ${claw(-1)}${claw(1)}
      <ellipse rx="34" ry="22" fill="#E0502A" ${O}/>
      <path d="M-24 -6 Q-4 -18 20 -10" fill="none" stroke="#F49A6A" stroke-width="4" stroke-linecap="round"/>
      <path d="M-10 6 Q0 10 10 6" fill="none" stroke="#A8301A" stroke-width="2.4" stroke-linecap="round"/>
      ${scatter(16, 0, 2, 26, 15).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#2E2826"/>`).join('')}
      <circle cx="-7" cy="-21" r="2.6" fill="${INK}"/><circle cx="7" cy="-21" r="2.6" fill="${INK}"/></g>`;
    return `${steam()}${plateShell()}
      <ellipse cx="100" cy="128" rx="62" ry="17" fill="#6A3A1A" opacity=".85"/>
      ${body}
      ${sprig(58, 138, -15)}${sprig(144, 136, 20)}${sprig(120, 148, -5)}${T.spring(64, 112)}`;
  }

  function dish(d) {
    const a = d.art;
    const draw = { bowl: () => bowl(a), plate: () => plate(a), tacos, tagine, banhmi, hotpot, bibimbap, pan, wrap, injera, lasagne: () => lasagne(a), paella, roast, buns, churros, pie, pizza, flatbread, ramekin, empanadas, ceviche, fattoush, koshari, suya, larb, sholehzard, handi, katori, kadai: () => kadai(a),
      mapo, dandan, charsiu, hongshao, teaeggs, nasilemak, roticanai, satay, nasigoreng, amok, loklak, chole, dosa, chapli, kottu, ambulthiyal, hoppers, crab,
      roganjosh: () => bowl(a), nihari: () => bowl(a) }[a.type];
    if (!draw) throw new Error('No illustration for ' + d.id);
    const body = draw();
    return `<svg class="dish-art" viewBox="0 0 200 190" role="img" aria-label="Illustration of ${d.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }

  function cloche() {
    return `<svg class="cloche" viewBox="0 0 200 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 130 Q20 40 100 40 Q180 40 180 130 Z" fill="#DCE3EA" ${O}/>
      <path d="M46 110 Q48 66 92 56" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>
      <rect x="10" y="126" width="180" height="14" rx="7" fill="#B8C2CC" ${O}/>
      <rect x="86" y="22" width="28" height="20" rx="10" fill="#B8C2CC" ${O}/></svg>`;
  }

  function star(cls = '') {
    return `<svg class="star ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z"/></svg>`;
  }

  // Map pin, used for origins that span several countries or where flag emoji don't render
  function pin() {
    return `<svg class="pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" fill="#C8285E" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.6" fill="#FFFFFF"/></svg>`;
  }

  SI.art = { dish, cloche, star, pin };
})(globalThis.SI = globalThis.SI || {});
