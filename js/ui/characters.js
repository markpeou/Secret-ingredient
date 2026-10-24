/*
 * Kawaii character kit: one shared face system, Pipi the chef, and the ten spices.
 * Every character is an inline SVG string. No external images.
 */
(function (SI) {
  const INK = '#4A2616';
  const CREAM = '#FFF6E6';
  const MOUTH = '#B8323F';
  const TONGUE = '#FF8FA8';
  const CHEEK = '#FF8FB1';
  const O = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const o3 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

  /* ---------- Face kit (drawn around 0,0; about 56 units wide at scale 1) ---------- */

  const HEART = 'M0 4 C-9 -3 -6 -11 0 -6 C6 -11 9 -3 0 4 Z';
  const STAR5 = 'M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3 Z';

  function eye(x, kind, dark) {
    const line = dark ? CREAM : INK;
    const strokeLine = (d) => `<path d="${d}" fill="none" stroke="${line}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    const m = x < 0 ? 1 : -1; // mirror for chevrons
    switch (kind) {
      case 'closed': return strokeLine(`M${x - 6} 2 Q${x} -6 ${x + 6} 2`);
      case 'calm': return strokeLine(`M${x - 6} -1 Q${x} 5 ${x + 6} -1`);
      case 'laugh': return strokeLine(`M${x - 5 * m} -5 L${x + 4 * m} 0 L${x - 5 * m} 5`);
      case 'heart': return `<path d="${HEART}" transform="translate(${x} -1) scale(1.15)" fill="#FF4F86" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="${x - 2.6}" cy="-4" r="1.6" fill="#fff"/>`;
      case 'star': return `<path d="${STAR5}" transform="translate(${x} 0) scale(1.05)" fill="#FFC93C" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="${x - 2}" cy="-2" r="1.3" fill="#fff"/>`;
      case 'smug': return `<path d="M${x - 6.5} -1 A6.5 6.5 0 0 0 ${x + 6.5} -1 Z" fill="${line}"/>` + strokeLine(`M${x - 8} -1.5 L${x + 8} -1.5`) +
        (dark ? `<circle cx="${x}" cy="2" r="2.4" fill="${INK}"/>` : `<circle cx="${x + 2}" cy="1.5" r="1.5" fill="#fff"/>`);
      case 'big':
      case 'up':
      case 'open':
      default: {
        const big = kind === 'big';
        const dy = kind === 'up' ? -2.5 : 0;
        const rx = big ? 7.2 : 6, ry = big ? 9.5 : 8;
        if (dark) {
          return `<ellipse cx="${x}" cy="0" rx="${rx + 1}" ry="${ry + 1}" fill="#fff"/><ellipse cx="${x}" cy="${1 + dy}" rx="${rx - 2}" ry="${ry - 2.5}" fill="${INK}"/><circle cx="${x + 1.8}" cy="${-2 + dy}" r="1.8" fill="#fff"/>`;
        }
        return `<ellipse cx="${x}" cy="0" rx="${rx}" ry="${ry}" fill="${INK}"/>` +
          `<circle cx="${x + 2}" cy="${-3 + dy}" r="${big ? 3.2 : 2.6}" fill="#fff"/><circle cx="${x - 2.2}" cy="${3 + dy}" r="${big ? 1.6 : 1.2}" fill="#fff"/>` +
          (big ? `<circle cx="${x + 3.4}" cy="${2.6}" r="0.9" fill="#fff"/>` : '');
      }
    }
  }

  function mouth(kind, dark) {
    const line = dark ? CREAM : INK;
    const s = `fill="none" stroke="${line}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"`;
    switch (kind) {
      case 'cat': return `<path d="M-6 9 Q-3 13 0 9 Q3 13 6 9" ${s}/>`;
      case 'smile': return `<path d="M-5 9 Q0 14 5 9" ${s}/>`;
      case 'open': return `<path d="M-8 8 Q0 21 8 8 Z" fill="${MOUTH}" stroke="${line}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-4 14 Q0 11 4 14 Q0 17 -4 14 Z" fill="${TONGUE}"/>`;
      case 'o': return `<ellipse cx="0" cy="11" rx="3.6" ry="4.6" fill="${MOUTH}" stroke="${line}" stroke-width="2.4"/>`;
      case 'tongue': return `<path d="M-6 9 Q0 14 6 9" ${s}/><path d="M0.5 11.5 Q0 18 4 17 Q7 15.5 5 10.6" fill="${TONGUE}" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/>`;
      case 'flat': return `<path d="M-3 11 Q0 9.6 3 11" ${s}/>`;
      case 'grin': return `<path d="M-8 8 Q0 18 8 8 Z" fill="${MOUTH}" stroke="${line}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-6.5 8.6 L6.5 8.6 L5.6 10.6 L-5.6 10.6 Z" fill="#fff"/>`;
      case 'smirk': return `<path d="M-5 11 Q1 13.5 7 8" ${s}/>`;
      default: return `<path d="M-5 9 Q0 14 5 9" ${s}/>`;
    }
  }

  const EXPRESSIONS = {
    happy: ['open', 'cat'],
    joy: ['closed', 'open'],
    wow: ['big', 'o'],
    love: ['heart', 'smile'],
    star: ['star', 'open'],
    wink: ['wink', 'tongue'],
    calm: ['calm', 'smile'],
    think: ['up', 'flat'],
    determined: ['open', 'grin'],
    laugh: ['laugh', 'open'],
    smug: ['smug', 'smirk']
  };

  function face(x, y, s, mood = 'happy', opt = {}) {
    const [eyes, m] = EXPRESSIONS[mood] || EXPRESSIONS.happy;
    const dark = !!opt.dark;
    const left = eyes === 'wink' ? eye(-15, 'open', dark) : eye(-15, eyes, dark);
    const right = eyes === 'wink' ? eye(15, 'closed', dark) : eye(15, eyes, dark);
    const brows = mood === 'determined'
      ? `<path d="M-22 -13 L-9 -9 M22 -13 L9 -9" stroke="${dark ? CREAM : INK}" stroke-width="3.2" stroke-linecap="round"/>` : '';
    const lines = (mood === 'love' || opt.blushLines)
      ? `<path d="M-28 6 l2 -3 M-24 6 l2 -3 M-20 6 l2 -3 M20 6 l2 -3 M24 6 l2 -3 M28 6 l2 -3" stroke="#E0457A" stroke-width="1.6" stroke-linecap="round"/>` : '';
    const blinkable = ['open', 'big', 'up', 'wink'].includes(eyes) ? ' blink' : '';
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="-24" cy="8" rx="6.4" ry="3.8" fill="${CHEEK}" opacity="${dark ? 0.9 : 0.8}"/><ellipse cx="24" cy="8" rx="6.4" ry="3.8" fill="${CHEEK}" opacity="${dark ? 0.9 : 0.8}"/>
      ${lines}
      <g class="eyes${blinkable}">${left}${right}</g>
      ${brows}${mouth(m, dark)}
    </g>`;
  }

  /* ---------- Small extras ---------- */
  const sparkle = (x, y, s = 1, c = '#FFC93C') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9 Z" fill="${c}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const heart = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="${HEART}" fill="#FF6F9A" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;

  /* ---------- Pipi ---------- */
  const PIP_POSES = {
    happy: 'down', joy: 'cheer', wow: 'up', love: 'hug', star: 'cheer', wink: 'wave', calm: 'down',
    think: 'chin', determined: 'fist', laugh: 'cheer', smug: 'down', wave: 'wave', cheer: 'cheer'
  };
  const PIP_FACE = { wave: 'happy', cheer: 'joy' };

  function arm(cx, cy, rot) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="9" ry="12" transform="rotate(${rot} ${cx} ${cy})" fill="#FFE4CC" ${O}/>`;
  }

  function pipArms(pose) {
    switch (pose) {
      case 'cheer': return arm(20, 72, -28) + arm(120, 72, 28);
      case 'up': return arm(18, 84, -50) + arm(122, 84, 50);
      case 'wave': return arm(24, 108, 25) + `<g class="pip-wave">${arm(122, 70, 20)}</g>`;
      case 'hug': return `<circle cx="36" cy="110" r="9.5" fill="#FFE4CC" ${O}/><circle cx="104" cy="110" r="9.5" fill="#FFE4CC" ${O}/>`;
      case 'chin': return arm(24, 108, 25) + arm(96, 120, -35);
      case 'fist': return arm(24, 106, 25) + `<circle cx="118" cy="84" r="10" fill="#FFE4CC" ${O}/>`;
      default: return arm(24, 108, 25) + arm(116, 108, -25);
    }
  }

  function pipExtras(mood) {
    switch (mood) {
      case 'star': case 'joy': case 'cheer': return sparkle(16, 42, 1.1) + sparkle(126, 34, 0.9, '#FFF') + sparkle(130, 118, 0.7);
      case 'wow': return `<path d="M124 20 L120 44" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="118" cy="54" r="3" fill="${INK}"/>` + sparkle(16, 50, 0.8);
      case 'love': return heart(16, 46, 1.1) + heart(126, 30, 0.9) + heart(132, 64, 0.6);
      case 'think': return `<text x="114" y="46" font-family="Fredoka, Arial Rounded MT Bold, sans-serif" font-weight="700" font-size="28" fill="${INK}">?</text>`;
      case 'calm': return `<text x="108" y="44" font-family="Fredoka, Arial Rounded MT Bold, sans-serif" font-weight="700" font-size="18" fill="#7FB3D5" stroke="${INK}" stroke-width="1">z</text><text x="120" y="30" font-family="Fredoka, Arial Rounded MT Bold, sans-serif" font-weight="700" font-size="13" fill="#7FB3D5" stroke="${INK}" stroke-width="1">z</text>`;
      case 'determined': return `<path d="M112 52 q6 8 0 12 q-6 -4 0 -12 Z" fill="#8ED3E8" stroke="${INK}" stroke-width="2"/>` + `<path d="M8 76 l10 -4 M6 88 l12 0" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      case 'laugh': return sparkle(18, 50, 0.8, '#FFF') + sparkle(124, 42, 0.9);
      case 'wink': return sparkle(18, 46, 0.8);
      default: return '';
    }
  }

  function pip(mood = 'happy') {
    const pose = PIP_POSES[mood] || 'down';
    const expression = PIP_FACE[mood] || mood;
    return `<svg class="pip" viewBox="0 0 140 150" role="img" aria-label="Pipi, your host" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="145" rx="36" ry="5" fill="${INK}" opacity=".15"/>
      <ellipse cx="54" cy="137" rx="11" ry="6.5" fill="#FFE4CC" ${O}/><ellipse cx="86" cy="137" rx="11" ry="6.5" fill="#FFE4CC" ${O}/>
      ${pose === 'hug' ? '' : pipArms(pose)}
      <path d="M70 52 C108 52 122 78 120 104 C118 130 98 139 70 139 C42 139 22 130 20 104 C18 78 32 52 70 52 Z" fill="#FFE4CC" ${O}/>
      <ellipse cx="42" cy="76" rx="9" ry="5.5" transform="rotate(-25 42 76)" fill="#FFFFFF" opacity=".75"/>
      ${face(70, 98, 1.18, expression)}
      ${pose === 'hug' ? pipArms(pose) : ''}
      <g class="pip-hat" transform="rotate(-7 70 44)">
        <path d="M38 46 C20 36 28 8 50 14 C54 -2 86 -2 90 14 C112 8 120 36 102 46 Z" fill="#FFFFFF" ${O}/>
        <path d="M56 18 Q60 30 58 42 M84 18 Q80 30 82 42" fill="none" stroke="#E7DCD2" stroke-width="3" stroke-linecap="round"/>
        <rect x="40" y="40" width="60" height="18" rx="7" fill="#FFFFFF" ${O}/>
        <path d="${HEART}" transform="translate(70 49) scale(0.85)" fill="#FF6F9A" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      </g>
      ${pipExtras(mood)}
    </svg>`;
  }

  /* ---------- Spices (viewBox 0 0 100 100) ---------- */

  // Outline several overlapping shapes as one blob: thick ink pass, then the fill pass.
  function blob(shapes, fill) {
    return shapes.map((s) => `${s} fill="${INK}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`).join('') +
      shapes.map((s) => `${s} fill="${fill}"/>`).join('');
  }
  const seed = (cx, cy, h, w, rot) => `<path transform="translate(${cx} ${cy}) rotate(${rot})" d="M0 ${-h} C${w} ${-h * 0.6} ${w} ${h * 0.6} 0 ${h} C${-w} ${h * 0.6} ${-w} ${-h * 0.6} 0 ${-h} Z"`;

  const SPICE_DRAW = {
    chilli: (mood) => `
      <path d="M66 20 Q66 8 80 6" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M66 20 Q66 8 80 6" fill="none" stroke="#58A845" stroke-width="4" stroke-linecap="round"/>
      <path d="M64 26 C88 28 92 54 80 68 C68 86 40 95 12 90 C32 80 45 70 49 54 C52 40 52 28 64 26 Z" fill="#E2362E" ${O}/>
      <path d="M74 36 C81 41 83 50 80 58" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".65"/>
      <path d="M52 30 C52 20 76 18 80 30 C72 35 60 35 52 30 Z" fill="#58A845" ${o3}/>
      ${face(64, 52, 0.56, mood)}`,

    ginger: (mood) => `
      <path d="M50 26 Q44 10 56 3 Q62 17 50 26 Z" fill="#7CC45A" ${o3}/>
      ${blob(['<ellipse cx="50" cy="62" rx="38" ry="25"', '<circle cx="20" cy="44" r="13"', '<circle cx="50" cy="36" r="14"', '<circle cx="82" cy="44" r="12"'], '#ECC27A')}
      <path d="M16 40 q4 4 0 8 M84 40 q-4 4 0 8 M28 76 q5 -3 10 0 M66 78 q5 -3 10 0" fill="none" stroke="#C48A3A" stroke-width="2.6" stroke-linecap="round"/>
      ${face(52, 63, 0.62, mood)}`,

    cardamom: (mood) => `
      <path d="M50 8 L50 1" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 8 C77 20 83 66 50 93 C17 66 23 20 50 8 Z" fill="#8DBB5A" ${O}/>
      <path d="M37 25 C30 45 32 68 42 82 M63 25 C70 45 68 68 58 82" fill="none" stroke="#5E8A3E" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="40" cy="30" rx="4" ry="8" transform="rotate(20 40 30)" fill="#FFFFFF" opacity=".55"/>
      ${face(50, 57, 0.6, mood)}`,

    pinkpepper: (mood) => `
      <path d="M50 38 Q50 20 64 12" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M50 38 Q50 20 64 12" fill="none" stroke="#9A6A45" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="26" cy="38" r="15" fill="#F49BBB" ${O}/>${face(26, 40, 0.3, 'happy')}
      <circle cx="74" cy="34" r="14" fill="#F49BBB" ${O}/>${face(74, 36, 0.28, 'joy')}
      <circle cx="50" cy="64" r="28" fill="#F07FA6" ${O}/>
      <ellipse cx="38" cy="50" rx="6" ry="4" transform="rotate(-30 38 50)" fill="#FFFFFF" opacity=".7"/>
      ${face(50, 66, 0.68, mood)}`,

    blackpepper: (mood) => `
      <circle cx="50" cy="56" r="35" fill="#4A3F3A" ${O}/>
      <path d="M22 44 Q32 38 28 28 M72 26 Q66 38 80 42 M26 76 Q36 70 32 62 M70 84 Q72 74 82 72" fill="none" stroke="#7A6D66" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M30 34 Q38 26 48 25" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".35"/>
      ${face(50, 60, 0.7, mood, { dark: true })}`,

    cinnamon: (mood) => `
      <g transform="rotate(14 50 50)">
        <rect x="56" y="14" width="26" height="76" rx="11" fill="#8E4A22" ${O}/>
        <ellipse cx="69" cy="16" rx="13" ry="6" fill="#C77A44" ${o3}/><path d="M63 16 a6 3 0 1 1 12 0 a3.5 1.8 0 1 1 -7 0" fill="none" stroke="#6E3414" stroke-width="2"/>
      </g>
      <rect x="18" y="18" width="50" height="74" rx="15" fill="#A85A2A" ${O}/>
      <path d="M28 34 L28 80 M58 34 L58 80" stroke="#8E4A22" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="43" cy="20" rx="25" ry="9" fill="#D08A52" ${O}/>
      <path d="M31 20 a12 5 0 1 1 24 0 a8 3.4 0 1 1 -16 0 a4 1.8 0 1 1 8 0" fill="none" stroke="#7A3A16" stroke-width="2.2"/>
      <rect x="16" y="72" width="54" height="9" rx="4" fill="#FF6F9A" ${o3}/>
      <path d="M43 76 C33 66 27 84 43 77 C59 84 53 66 43 76 Z" fill="#FF6F9A" ${o3}/>
      ${face(43, 50, 0.66, mood)}`,

    staranise: (mood) => {
      const pods = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<ellipse cx="50" cy="26" rx="10" ry="22" transform="rotate(${k * 45} 50 52)"`);
      const seeds = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<ellipse cx="50" cy="16" rx="3.6" ry="5.4" transform="rotate(${k * 45} 50 52)" fill="#E2B072" stroke="${INK}" stroke-width="1.6"/>`).join('');
      return `${blob(pods.concat(['<circle cx="50" cy="52" r="22"']), '#8A4E2C')}
        ${seeds}
        <circle cx="50" cy="52" r="21" fill="#A0603A"/>
        ${sparkle(88, 12, 0.6)}${sparkle(10, 88, 0.5, '#FFF')}
        ${face(50, 52, 0.52, mood)}`;
    },

    cumin: (mood) => `
      ${seed(24, 68, 19, 8, -38)} fill="#A9884C" ${O}/>
      ${seed(77, 68, 18, 7.5, 38)} fill="#A9884C" ${O}/>
      <path d="M50 14 L50 5" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      ${seed(50, 54, 40, 21, 0)} fill="#C29A56" ${O}/>
      <path d="M38 26 Q32 54 38 82 M62 26 Q68 54 62 82" fill="none" stroke="#8C6A2F" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M50 94 L50 99" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      ${face(50, 57, 0.58, mood)}`,

    turmeric: (mood) => `
      ${blob(['<ellipse cx="50" cy="62" rx="36" ry="23"', '<ellipse cx="76" cy="36" rx="11" ry="20" transform="rotate(35 76 36)"', '<circle cx="22" cy="50" r="13"'], '#D9862B')}
      <ellipse cx="15" cy="54" rx="8" ry="10" fill="#FFB400" ${o3}/><ellipse cx="15" cy="54" rx="4" ry="5" fill="#FFD45C"/>
      <path d="M36 44 q-4 8 0 15 M70 50 q-4 8 0 15 M58 80 q6 -3 12 0" fill="none" stroke="#A9601C" stroke-width="2.6" stroke-linecap="round"/>
      ${sparkle(88, 76, 0.55)}
      ${face(52, 64, 0.6, mood)}`,

    saffron: (mood) => `
      <path d="M50 70 L50 97" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M50 70 L50 97" stroke="#58A845" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 92 Q36 90 30 78 Q44 78 50 92 Z" fill="#7CC45A" ${o3}/>
      <path d="M30 38 C33 14 46 14 50 32 C54 14 67 14 70 38" fill="#B993E0" ${O}/>
      ${['M46 34 Q38 16 30 8', 'M50 34 Q50 14 50 3', 'M54 34 Q62 16 70 8'].map((d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#D8342B" stroke-width="3.6" stroke-linecap="round"/>`).join('')}
      <circle cx="30" cy="8" r="3.4" fill="#FF9A3C" stroke="${INK}" stroke-width="2"/><circle cx="50" cy="3" r="3.4" fill="#FF9A3C" stroke="${INK}" stroke-width="2"/><circle cx="70" cy="8" r="3.4" fill="#FF9A3C" stroke="${INK}" stroke-width="2"/>
      <path d="M18 36 C16 78 84 78 82 36 C74 44 64 28 50 38 C36 28 26 44 18 36 Z" fill="#9B6BC9" ${O}/>
      <path d="M50 40 L50 70" stroke="#7E4FAE" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
      ${face(50, 54, 0.58, mood)}`,

    coriander: (mood) => {
      const ribs = (cx, cy, r) => `<path d="M${cx - r * 0.55} ${cy - r * 0.8} Q${cx - r * 0.85} ${cy} ${cx - r * 0.55} ${cy + r * 0.8} M${cx + r * 0.55} ${cy - r * 0.8} Q${cx + r * 0.85} ${cy} ${cx + r * 0.55} ${cy + r * 0.8}" fill="none" stroke="#A8864A" stroke-width="2.2" stroke-linecap="round"/>`;
      return `
      <circle cx="22" cy="74" r="12" fill="#D8B878" ${O}/>${ribs(22, 74, 12)}
      <circle cx="80" cy="76" r="11" fill="#D8B878" ${O}/>${ribs(80, 76, 11)}
      <path d="M50 22 L50 12" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="52" r="30" fill="#E2C48A" ${O}/>${ribs(50, 52, 30)}
      <ellipse cx="38" cy="36" rx="6" ry="4" transform="rotate(-30 38 36)" fill="#FFFFFF" opacity=".6"/>
      ${face(50, 56, 0.6, mood)}`;
    },

    fennel: (mood) => `
      <g transform="rotate(-28 50 54)">
        <ellipse cx="50" cy="54" rx="12" ry="34" fill="#A9C27A" ${O}/>
        <path d="M45 24 Q42 54 45 84 M55 24 Q58 54 55 84" fill="none" stroke="#7FA04E" stroke-width="2.2" stroke-linecap="round"/>
      </g>
      <g transform="rotate(14 56 52)">
        <ellipse cx="56" cy="52" rx="20" ry="40" fill="#BFD68E" ${O}/>
        <path d="M44 20 Q38 52 44 86 M68 20 Q74 52 68 86" fill="none" stroke="#7FA04E" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M56 12 L56 4" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      </g>
      ${face(57, 55, 0.56, mood)}`,

    fenugreek: (mood) => `
      <path d="M14 76 Q12 66 22 64 L30 66 Q36 70 32 78 Q26 84 18 82 Z" fill="#E0B24A" ${o3}/>
      <path d="M74 20 Q76 12 86 14 L90 22 Q92 30 84 32 Q76 32 74 26 Z" fill="#E0B24A" ${o3}/>
      <path d="M26 34 Q24 18 42 18 L64 20 Q82 22 80 40 L78 68 Q76 88 56 88 L38 86 Q22 84 24 66 Z" fill="#E7B84C" ${O}/>
      <path d="M30 30 Q40 42 36 56" fill="none" stroke="#B8862A" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="40" cy="26" rx="7" ry="3.5" fill="#FFFFFF" opacity=".55"/>
      ${face(53, 56, 0.6, mood)}`,

    mustard: (mood) => `
      <path d="M8 30 l-6 -4 M10 20 l-4 -7 M90 30 l7 -4 M88 20 l5 -7" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="20" cy="34" r="8" fill="#C9A23A" ${o3}/><circle cx="82" cy="32" r="9" fill="#F2D44A" ${o3}/>
      <circle cx="86" cy="76" r="7" fill="#F2D44A" ${o3}/><circle cx="14" cy="76" r="7.5" fill="#8C5A2A" ${o3}/>
      <circle cx="50" cy="58" r="31" fill="#F6DA55" ${O}/>
      <ellipse cx="38" cy="42" rx="8" ry="5" transform="rotate(-30 38 42)" fill="#FFFFFF" opacity=".7"/>
      ${face(50, 60, 0.66, mood)}`,

    nutmeg: (mood) => `
      <ellipse cx="50" cy="56" rx="31" ry="37" fill="#A06A44" ${O}/>
      <path d="M28 40 Q36 46 32 56 M70 36 Q62 44 68 52 M30 72 Q38 70 40 80 M72 70 Q64 72 62 82" fill="none" stroke="#C48B5E" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M30 24 Q40 34 36 46 M40 20 Q50 30 46 42 Q56 30 62 22 M54 40 Q64 34 72 30" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <path d="M30 24 Q40 34 36 46 M40 20 Q50 30 46 42 Q56 30 62 22 M54 40 Q64 34 72 30" fill="none" stroke="#D8342B" stroke-width="3" stroke-linecap="round"/>
      ${face(50, 62, 0.62, mood)}`,

    sesame: (mood) => {
      const drop = (cx, cy, s, rot, fill) => `<path transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})" d="M0 -36 C18 -16 24 6 18 22 C12 38 -12 38 -18 22 C-24 6 -18 -16 0 -36 Z" fill="${fill}" ${O}/>`;
      return `${drop(20, 66, 0.42, -30, '#2E2826')}${drop(82, 62, 0.45, 28, '#F3E7C6')}
        ${drop(50, 56, 1, 0, '#F6EBCB')}
        <path d="M50 24 Q46 40 48 50" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".8"/>
        ${face(50, 64, 0.6, mood)}`;
    },

    caraway: (mood) => `
      <path d="M16 46 Q26 62 20 82" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M16 46 Q26 62 20 82" fill="none" stroke="#7A6E48" stroke-width="6" stroke-linecap="round"/>
      <path d="M86 42 Q76 60 84 80" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M86 42 Q76 60 84 80" fill="none" stroke="#7A6E48" stroke-width="6" stroke-linecap="round"/>
      <path d="M40 22 Q66 48 48 80" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>
      <path d="M40 22 Q66 48 48 80" fill="none" stroke="#8C8058" stroke-width="32" stroke-linecap="round"/>
      <path d="M33 22 Q56 48 38 78 M48 18 Q74 46 58 80" fill="none" stroke="#B3A678" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M38 4 L40 10" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      ${face(51, 52, 0.5, mood)}`,

    allspice: (mood) => `
      <circle cx="50" cy="58" r="33" fill="#9A5640" ${O}/>
      <path d="M40 26 L44 18 L50 24 L56 18 L60 26" fill="#6B3A2A" ${o3}/>
      ${[[28, 46], [72, 44], [26, 70], [74, 72], [50, 88], [40, 34], [62, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#C98468"/>`).join('')}
      <ellipse cx="36" cy="40" rx="7" ry="4" transform="rotate(-30 36 40)" fill="#FFFFFF" opacity=".45"/>
      ${face(50, 60, 0.66, mood)}`,

    paprika: (mood) => `
      <path d="M50 24 Q50 12 60 8" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M50 24 Q50 12 60 8" fill="none" stroke="#58A845" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 28 C78 20 92 42 88 64 C84 88 64 95 50 90 C36 95 16 88 12 64 C8 42 22 20 50 28 Z" fill="#E04A2E" ${O}/>
      <path d="M50 30 Q46 60 50 88" fill="none" stroke="#B8321F" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M38 28 C42 22 58 22 62 28 C56 32 44 32 38 28 Z" fill="#58A845" ${o3}/>
      <path d="M24 44 Q22 56 26 66" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      ${sparkle(88, 18, 0.55)}
      ${face(50, 60, 0.64, mood)}`,

    vanilla: (mood) => {
      const petal = (rot) => `<ellipse cx="50" cy="20" rx="11" ry="19" transform="rotate(${rot} 50 40)" fill="#FFF4D0" ${O}/>`;
      return `
      <path d="M40 58 Q30 80 16 96" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M40 58 Q30 80 16 96" fill="none" stroke="#4A3226" stroke-width="8" stroke-linecap="round"/>
      <path d="M58 58 Q70 80 86 94" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M58 58 Q70 80 86 94" fill="none" stroke="#5A3E2E" stroke-width="6" stroke-linecap="round"/>
      ${[0, 72, 144, 216, 288].map(petal).join('')}
      <circle cx="50" cy="40" r="20" fill="#FFE9A8" ${O}/>
      ${face(50, 41, 0.5, mood)}`;
    },

    tamarind: (mood) => `
      ${blob(['<circle cx="20" cy="66" r="14"', '<circle cx="46" cy="56" r="20"', '<circle cx="76" cy="44" r="15"'], '#B98252')}
      <path d="M86 38 Q92 30 90 22" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M8 70 Q4 74 10 80 Q16 86 22 80" fill="#6B3A20" ${o3}/>
      <ellipse cx="11" cy="76" rx="3" ry="2" fill="#2E1A10"/>
      <path d="M30 50 q3 6 0 12 M64 40 q-3 6 0 12" fill="none" stroke="#8A5A3C" stroke-width="2.4" stroke-linecap="round"/>
      ${face(46, 58, 0.52, mood)}`,

    sichuan: (mood) => {
      const husk = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#B84040" ${O}/><path d="M${cx - r * 0.5} ${cy - r * 0.7} Q${cx} ${cy - r * 0.2} ${cx + r * 0.5} ${cy - r * 0.7}" fill="#2E2220" stroke="${INK}" stroke-width="2"/>
        ${[[-0.4, 0.2], [0.3, 0.4], [0, -0.1], [0.5, -0.1], [-0.3, 0.6]].map(([dx, dy]) => `<circle cx="${cx + dx * r}" cy="${cy + dy * r}" r="1.4" fill="#D97070"/>`).join('')}`;
      return `
      <path d="M50 40 Q44 22 30 14 M50 40 Q60 24 76 18" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M50 40 Q44 22 30 14 M50 40 Q60 24 76 18" fill="none" stroke="#7A5A3A" stroke-width="3.4" stroke-linecap="round"/>
      ${husk(24, 18, 10)}${husk(78, 22, 11)}
      <circle cx="50" cy="64" r="28" fill="#C24848" ${O}/>
      <path d="M36 42 Q50 52 64 42" fill="#2E2220" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      ${[[30, 62], [70, 60], [36, 80], [66, 82], [50, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#E08080"/>`).join('')}
      <path d="M14 46 l-6 -2 M16 56 l-7 2 M86 50 l7 -2 M84 60 l7 2" stroke="#FFC93C" stroke-width="2.6" stroke-linecap="round"/>
      ${face(50, 66, 0.62, mood)}`;
    },

    sumac: (mood) => `
      <path d="M50 8 L50 2" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 8 C72 28 84 58 74 82 C66 96 34 96 26 82 C16 58 28 28 50 8 Z" fill="#A8324F" ${O}/>
      ${[[40, 24], [60, 26], [32, 40], [68, 42], [26, 58], [74, 60], [30, 76], [70, 78], [50, 90], [42, 34], [58, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#C2466A" stroke="#7E1F3A" stroke-width="1.6"/>`).join('')}
      ${face(50, 60, 0.6, mood)}`,

    cloves: (mood) => {
      const clove = (tx, ty, rot, s, m, faceOn) => `<g transform="translate(${tx} ${ty}) rotate(${rot}) scale(${s})">
        <path d="M-7 14 L-4 70 Q0 78 4 70 L7 14 Z" fill="#6B3E24" ${O}/>
        <path d="M-12 14 L-16 2 L-6 6 L0 -4 L6 6 L16 2 L12 14 Z" fill="#7A4A2A" ${O}/>
        <circle cx="0" cy="-6" r="17" fill="#9A5A34" ${O}/>
        <path d="M-6 -16 Q0 -20 6 -16" fill="none" stroke="#C48050" stroke-width="2.4" stroke-linecap="round"/>
        ${faceOn ? face(0, -4, 0.42, m) : ''}</g>`;
      return `${clove(76, 30, 22, 0.62, 'happy', false)}${clove(46, 30, -6, 1, mood, true)}`;
    },

    lavender: (mood) => {
      const spike = (x1, y1, x2, y2, n) => {
        let out = `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#6CA84A" stroke-width="3" stroke-linecap="round"/>`;
        for (let i = 0; i < n; i++) {
          const t = i / n, x = x2 + (x1 - x2) * t * 0.45, y = y2 + (y1 - y2) * t * 0.45;
          out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="3.6" fill="#A98ED6" stroke="${INK}" stroke-width="1.8"/>`;
        }
        return out;
      };
      return `${spike(40, 92, 16, 14, 6)}${spike(60, 92, 86, 16, 6)}
        <path d="M50 92 L50 50" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M50 92 L50 50" stroke="#6CA84A" stroke-width="3.6" stroke-linecap="round"/>
        <ellipse cx="50" cy="38" rx="21" ry="30" fill="#9C82C9" ${O}/>
        ${[[38, 20], [50, 14], [62, 20], [36, 38], [64, 38], [40, 56], [60, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="3.2" fill="#B8A2E2"/>`).join('')}
        <path d="M38 80 L62 80 L58 88 L42 88 Z" fill="#FFC93C" ${o3}/>
        ${face(50, 40, 0.5, mood)}`;
    },

    galangal: (mood) => `
      ${blob(['<ellipse cx="46" cy="60" rx="36" ry="21"', '<ellipse cx="78" cy="40" rx="12" ry="19" transform="rotate(30 78 40)"'], '#F0C9B8')}
      <path d="M28 46 q-4 7 0 14 q4 7 0 14 M50 42 q-4 9 0 18 q4 8 0 14 M70 48 q-3 6 0 12" fill="none" stroke="#C98A80" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M84 24 q4 -6 10 -6" fill="none" stroke="#E06A90" stroke-width="4" stroke-linecap="round"/>
      <circle cx="16" cy="82" r="11" fill="#FFF0D8" ${o3}/><circle cx="16" cy="82" r="6" fill="none" stroke="#E7C9A0" stroke-width="2"/>
      ${face(46, 62, 0.6, mood)}`
  };

  const SPICE_MOOD = {
    chilli: 'determined', ginger: 'joy', cardamom: 'think', pinkpepper: 'wink', blackpepper: 'smug',
    cinnamon: 'love', staranise: 'smug', cumin: 'happy', turmeric: 'star', saffron: 'wow',
    coriander: 'happy', fennel: 'calm', fenugreek: 'smug', mustard: 'laugh', nutmeg: 'happy',
    sesame: 'joy', caraway: 'calm', allspice: 'wink', paprika: 'star', vanilla: 'love',
    tamarind: 'laugh', sichuan: 'wow', sumac: 'smug', cloves: 'determined', lavender: 'calm', galangal: 'determined'
  };

  function spice(id, mood) {
    const draw = SPICE_DRAW[id];
    if (!draw) return '';
    return `<svg class="spice-char" viewBox="0 0 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${draw(mood || SPICE_MOOD[id])}</svg>`;
  }

  /* Flag emoji render as plain letters on some systems (notably Windows). Detect once:
     a real flag has colour, a letter fallback doesn't. */
  let flagSupport = null;
  function flagsSupported() {
    if (flagSupport !== null) return flagSupport;
    try {
      const c = document.createElement('canvas'); c.width = c.height = 24;
      const g = c.getContext('2d'); g.textBaseline = 'top'; g.font = '20px sans-serif'; g.fillText('\u{1F1EB}\u{1F1F7}', 0, 0);
      const d = g.getImageData(0, 0, 24, 24).data;
      flagSupport = false;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] && (Math.abs(d[i] - d[i + 1]) > 30 || Math.abs(d[i + 1] - d[i + 2]) > 30)) { flagSupport = true; break; }
    } catch (e) { flagSupport = false; }
    return flagSupport;
  }
  SI.flags = { supported: flagsSupported };

  SI.chars = { face, pip, spice, SPICE_MOOD, EXPRESSIONS };
})(globalThis.SI = globalThis.SI || {});
