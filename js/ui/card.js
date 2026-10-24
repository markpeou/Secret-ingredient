/*
 * Collectible result card, two-sided, drawn on canvases so each side can be saved and
 * shared as a PNG.
 *
 *   Front – the player's traits: name + Heat, art window, strengths, weakness, resists,
 *           recharges with, clicks with, one signature move, flavour text, set number.
 *   Back  – the full recipe: every spice in the blend with its share, role, family
 *           and what it says about the player, then the flavour profile.
 *
 * Text uses the page's loaded fonts; illustrations are the same inline SVGs as the UI.
 */
(function (SI) {
  const W = 750, H = 1050;
  const INK = '#3B1E12', INK_SOFT = '#6A4535', PAPER = '#FFFDF7', PINK = '#C8285E', PINK_DEEP = '#9C1A45', MINT = '#C7EDCF';
  const DISPLAY = '"Fredoka", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
  const BODY = '"Nunito", "Segoe UI", system-ui, sans-serif';

  function mix(a, b, t) {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const [x, y] = [p(a), p(b)];
    return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }

  function svgImage(svg, w, h) {
    const sized = svg.replace('<svg ', `<svg width="${w}" height="${h}" `);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not draw illustration'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sized);
    });
  }

  async function fontsReady() {
    if (!document.fonts || !document.fonts.load) return;
    const wanted = ['700 40px Fredoka', '600 30px Fredoka', '800 20px Nunito', '700 20px Nunito'];
    try {
      await Promise.race([Promise.all(wanted.map((f) => document.fonts.load(f))), new Promise((r) => setTimeout(r, 1500))]);
    } catch (e) { /* fall back to system fonts */ }
  }

  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function font(g, weight, size, family, style = '') { g.font = `${style} ${weight} ${size}px ${family}`.trim(); }

  function fitText(g, text, maxW, weight, size, family, min = 14) {
    let s = size;
    font(g, weight, s, family);
    while (g.measureText(text).width > maxW && s > min) { s -= 1; font(g, weight, s, family); }
    return s;
  }

  function lines(g, text, maxW) {
    const out = [];
    let line = '';
    text.split(' ').forEach((w) => {
      const test = line ? line + ' ' + w : w;
      if (g.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test;
    });
    if (line) out.push(line);
    return out;
  }

  // Wraps text into at most maxLines, shrinking the font a little before resorting to an ellipsis.
  function wrap(g, text, x, y, maxW, lineH, maxLines, weight = 700, size = 19, min = 15) {
    let s = size, ls;
    do { font(g, weight, s, BODY); ls = lines(g, text, maxW); s -= 1; } while (ls.length > maxLines && s >= min);
    if (ls.length > maxLines) {
      ls.length = maxLines;
      let last = ls[maxLines - 1];
      while (g.measureText(last + '…').width > maxW && last.length) last = last.slice(0, -1);
      ls[maxLines - 1] = last.replace(/[ ,.]+$/, '') + '…';
    }
    ls.forEach((l, i) => g.fillText(l, x, y + i * lineH));
    return ls.length;
  }

  function gingham(g, x, y, w, h, size, colour, alpha) {
    g.save();
    g.globalAlpha = alpha;
    g.fillStyle = colour;
    for (let i = 0; i * size < w; i += 2) g.fillRect(x + i * size, y, size, h);
    for (let j = 0; j * size < h; j += 2) g.fillRect(x, y + j * size, w, size);
    g.restore();
  }

  function starPath(g, cx, cy, r) {
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * 0.45 : r;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      g[i ? 'lineTo' : 'moveTo'](cx + rad * Math.cos(a), cy + rad * Math.sin(a));
    }
    g.closePath();
  }

  function flame(g, cx, cy, s) {
    g.save();
    g.translate(cx, cy); g.scale(s, s);
    g.beginPath();
    g.moveTo(0, -14); g.bezierCurveTo(10, -4, 12, 4, 8, 10); g.bezierCurveTo(4, 15, -4, 15, -8, 10);
    g.bezierCurveTo(-12, 4, -8, -2, -4, -4); g.bezierCurveTo(-4, 0, -2, 2, 0, 2); g.bezierCurveTo(2, -4, -2, -8, 0, -14);
    g.closePath();
    g.fillStyle = '#FF7A2E'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
    g.restore();
  }

  function frame(g, colour) {
    rr(g, 0, 0, W, H, 42); g.fillStyle = INK; g.fill();
    rr(g, 10, 10, W - 20, H - 20, 34); g.fillStyle = mix(colour, '#FFFFFF', 0.55); g.fill();
    g.save(); rr(g, 10, 10, W - 20, H - 20, 34); g.clip(); gingham(g, 10, 10, W - 20, H - 20, 26, '#FFFFFF', 0.28); g.restore();
    rr(g, 26, 26, W - 52, H - 52, 24); g.fillStyle = PAPER; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke();
  }

  function pill(g, text, x, y, fill = PINK) {
    font(g, 600, 15, DISPLAY);
    if ('letterSpacing' in g) g.letterSpacing = '1.5px';
    const pw = g.measureText(text).width + 26;
    rr(g, x, y, pw, 26, 13); g.fillStyle = fill; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.fillText(text, x + 13, y + 19);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    return pw;
  }

  function spiceBadge(g, img, colour, cx, cy, r) {
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = colour; g.fill(); g.lineWidth = Math.max(2.5, r / 8); g.strokeStyle = INK; g.stroke();
    g.beginPath(); g.arc(cx, cy, r * 0.78, 0, Math.PI * 2); g.fillStyle = '#FFFFFF'; g.fill(); g.lineWidth = 2; g.stroke();
    g.drawImage(img, cx - r * 0.72, cy - r * 0.72, r * 1.44, r * 1.44);
  }

  // Segmented gauge. With icons, each slice shows the spice and its share.
  function gauge(g, blend, imgFor, x, y, w, h, withIcons) {
    const n = blend.length;
    g.save(); rr(g, x, y, w, h, h / 2.4); g.clip();
    let cx = x;
    blend.forEach((b, i) => {
      const sw = i === n - 1 ? x + w - cx : Math.round((w * b.pct) / 100);
      g.fillStyle = b.spice.colour; g.fillRect(cx, y, sw, h);
      if (i) { g.fillStyle = INK; g.fillRect(cx - 1.5, y, 3, h); }
      g.textAlign = 'center'; g.fillStyle = b.spice.text;
      if (withIcons) {
        const s = Math.min(30, sw - 14);
        g.beginPath(); g.arc(cx + sw / 2, y + 19, s / 2 + 2, 0, Math.PI * 2); g.fillStyle = '#FFFFFF'; g.fill();
        g.drawImage(imgFor(b.spice.id), cx + sw / 2 - s / 2, y + 19 - s / 2, s, s);
        font(g, 700, 16, DISPLAY); g.fillStyle = b.spice.text; g.fillText(b.pct + '%', cx + sw / 2, y + h - 9);
      } else {
        font(g, 700, Math.min(17, h - 8), DISPLAY); g.fillText(b.pct + '%', cx + sw / 2, y + h / 2 + 6);
      }
      cx += sw;
    });
    g.textAlign = 'left'; g.restore();
    rr(g, x, y, w, h, h / 2.4); g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
  }

  function footer(g, card, label) {
    font(g, 800, 13, BODY); g.fillStyle = INK_SOFT; g.textAlign = 'left';
    g.fillText(label, 52, 1014);
    font(g, 600, 15, DISPLAY); g.fillStyle = PINK; g.textAlign = 'center';
    g.fillText('The Secret Ingredient', W / 2, 1015);
    font(g, 800, 13, BODY); g.fillStyle = INK_SOFT; g.textAlign = 'right';
    const num = `No. ${String(card.number).padStart(2, '0')}/${card.total}`;
    g.fillText(num, W - 52 - (card.rarity * 16 + 6), 1014);
    for (let k = 0; k < card.rarity; k++) {
      starPath(g, W - 60 - k * 16, 1009, 7); g.fillStyle = '#FFC93C'; g.fill(); g.lineWidth = 1.6; g.strokeStyle = INK; g.stroke();
    }
    g.textAlign = 'left';
  }

  function newCanvas() {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.textBaseline = 'alphabetic';
    return [c, g];
  }

  /* ---------- Front ---------- */
  function drawFront(result, imgs) {
    const { blend, dish, text } = result;
    const card = text.card;
    const top = blend[0].spice;
    const [c, g] = newCanvas();
    frame(g, top.colour);

    const pillW = pill(g, 'SIGNATURE DISH', 46, 40);
    const badgeX = W - 78, badgeY = 82;
    spiceBadge(g, imgs.spice(top.id), top.colour, badgeX, badgeY, 32);
    font(g, 700, 44, DISPLAY);
    const heatStr = String(card.heat);
    const numW = g.measureText(heatStr).width;
    const numRight = badgeX - 44;
    g.fillStyle = INK; g.textAlign = 'right'; g.fillText(heatStr, numRight, 104);
    font(g, 800, 15, BODY); g.fillStyle = INK_SOFT; g.fillText('HEAT', numRight - numW - 30, 100);
    flame(g, numRight - numW - 14, 92, 0.9);
    g.textAlign = 'left';
    // "Dish – Country": the origin sits beside the name in a lighter, smaller weight.
    // Long names keep their size and the origin moves up beside the Signature dish tag.
    font(g, 800, 15, BODY);
    const maxW = numRight - numW - 30 - g.measureText('HEAT').width - 18 - 48;
    const flagTxt = SI.flags.supported() && dish.flag ? dish.flag + ' ' : '';
    const origin = ' – ' + flagTxt + dish.origin;
    let ns = 48, os;
    const measure = () => {
      os = Math.round(ns * 0.56);
      font(g, 700, ns, DISPLAY); const w1 = g.measureText(dish.name).width;
      font(g, 600, os, DISPLAY); const w2 = g.measureText(origin).width;
      return w1 + w2;
    };
    while (measure() > maxW && ns > 34) ns -= 1;
    if (measure() <= maxW) {
      const nameY = 112 - (48 - ns) * 0.25;
      font(g, 700, ns, DISPLAY); g.fillStyle = INK; g.fillText(dish.name, 48, nameY);
      const nw = g.measureText(dish.name).width;
      font(g, 600, os, DISPLAY); g.fillStyle = PINK_DEEP; g.fillText(origin, 48 + nw, nameY);
    } else {
      const size = fitText(g, dish.name, maxW, 700, 44, DISPLAY, 22);
      g.fillStyle = INK; g.fillText(dish.name, 48, 112 - (44 - size) * 0.25);
      fitText(g, flagTxt + dish.origin, numRight - numW - 90 - (46 + pillW + 10), 600, 20, DISPLAY, 13);
      g.fillStyle = PINK_DEEP; g.fillText(flagTxt + dish.origin, 46 + pillW + 10, 60);
    }

    // Art window
    const ax = 46, ay = 126, aw = W - 92, ah = 328;
    g.save();
    rr(g, ax, ay, aw, ah, 18); g.clip();
    g.fillStyle = '#FFE38A'; g.fillRect(ax, ay, aw, ah);
    const cx = W / 2, cy = 280;
    for (let i = 0; i < 28; i += 2) {
      const a1 = (i * Math.PI * 2) / 28, a2 = ((i + 1) * Math.PI * 2) / 28;
      g.beginPath(); g.moveTo(cx, cy);
      g.lineTo(cx + 800 * Math.cos(a1), cy + 800 * Math.sin(a1));
      g.lineTo(cx + 800 * Math.cos(a2), cy + 800 * Math.sin(a2));
      g.closePath(); g.fillStyle = '#FFC93C'; g.fill();
    }
    const tableY = ay + ah - 62;
    g.fillStyle = '#FFD0DE'; g.fillRect(ax, tableY, aw, 62);
    gingham(g, ax, tableY, aw, 62, 22, '#F07FA6', 0.4);
    g.fillStyle = INK; g.fillRect(ax, tableY, aw, 4);
    g.drawImage(imgs.dish, cx - 155, 134, 310, 294);
    g.drawImage(imgs.pip, ax + 12, ay + 10, 104, 111);
    g.restore();
    rr(g, ax, ay, aw, ah, 18); g.lineWidth = 5; g.strokeStyle = INK; g.stroke();

    // Ribbon
    const sy = 464, sx = 70, sw = W - 140, sh = 34;
    g.beginPath();
    g.moveTo(sx - 14, sy); g.lineTo(sx + sw + 14, sy); g.lineTo(sx + sw, sy + sh / 2); g.lineTo(sx + sw + 14, sy + sh);
    g.lineTo(sx - 14, sy + sh); g.lineTo(sx, sy + sh / 2); g.closePath();
    g.fillStyle = PINK_DEEP; g.fill();
    const strip = text.name;
    fitText(g, strip, sw - 20, 800, 17, BODY, 12);
    g.font = 'italic ' + g.font;
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.fillText(strip, W / 2, sy + 23); g.textAlign = 'left';

    const label = (t, x, y, align = 'left') => {
      font(g, 800, 13, BODY); g.fillStyle = INK_SOFT; g.textAlign = align;
      if ('letterSpacing' in g) g.letterSpacing = '1.2px';
      g.fillText(t, x, y);
      if ('letterSpacing' in g) g.letterSpacing = '0px';
      g.textAlign = 'left';
    };

    // Strengths
    rr(g, 52, 512, W - 104, 138, 16); g.fillStyle = '#E3F6E6'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    label('STRENGTHS', 74, 538);
    card.strengths.forEach((st, i) => {
      const y = 570 + i * 31;
      starPath(g, 84, y - 7, 9); g.fillStyle = '#FFC93C'; g.fill(); g.lineWidth = 1.8; g.strokeStyle = INK; g.stroke();
      fitText(g, st, W - 190, 600, 21, DISPLAY, 15); g.fillStyle = INK; g.fillText(st, 104, y);
    });
    // Leading spice watching over the strengths
    spiceBadge(g, imgs.spice(top.id), top.colour, W - 106, 581, 38);

    // Trait grid
    const cells = [['WEAKNESS', card.weakness], ['RESISTS', card.resists], ['RECHARGES WITH', card.recharge], ['CLICKS WITH', card.clicks]];
    const gx = 52, gy = 664, cw = (W - 104) / 2, ch = 70;
    rr(g, gx, gy, W - 104, ch * 2, 16); g.fillStyle = '#FFFFFF'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    g.fillStyle = 'rgba(59,30,18,0.18)'; g.fillRect(gx + cw - 1, gy + 10, 2, ch * 2 - 20); g.fillRect(gx + 14, gy + ch - 1, W - 132, 2);
    cells.forEach(([lab, value], i) => {
      const x = gx + (i % 2) * cw + 22, y = gy + Math.floor(i / 2) * ch;
      label(lab, x, y + 28);
      fitText(g, value, cw - 40, 600, 22, DISPLAY, 14); g.fillStyle = INK; g.fillText(value, x, y + 56);
    });

    // Signature move
    const m = card.moves[0];
    const my = 818;
    label('SIGNATURE MOVE', 52, my + 18);
    for (let k = 0; k < m.cost; k++) spiceBadge(g, imgs.spice(m.spice.id), m.spice.colour, 70 + k * 28, my + 46, 18);
    fitText(g, m.name, 420, 600, 29, DISPLAY, 20);
    g.fillStyle = INK; g.fillText(m.name, 70 + m.cost * 28 + 8, my + 56);
    font(g, 700, 34, DISPLAY); g.textAlign = 'right'; g.fillStyle = PINK_DEEP;
    g.fillText(String(m.pct), W - 82, my + 56);
    font(g, 700, 18, DISPLAY); g.fillText('%', W - 60, my + 56);
    g.textAlign = 'left'; g.fillStyle = INK_SOFT;
    wrap(g, m.text, 52, my + 88, W - 104, 23, 2, 700, 18, 14);

    // Flavour text
    rr(g, 52, 944, W - 104, 50, 14); g.fillStyle = '#FFF1C2'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
    fitText(g, dish.subtitle, W - 140, 800, 18, BODY, 12);
    g.font = 'italic ' + g.font;
    g.fillStyle = INK; g.textAlign = 'center'; g.fillText(dish.subtitle, W / 2, 975); g.textAlign = 'left';

    footer(g, card, 'Illus. Pipi · Flip for the recipe');
    return c;
  }

  /* ---------- Back ---------- */
  function drawBack(result, imgs) {
    const { blend, dish, text } = result;
    const card = text.card;
    const top = blend[0].spice;
    const [c, g] = newCanvas();
    frame(g, top.colour);

    pill(g, 'THE RECIPE', 46, 40, PINK_DEEP);
    const nameSize = fitText(g, text.name, W - 100, 700, 46, DISPLAY, 26);
    g.fillStyle = INK; g.fillText(text.name, 48, 110 - (46 - nameSize) * 0.25);
    font(g, 800, 17, BODY); g.fillStyle = INK_SOFT;
    g.fillText(`Signature blend for ${dish.name} · ${SI.flags.supported() && dish.flag ? dish.flag + ' ' : ''}${dish.origin}`, 50, 140);

    gauge(g, blend, imgs.spice, 52, 158, W - 104, 30, false);

    // One row per spice
    const n = blend.length;
    const top0 = 206, bottom = 900;
    const rowH = Math.min(150, (bottom - top0) / n);
    blend.forEach((b, i) => {
      const y = top0 + i * rowH;
      const spiceText = text.spices[i];
      const r = Math.min(34, rowH * 0.28);
      spiceBadge(g, imgs.spice(b.spice.id), b.spice.colour, 52 + r, y + r + 10, r);
      const tx = 52 + r * 2 + 18;

      fitText(g, b.spice.name, W - tx - 150, 600, 27, DISPLAY, 18);
      g.fillStyle = INK; g.fillText(b.spice.name, tx, y + 34);
      font(g, 700, 34, DISPLAY); g.fillStyle = PINK_DEEP; g.textAlign = 'right';
      g.fillText(b.pct + '%', W - 56, y + 36); g.textAlign = 'left';

      // Role chip + family
      font(g, 700, 14, DISPLAY);
      const role = spiceText.role;
      const rw = g.measureText(role).width + 18;
      rr(g, tx, y + 44, rw, 22, 11); g.fillStyle = '#DDF3FA'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
      g.fillStyle = INK; g.fillText(role, tx + 9, y + 60);
      font(g, 800, 13, BODY); g.fillStyle = INK_SOFT;
      g.fillText((SI.SPICE_FAMILIES[b.spice.family] || '').toUpperCase(), tx + rw + 10, y + 60);

      g.fillStyle = INK_SOFT;
      const maxLines = rowH >= 140 ? 3 : 2;
      wrap(g, spiceText.line, tx, y + 88, W - tx - 56, 21, maxLines, 700, 17, 14);
      if (i < n - 1) { g.fillStyle = 'rgba(59,30,18,0.14)'; g.fillRect(52, y + rowH - 4, W - 104, 2); }
    });

    // Spare room (shorter blends): tell the story of the dish
    const rowsEnd = top0 + n * rowH;
    const boxY = rowsEnd + 6, boxH = 892 - boxY;
    if (boxH >= 110) {
      rr(g, 52, boxY, W - 104, boxH, 16); g.fillStyle = '#FFF1C2'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
      font(g, 600, 22, DISPLAY); g.fillStyle = PINK_DEEP;
      g.fillText(`Why ${dish.name}?`, 74, boxY + 38);
      g.fillStyle = INK;
      const avail = Math.max(2, Math.floor((boxH - 62) / 25));
      const used = wrap(g, text.dish.story, 74, boxY + 68, W - 148, 25, avail, 700, 18, 15);
      if (avail - used >= 3) { g.fillStyle = INK_SOFT; wrap(g, text.dish.mapping, 74, boxY + 68 + used * 25 + 12, W - 148, 25, avail - used - 1, 700, 17, 14); }
    }

    // Flavour profile chips
    g.fillStyle = INK; g.fillRect(46, 908, W - 92, 3);
    font(g, 800, 13, BODY); g.fillStyle = INK_SOFT; g.textAlign = 'center';
    if ('letterSpacing' in g) g.letterSpacing = '1px';
    g.fillText('FLAVOUR PROFILE', W / 2, 934);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    font(g, 600, 17, DISPLAY);
    const chips = text.flavour.map((w) => ({ w, width: g.measureText(w).width + 26 }));
    const total = chips.reduce((a, ch) => a + ch.width, 0) + (chips.length - 1) * 8;
    let x = Math.max(52, (W - total) / 2);
    chips.forEach((ch) => {
      if (x + ch.width > W - 52) return;
      rr(g, x, 948, ch.width, 32, 16); g.fillStyle = MINT; g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
      g.fillStyle = INK; g.textAlign = 'center'; g.fillText(ch.w, x + ch.width / 2, 970);
      x += ch.width + 8;
    });
    g.textAlign = 'left';

    footer(g, card, 'A playful recipe, not a measurement');
    return c;
  }

  function toBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not export card'))), 'image/png');
      } catch (e) { reject(e); }
    });
  }

  async function render(result) {
    await fontsReady();
    const { blend, dish } = result;
    const [dishImg, pipImg, ...spiceImgs] = await Promise.all([
      svgImage(SI.art.dish(dish), 340, 323),
      svgImage(SI.chars.pip('cheer'), 104, 111),
      ...blend.map((b) => svgImage(SI.chars.spice(b.spice.id), 120, 120))
    ]);
    const imgs = { dish: dishImg, pip: pipImg, spice: (id) => spiceImgs[blend.findIndex((b) => b.spice.id === id)] };
    const sides = {};
    for (const [side, draw] of [['front', drawFront], ['back', drawBack]]) {
      const blob = await toBlob(draw(result, imgs));
      sides[side] = { blob, url: URL.createObjectURL(blob) };
    }
    return { ...sides, width: W, height: H };
  }

  function filename(result, side = 'front') {
    const slug = result.dish.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `secret-ingredient-${slug}-${side}.png`;
  }

  SI.card = { render, filename, W, H };
})(globalThis.SI = globalThis.SI || {});
