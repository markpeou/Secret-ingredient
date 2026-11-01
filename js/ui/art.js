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

  function bowl(art, rim = '#FFFFFF', band = '#C8285E') {
    const tops = (art.toppings || []).map((t, i) => T[t] ? T[t](slots[i % slots.length][0], slots[i % slots.length][1]) : '').join('');
    return `${art.cold ? '' : steam()}
      <ellipse cx="100" cy="176" rx="62" ry="8" fill="${INK}" opacity=".15"/>
      <path d="M22 100 Q24 170 100 170 Q176 170 178 100 Z" fill="${rim}" ${O}/>
      <path d="M34 136 Q100 152 166 136" fill="none" stroke="${band}" stroke-width="7"/>
      <rect x="78" y="164" width="44" height="10" rx="4" fill="${rim}" ${O}/>
      <ellipse cx="100" cy="100" rx="78" ry="24" fill="${rim}" ${O}/>
      <ellipse cx="100" cy="102" rx="67" ry="17" fill="${art.broth}"/>
      ${art.noodles ? noodles() : ''}
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
      const skewer = (y, r) => `<g transform="translate(96 ${y}) rotate(${r})"><path d="M-62 0 L62 0" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-62 0 L62 0" stroke="#E8C48A" stroke-width="2.6" stroke-linecap="round"/>
        ${[-36, -12, 12, 36].map((x, i) => `<path transform="translate(${x} 0) rotate(${i * 13})" d="M-10 -7 Q0 -11 10 -6 Q13 2 9 7 Q-2 10 -10 7 Q-13 0 -10 -7 Z" fill="#7A2E16" ${ow(2.2)}/><g transform="translate(${x} 0)">${[[-4, -3], [3, -4], [0, 2], [5, 3], [-5, 4]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.3" fill="#E0662C"/>`).join('')}</g>`).join('')}</g>`;
      food = `${skewer(108, -6)}${skewer(126, 4)}
        ${T.redOnion(146, 140)}${T.tomato(56, 140)}${T.tomato(72, 144)}`;
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
    const taco = (x, r) => `<g transform="translate(${x} 118) rotate(${r})">
      <path d="M-40 10 A40 40 0 0 1 40 10 Z" fill="#B5542C" ${O}/>
      ${T.herbs(-14, -14)}${T.chilli(8, -18)}
      <rect x="-6" y="-26" width="12" height="10" rx="2" fill="#FFD23F" ${o2}/>
      <path d="M-46 12 A46 46 0 0 1 46 12" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>
      <path d="M-46 12 A46 46 0 0 1 46 12" fill="none" stroke="#F2CE7A" stroke-width="8" stroke-linecap="round"/></g>`;
    return `<ellipse cx="100" cy="166" rx="86" ry="10" fill="${INK}" opacity=".15"/>
      <rect x="14" y="138" width="172" height="22" rx="11" fill="#8ED3E8" ${O}/>
      ${taco(58, -6)}${taco(142, 6)}${T.lime(100, 150)}`;
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
    const sprig = (x, y, r) => `<g ${at(x, y, r)}><path d="M0 0 L0 -26" stroke="#5E8A3E" stroke-width="2.4" stroke-linecap="round"/>${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${i % 2 ? 2.5 : -2.5}" cy="${-10 - i * 4}" rx="2.6" ry="3.4" fill="#9C82C9" stroke="${INK}" stroke-width="1.2"/>`).join('')}</g>`;
    const leg = (x, flip) => `<g transform="translate(${x} 104) scale(${flip} 1)">
      <path d="M0 18 Q-14 14 -12 -2 Q-10 -14 2 -12 Q12 -8 10 6 Q8 16 0 18 Z" fill="#C8691E" ${O}/>
      <path d="M2 -12 L8 -24" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M2 -12 L8 -24" stroke="#FFF3DC" stroke-width="5" stroke-linecap="round"/>
      <circle cx="6" cy="-27" r="4" fill="#FFF3DC" ${ow(2)}/><circle cx="11" cy="-24" r="4" fill="#FFF3DC" ${ow(2)}/>
      <ellipse cx="-4" cy="0" rx="3.5" ry="5" fill="#E8913A"/></g>`;
    return `${steam()}
      <ellipse cx="100" cy="164" rx="90" ry="13" fill="${INK}" opacity=".15"/>
      <ellipse cx="100" cy="144" rx="92" ry="26" fill="#FFFFFF" ${O}/>
      <ellipse cx="100" cy="144" rx="74" ry="18" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      <path d="M48 136 Q44 104 100 98 Q156 104 152 136 Q146 152 100 152 Q54 152 48 136 Z" fill="#D9822A" ${O}/>
      <path d="M58 132 Q60 112 100 108 Q140 112 142 132" fill="none" stroke="#B8621A" stroke-width="3" stroke-linecap="round"/>
      <path d="M66 116 Q84 106 104 108" fill="none" stroke="#F6C070" stroke-width="5" stroke-linecap="round"/>
      ${[[88, 128], [104, 134], [118, 124], [78, 138], [126, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#6E3A12"/>`).join('')}
      ${leg(80, 1)}${leg(120, -1)}
      ${sprig(34, 156, -30)}${sprig(168, 154, 30)}${sprig(160, 150, 12)}
      ${T.lemon(40, 140, -20)}`;
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
    // Lao style: a mound of larb with herbs, lettuce on the side and a basket of sticky rice.
    const lettuce = (x, y, r) => `<g ${at(x, y, r)}><path d="M-22 4 Q-26 -10 -10 -14 Q0 -20 10 -14 Q26 -10 22 4 Q12 10 0 9 Q-12 10 -22 4 Z" fill="#9BD06A" ${ow(2.4)}/>
      <path d="M-16 -2 Q-6 -9 0 -8 Q8 -9 16 -2" fill="none" stroke="#C9EC98" stroke-width="2.6" stroke-linecap="round"/></g>`;
    const mince = [...Array(26)].map((_, i) => { const x = 62 + (i * 29) % 64, y = 104 + (i * 11) % 30; return `<circle cx="${x}" cy="${y}" r="${2.6 + (i % 3)}" fill="${['#A8643E', '#C47E52', '#8A4A2C'][i % 3]}" ${ow(1.2)}/>`; }).join('');
    return `${shadow(162, 88, 12)}
      <ellipse cx="88" cy="134" rx="80" ry="26" fill="#FFFFFF" ${O}/>
      <ellipse cx="88" cy="134" rx="64" ry="18" fill="none" stroke="#8ED3E8" stroke-width="4"/>
      ${lettuce(42, 128, -20)}${lettuce(54, 144, 10)}
      <path d="M56 130 Q54 102 94 98 Q132 100 132 130 Q94 144 56 130 Z" fill="#B87A50" ${O}/>
      ${mince}
      ${[[70, 112], [90, 106], [108, 118], [120, 108], [80, 126], [100, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#F2DDA8"/>`).join('')}
      ${T.mint(78, 104)}${T.mint(112, 100)}${T.spring(96, 118)}${T.flakes(70, 120)}${T.chilli(120, 120)}
      ${T.lime(100, 146, 8)}
      <g transform="translate(162 104)">
        <path d="M-16 50 L-18 4 Q0 -2 18 4 L16 50 Q0 56 -16 50 Z" fill="#D9A55A" ${O}/>
        ${[14, 24, 34, 44].map((y) => `<path d="M-17 ${y} Q0 ${y + 4} 17 ${y}" fill="none" stroke="#A8722E" stroke-width="2.4"/>`).join('')}
        ${[-10, -2, 6, 13].map((x) => `<path d="M${x} 8 L${x} 50" stroke="#B88440" stroke-width="1.6" opacity=".7"/>`).join('')}
        <path d="M-20 4 Q-20 -18 0 -20 Q20 -18 20 4 Q0 10 -20 4 Z" fill="#E6B86A" ${O}/>
        <path d="M-12 -6 Q0 -14 12 -6" fill="none" stroke="#F6D89A" stroke-width="3" stroke-linecap="round"/>
        <path d="M-8 52 L-14 62 M8 52 L14 62" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      </g>`;
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

  function dish(d) {
    const a = d.art;
    const draw = { bowl: () => bowl(a), plate: () => plate(a), tacos, tagine, banhmi, hotpot, bibimbap, pan, wrap, injera, lasagne: () => lasagne(a), paella, roast, buns, churros, pie, pizza, flatbread, ramekin, empanadas, ceviche, fattoush, koshari, suya, larb, sholehzard, handi, katori }[a.type];
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
