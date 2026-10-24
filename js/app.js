/*
 * UI controller. Owns session state and renders one screen at a time.
 * All interpretation lives in js/engine; all content in js/data.
 * Nothing is persisted: answers live only in memory for this session.
 */
(function (SI) {
  const app = document.getElementById('app');
  const hud = document.getElementById('hud-progress');
  const { dish: dishArt, cloche, star } = SI.art;
  const { pip, spice: spiceArt } = SI.chars;

  const problems = SI.engine.validateContent();
  if (problems.length) console.warn('[Secret Ingredient] content problems:', problems);

  /* Pipi reacts to each answer. The reaction follows the answer's strongest hidden
     signal, but the lines never name a trait, so nothing about the scoring leaks. */
  const REACTIONS = {
    explore: { mood: 'star', lines: ['Ooh, sounds fun!', 'Ooh, exciting!', 'Ooh, let’s go!'] },
    energy: { mood: 'cheer', lines: ['Woohoo!', 'Let’s gooo!', 'Yay!'] },
    steady: { mood: 'happy', lines: ['Nice and cosy.', 'Sounds lovely.', 'Ahh, perfect.'] },
    warmth: { mood: 'love', lines: ['Aww, that’s sweet.', 'Aww!', 'So lovely!'] },
    space: { mood: 'calm', lines: ['Mmm, peaceful.', 'Ahh, bliss.', 'Mmm, nice.'] },
    observe: { mood: 'think', lines: ['Hmm, interesting…', 'Ooh, tell me more.', 'Hmm, I see…'] },
    drive: { mood: 'determined', lines: ['Yes! Go for it!', 'Ooh, fierce!', 'You got this!'] },
    flow: { mood: 'wink', lines: ['Easy-breezy!', 'Love that.', 'Go with it!'] },
    play: { mood: 'laugh', lines: ['Hehe, love it!', 'Haha, yes!', 'Hehe!'] }
  };

  /* Saving the card: the claude.ai viewer offers a downloads capability; a normal
     browser tab can use a download link; anywhere else, long-press to save. */
  const inFrame = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  let downloads = null;
  const downloadsReady = (window.claude && typeof window.claude.use === 'function')
    ? window.claude.use('downloads').then((d) => { downloads = d; return d; }, () => null)
    : Promise.resolve(null);

  let state;
  function freshState() {
    return { screen: 'welcome', questions: SI.engine.selectQuestions(), index: 0, answers: {}, result: null, card: null, cardSide: 'front', cardRevealed: false };
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function topSignal(option) {
    return SI.DIMENSIONS.reduce((best, d) => ((option.s[d] || 0) > (option.s[best] || 0) ? d : best), SI.DIMENSIONS[0]);
  }
  function reactionFor(q, index) {
    const r = REACTIONS[topSignal(q.options[index])];
    return { mood: r.mood, line: r.lines[(state.index + index) % r.lines.length] };
  }

  function pipRow(mood, line, id = '', cls = '') {
    return `<div class="pip-row ${cls}"><div class="pip-box" ${id ? `id="${id}-pip"` : ''}>${pip(mood)}</div>
      <p class="bubble" ${id ? `id="${id}-bubble"` : ''} aria-hidden="true">${esc(line)}</p></div>`;
  }

  /* ---------- Screens ----------
     Every screen is a column: a body that holds the content, and a dock pinned to the
     bottom of the viewport that holds the next step. The body only scrolls when a
     screen genuinely can't fit; the dock never scrolls away. */

  function welcome() {
    return `<section class="screen welcome" aria-labelledby="h">
      <div class="body">
        <div class="card">
          ${pipRow('wave', 'Hi, I’m Pipi! Shall we play?')}
          <h1 id="h" tabindex="-1">Let’s get to know you.</h1>
          <p class="lede">Everyone has a little something that makes them, well, them.</p>
          <div class="body-copy">
            <p>We’re going to ask you a few questions about how you see the world, the things you enjoy, and the little choices you make.</p>
            <p>There are no right or wrong answers. Don’t overthink it, just go with what feels right.</p>
            <p>You might discover something unexpected about yourself.</p>
          </div>
        </div>
      </div>
      <div class="dock dock-stack">
        <button class="btn btn-primary btn-wide" data-action="start">Let’s go</button>
        <p class="meta">${state.questions.length} quick questions · about 3 minutes</p>
      </div>
    </section>`;
  }

  function question() {
    const q = state.questions[state.index];
    const chosen = state.answers[q.id];
    const n = state.questions.length;
    const options = q.options.map((o, i) => `
      <label class="option">
        <input type="radio" name="answer" value="${i}" ${chosen === i ? 'checked' : ''}>
        <span class="badge" aria-hidden="true">${'ABCDEF'[i]}</span>
        <span class="opt-text">${esc(o.text)}</span>
      </label>`).join('');
    const idle = state.index === 0 ? { mood: 'happy', line: 'Go with your gut!' } : { mood: 'think', line: 'Hmm, what’ll it be?' };
    // Coming back to an answered question: the answer is kept, and tapping any option moves on again.
    const r = chosen != null ? { mood: 'think', line: 'Tap your answer to carry on.' } : idle;
    return `<section class="screen question">
      <div class="body">
        <div class="card q-card entering${qDir === 'back' ? ' from-left' : ''}" id="q-form">
          <div class="q-head"><p class="q-title">${esc(q.title)}</p><p class="q-count">${state.index + 1} / ${n}</p></div>
          <h2 id="h" tabindex="-1">${esc(q.prompt)}</h2>
          <div class="options" role="radiogroup" aria-labelledby="h">${options}</div>
        </div>
      </div>
      <div class="dock dock-row">
        <button class="btn btn-plain btn-small" data-action="back" aria-label="Back">‹ Back</button>
        <div class="dock-pip">${pipRow(r.mood, r.line, 'q', 'mini')}</div>
      </div>
    </section>`;
  }

  function transition() {
    return `<section class="screen transition">
      <div class="body">
        <div class="card">
          <div class="orb" aria-hidden="true"><span></span><span><div class="pip-box orb-pip">${pip('star')}</div></span></div>
          <h1 id="h" tabindex="-1">Everyone has a signature.</h1>
          <div class="body-copy">
            <p>It’s in the choices you make, the energy you bring into a room, and the things that make you who you are.</p>
            <p>Some qualities are obvious. Others take a little longer to discover.</p>
            <p>We’ve picked up a few patterns in your answers.</p>
          </div>
          <p class="ready">Let’s see what they look like.</p>
        </div>
      </div>
      <div class="dock dock-stack">
        <button class="btn btn-primary btn-wide" data-action="blend">Discover my blend</button>
        <button class="btn-link" data-action="back">Change an answer</button>
      </div>
    </section>`;
  }

  /* The blend at a glance: one gauge, each slice showing its spice character and share.
     Each slice is a button that brings that spice's card into view. */
  function gauge(blend, small = false, linked = false) {
    const segs = blend.map((b, i) => {
      const inner = `<span class="g-icon">${spiceArt(b.spice.id)}</span><span class="g-pct">${b.pct}%</span>`;
      const style = `flex:${b.pct} 1 0;background:${b.spice.colour};color:${b.spice.text};animation-delay:${0.12 * i}s`;
      const cls = 'g-seg' + (b.pct <= 10 || (blend.length >= 5 && b.pct <= 15) ? ' narrow' : '');
      return linked
        ? `<button class="${cls}" style="${style}" data-action="show-spice" data-index="${i}" aria-label="${esc(`${b.pct}% ${b.spice.name}. Show details`)}">${inner}</button>`
        : `<div class="${cls}" style="${style}">${inner}</div>`;
    }).join('');
    const label = 'Blend: ' + blend.map((b) => `${b.pct}% ${b.spice.name}`).join(', ');
    return linked
      ? `<div class="gauge ${small ? 'gauge-small' : ''}" role="group" aria-label="${esc(label)}">${segs}</div>`
      : `<div class="gauge ${small ? 'gauge-small' : ''}" role="img" aria-label="${esc(label)}">${segs}</div>`;
  }

  function blendScreen() {
    const r = state.result, t = r.text;
    const rows = r.blend.map((b, i) => `
      <li class="spice-row" id="spice-${i}" style="--c:${b.spice.colour}">
        <div class="spice-pic" style="--pct:${b.pct};--c:${b.spice.colour}" aria-hidden="true"><div class="spice-plate">${spiceArt(b.spice.id)}</div></div>
        <div class="spice-body">
          <div class="spice-head"><h3>${esc(b.spice.name)}</h3><span class="pct">${b.pct}%</span></div>
          <p class="role"><span class="role-tag">${esc(t.spices[i].role)}</span><span class="essence">${esc(b.spice.essence)}</span></p>
          <p class="spice-line">${esc(t.spices[i].line)}</p>
        </div>
      </li>`).join('');
    const dots = r.blend.map((b, i) => `<button class="dot" data-action="show-spice" data-index="${i}" style="--c:${b.spice.colour}" aria-label="${esc(b.spice.name)}" ${i === 0 ? 'aria-current="true"' : ''}></button>`).join('');
    return `<section class="screen blend">
      <div class="body">
        <div class="card summary">
          <p class="eyebrow">Your spice blend</p>
          <h1 id="h" tabindex="-1">${esc(t.name)}</h1>
          <p class="overview">${esc(t.overview)}</p>
          ${gauge(r.blend, false, true)}
          <ul class="chips" aria-label="Flavour profile">${t.flavour.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
        </div>
        <div class="mix">
          <div class="mix-head"><h2>What’s in the mix</h2><div class="dots">${dots}</div></div>
          <ol class="spice-list" id="spice-list" aria-label="Your spices, swipe for more">${rows}</ol>
        </div>
      </div>
      <div class="dock dock-row">
        <div class="dock-pip">${pipRow('wow', 'What would we cook?', 'b', 'mini')}</div>
        <button class="btn btn-primary" data-action="dish">Reveal my dish</button>
      </div>
    </section>`;
  }

  function dishScreen() {
    const r = state.result, t = r.text, d = r.dish;
    return `<section class="screen dish">
      <div class="body">
        <div class="stage">
          <div class="rays" aria-hidden="true"></div>
          <div class="plate-ring" aria-hidden="true"></div>
          ${dishArt(d)}
          ${cloche()}
          <div class="burst" aria-hidden="true">${star()}${star()}${star()}${star()}</div>
          <p class="stamp">${star()} Signature dish ${star()}</p>
          <p class="origin">${SI.flags.supported() && d.flag ? `<span class="flag" aria-hidden="true">${d.flag}</span>` : SI.art.pin()}<span>${esc(d.origin)}</span></p>
        </div>
        <div class="dish-title">
          <h1 id="h" tabindex="-1">${esc(d.name)}</h1>
          <p class="subtitle">${esc(d.subtitle)}</p>
        </div>
        <div class="card story">
          <p class="lead">${esc(t.dish.story)}</p>
          <p class="mapping">${esc(t.dish.mapping)}</p>
        </div>
      </div>
      <div class="dock dock-row">
        <button class="btn btn-plain btn-small" data-action="to-blend" aria-label="Back to my blend">‹ Blend</button>
        <div class="dock-pip"><div class="pip-box mini-solo">${pip('cheer')}</div></div>
        <button class="btn btn-primary" data-action="to-card">My card</button>
      </div>
    </section>`;
  }

  // Line icons for the card dock (stroke uses currentColor)
  const svgIcon = (d) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    share: svgIcon('<path d="M12 3v12"/><path d="M7.5 7.5 12 3l4.5 4.5"/><path d="M8 11H6.5A1.5 1.5 0 0 0 5 12.5v7A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5H16"/>'),
    copy: svgIcon('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 5.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5"/>'),
    save: svgIcon('<path d="M12 3v11"/><path d="M7.5 9.5 12 14l4.5-4.5"/><path d="M4 16v2.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V16"/>'),
    flip: svgIcon('<path d="M20 12a8 8 0 0 1-14.2 5"/><path d="M4 12a8 8 0 0 1 14.2-5"/><path d="M18.5 3v4h-4"/><path d="M5.5 21v-4h4"/>')
  };

  function cardScreen() {
    return `<section class="screen card-screen fill">
      <div class="body">
        <div class="card-head">
          <button class="btn-link" data-action="dish">‹ My dish</button>
          <h1 id="h" tabindex="-1" class="visually-hidden">Your collectible card</h1>
          <button class="btn-link" data-action="restart">Play again</button>
        </div>
        <div class="card-stage" id="card-stage">
          <div class="slot" id="slot">
            <div class="deck-backs" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
            <div class="pop" id="pop">
              <div class="tcg loading" id="tcg">
                <p class="tcg-wait">${pip('think')}<span>Printing your card…</span></p>
              </div>
            </div>
            <div class="deck-front" aria-hidden="true"><span class="deck-handle"></span><span class="deck-label">Recipe file</span></div>
          </div>
        </div>
        <p class="share-status" id="share-status" aria-live="polite"></p>
      </div>
      <div class="dock dock-buttons">
        <button class="btn btn-plain btn-icon" data-action="flip" id="flip-btn" aria-controls="tcg" aria-label="Flip the card" title="Flip" disabled>${ICON.flip}</button>
        <button class="btn btn-plain btn-icon" data-action="save" id="save-btn" aria-label="Save front" title="Save this side" hidden disabled>${ICON.save}</button>
        <button class="btn btn-plain btn-icon" data-action="copy" id="copy-btn" aria-label="Copy result" title="Copy result">${ICON.copy}</button>
        <button class="btn btn-primary btn-small share" data-action="share-card" id="share-btn" disabled>${ICON.share}<span>Share</span></button>
      </div>
    </section>`;
  }

  const SCREENS = { welcome, question, transition, blend: blendScreen, dish: dishScreen, card: cardScreen };

  /* ---------- Rendering ---------- */

  function renderHud() {
    if (state.screen !== 'question') { hud.innerHTML = ''; return; }
    const n = state.questions.length;
    const answered = state.questions.filter((q) => state.answers[q.id] != null).length;
    hud.innerHTML = state.questions.map((q, i) => star(state.answers[q.id] != null ? 'on' : (i === state.index ? 'now' : ''))).join('');
    hud.setAttribute('aria-label', `${answered} of ${n} answered`);
  }

  function render(focus = true) {
    clearTimeout(advanceTimer);
    app.innerHTML = SCREENS[state.screen]();
    document.body.dataset.screen = state.screen;
    renderHud();
    if (stageObserver) stageObserver.disconnect();
    if (state.screen === 'card') { if (stageObserver) stageObserver.observe(document.getElementById('card-stage')); setupCard(); }
    if (state.screen === 'blend') wireCarousel();
    if (state.screen === 'question') settleQuestion();
    if (focus) {
      app.scrollTop = 0;
      window.scrollTo(0, 0);
      const h = document.getElementById('h');
      if (h) h.focus({ preventScroll: true });
    }
  }

  function go(screen) { state.screen = screen; render(); }

  /* Blend carousel: dots and gauge slices bring a spice into view; swiping updates the dots. */
  function showSpice(i) {
    const item = document.getElementById('spice-' + i);
    const list = document.getElementById('spice-list');
    if (!item || !list) return;
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.clientWidth) / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    markDot(i);
  }
  function markDot(i) {
    app.querySelectorAll('.dot').forEach((d, k) => { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    app.querySelectorAll('.g-seg').forEach((g, k) => g.classList.toggle('active', k === i));
  }
  function wireCarousel() {
    const list = document.getElementById('spice-list');
    if (!list) return;
    let raf = 0;
    list.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = list.scrollLeft + list.clientWidth / 2;
        let best = 0, bestD = Infinity;
        [...list.children].forEach((li, k) => { const d = Math.abs(li.offsetLeft + li.clientWidth / 2 - mid); if (d < bestD) { bestD = d; best = k; } });
        markDot(best);
      });
    }, { passive: true });
    markDot(0);
  }

  /* Card fits the space between the heading and the dock. */
  function sizeCard() {
    const stage = document.getElementById('card-stage');
    const tcg = document.getElementById('tcg');
    if (!stage || !tcg) return;
    const w = Math.max(160, Math.min(stage.clientWidth, (stage.clientHeight - 12) * 750 / 1050, 440));
    tcg.style.width = Math.floor(w) + 'px';
  }
  window.addEventListener('resize', sizeCard);
  const stageObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(sizeCard) : null;

  function react(prefix, mood, line) {
    const box = document.getElementById(prefix + '-pip');
    const bubble = document.getElementById(prefix + '-bubble');
    if (box) {
      box.innerHTML = pip(mood);
      box.classList.remove('react'); void box.offsetWidth; box.classList.add('react');
    }
    if (bubble) {
      bubble.textContent = line;
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    }
  }

  /* ---------- Card ---------- */

  function cardAlt(side) {
    const r = state.result, t = r.text;
    if (side === 'back') return `Back of the card, the recipe for ${t.name}: ` + r.blend.map((b, i) => `${b.pct}% ${b.spice.name}, ${t.spices[i].role.toLowerCase()}`).join('; ') + '.';
    const c = t.card;
    return `Front of the card for ${r.dish.name}, from ${r.dish.origin}: ${t.name}. Heat ${c.heat}. Strengths: ${c.strengths.join(', ')}. Weakness: ${c.weakness}. Resists: ${c.resists}. Recharges with: ${c.recharge}. Clicks with: ${c.clicks}. Signature move: ${c.moves[0].name}.`;
  }

  function cardFiles() {
    if (typeof File !== 'function' || !state.card || !state.card.front) return [];
    return ['front', 'back'].map((side) => new File([state.card[side].blob], SI.card.filename(state.result, side), { type: 'image/png' }));
  }

  function visibleSide() { return state.cardSide === 'back' ? 'back' : 'front'; }

  function updateCardButtons() {
    if (state.screen !== 'card') return;
    const ready = !!(state.card && state.card.front);
    const save = document.getElementById('save-btn');
    const share = document.getElementById('share-btn');
    const flip = document.getElementById('flip-btn');
    if (!save) return;
    const canSave = !!downloads || !inFrame;
    save.hidden = !canSave; save.disabled = !ready;
    save.setAttribute('aria-label', visibleSide() === 'back' ? 'Save back' : 'Save front');
    share.disabled = !ready || sharing;
    flip.disabled = !ready;
    flip.setAttribute('aria-label', visibleSide() === 'back' ? 'Show the front' : 'Flip the card');
  }

  function showCard() {
    const holder = document.getElementById('tcg');
    if (!holder || !state.card) return;
    holder.classList.remove('loading');
    if (state.card.error) {
      holder.innerHTML = `<p class="tcg-wait">${pip('think')}<span>Your card couldn’t be printed here. Copy your result below instead.</span></p>`;
      return;
    }
    holder.innerHTML = `<div class="tcg-inner">
        <button class="tcg-face tcg-front" data-action="flip" aria-label="${esc(cardAlt('front') + ' Select to flip.')}"><img src="${state.card.front.url}" alt="" width="${SI.card.W}" height="${SI.card.H}" draggable="false"><span class="holo" aria-hidden="true"></span><span class="card-cloche" aria-hidden="true">${cloche()}</span></button>
        <button class="tcg-face tcg-back" data-action="flip" aria-label="${esc(cardAlt('back') + ' Select to flip.')}"><img src="${state.card.back.url}" alt="" width="${SI.card.W}" height="${SI.card.H}" draggable="false"><span class="holo" aria-hidden="true"></span></button>
      </div>`;
    holder.classList.add('dealt');
    holder.classList.toggle('flipped', visibleSide() === 'back');
    // First time on this card: it pops out of the recipe file, then the cloche lifts.
    const slot = document.getElementById('slot');
    if (slot && !state.cardRevealed) {
      state.cardRevealed = true;
      slot.classList.add('revealing');
      nudgeLater(reduced() ? 0 : REVEAL_MS);
    } else nudgeLater(0);
    setFaceAccess();
    sizeCard();
    updateCardButtons();
  }

  function setFaceAccess() {
    const front = app.querySelector('.tcg-front'), back = app.querySelector('.tcg-back');
    if (!front) return;
    const showingBack = visibleSide() === 'back';
    front.tabIndex = showingBack ? -1 : 0; front.setAttribute('aria-hidden', String(showingBack));
    back.tabIndex = showingBack ? 0 : -1; back.setAttribute('aria-hidden', String(!showingBack));
  }

  /* Until someone has flipped a card once, it gives a little jiggle every few seconds. */
  const REVEAL_MS = 2700;
  let flipLearned = false, nudgeTimer = 0;
  try { flipLearned = localStorage.getItem('si-flip-learned') === '1'; } catch (e) { /* storage unavailable */ }
  function nudgeLater(ms) {
    clearTimeout(nudgeTimer);
    if (flipLearned) return;
    nudgeTimer = setTimeout(() => { const pop = document.getElementById('pop'); if (pop && !flipLearned) pop.classList.add('nudge'); }, ms);
  }
  function learnFlip() {
    clearTimeout(nudgeTimer);
    const pop = document.getElementById('pop'); if (pop) pop.classList.remove('nudge');
    if (flipLearned) return;
    flipLearned = true;
    try { localStorage.setItem('si-flip-learned', '1'); } catch (e) { /* storage unavailable */ }
  }

  function flipCard() {
    const holder = document.getElementById('tcg');
    if (!holder || !state.card || !state.card.front) return;
    learnFlip();
    state.cardSide = visibleSide() === 'back' ? 'front' : 'back';
    holder.classList.toggle('flipped', state.cardSide === 'back');
    setFaceAccess();
    updateCardButtons();
  }

  function setupCard() {
    sizeCard();
    const forResult = state.result;
    if (state.card && state.card.result === forResult) { showCard(); return; }
    SI.card.render(forResult).then(
      (c) => {
        if (state.result === forResult) { state.card = { ...c, result: forResult }; showCard(); }
        else { URL.revokeObjectURL(c.front.url); URL.revokeObjectURL(c.back.url); }
      },
      (err) => { console.warn('[Secret Ingredient] card render failed', err); if (state.result === forResult) { state.card = { error: true, result: forResult }; showCard(); } }
    );
    updateCardButtons();
  }

  function clearCard() {
    if (state && state.card && state.card.front) { URL.revokeObjectURL(state.card.front.url); URL.revokeObjectURL(state.card.back.url); }
    if (state) state.cardSide = 'front';
  }

  function saveCard() {
    if (!state.card || !state.card.front) return;
    const side = visibleSide();
    const filename = SI.card.filename(state.result, side);
    const saved = side === 'back' ? 'Back of the card saved!' : 'Front of the card saved!';
    if (downloads) {
      downloads.save({ filename, data: state.card[side].blob }).then(
        () => setStatus(saved),
        (err) => {
          if (err && err.code === 'declined') { setStatus(''); return; }
          if (err && err.code === 'rate_limited') { setStatus('One moment, then try again.'); return; }
          setStatus('Saving isn’t available here. Long-press or right-click the card to save it.');
        }
      );
      return;
    }
    const a = document.createElement('a');
    a.href = state.card[side].url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setStatus(saved);
  }

  /*
   * Share both sides in one action.
   * 1. Where the browser can share image files (most phones), one share sheet carries
   *    the front and back as two separate PNGs plus the result text.
   * 2. Otherwise both PNGs are saved one after the other (on claude.ai each save is
   *    confirmed by the viewer; in the Claude mobile apps that opens the share sheet).
   * 3. Last resort: long-press / right-click each side.
   */
  let sharing = false;
  function canShareFiles(files) {
    try { return files.length === 2 && !!navigator.share && !!navigator.canShare && navigator.canShare({ files }); } catch (e) { return false; }
  }
  function shareCard() {
    if (!state.card || !state.card.front || sharing) return;
    const files = cardFiles();
    if (!canShareFiles(files)) { saveBoth(); return; }
    sharing = true; updateCardButtons();
    const done = () => { sharing = false; updateCardButtons(); };
    navigator.share({ files, title: 'The Secret Ingredient', text: state.result.text.share }).then(
      () => { setStatus('Shared! Both sides of your card are on their way.'); done(); },
      (err) => {
        done();
        if (err && err.name === 'AbortError') { setStatus(''); return; }
        saveBoth(); // sharing is blocked here (e.g. inside an embedded page), so save both instead
      }
    );
  }

  function saveBoth() {
    const sides = ['front', 'back'];
    const done = () => { sharing = false; updateCardButtons(); };
    if (downloads) {
      sharing = true; updateCardButtons();
      let saved = 0;
      const step = (i) => {
        if (i >= sides.length) { setStatus(saved === 2 ? 'Front and back saved! Share them from your photos or downloads.' : ''); done(); return; }
        setStatus(`Saving ${sides[i]} (${i + 1} of 2)…`);
        downloads.save({ filename: SI.card.filename(state.result, sides[i]), data: state.card[sides[i]].blob }).then(
          () => { saved += 1; step(i + 1); },
          (err) => {
            const code = err && err.code;
            if (code === 'declined') { setStatus(saved ? 'Front saved. Tap Share card again for the back.' : ''); done(); return; }
            if (code === 'rate_limited') { setTimeout(() => step(i), 800); return; }
            setStatus('Saving isn’t available here. Long-press or right-click each side to save it.'); done();
          }
        );
      };
      step(0);
      return;
    }
    if (!inFrame) {
      sides.forEach((side, i) => setTimeout(() => {
        const a = document.createElement('a');
        a.href = state.card[side].url; a.download = SI.card.filename(state.result, side);
        document.body.appendChild(a); a.click(); a.remove();
      }, i * 400));
      setStatus('Front and back downloaded! Share them from your downloads.');
      return;
    }
    setStatus('Long-press or right-click each side to save it, then share.');
  }

  // Gentle holographic tilt that follows the pointer
  app.addEventListener('pointermove', (e) => {
    const el = e.target.closest && e.target.closest('.tcg:not(.loading)');
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - 0.5) * 14).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
    el.style.setProperty('--shine', (px * 100).toFixed(1) + '%');
  });
  app.addEventListener('pointerout', (e) => {
    const el = e.target.closest && e.target.closest('.tcg');
    if (el && !el.contains(e.relatedTarget)) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); }
  });

  /* ---------- Actions ---------- */

  let advanceTimer = 0;
  const ADVANCE_MS = 750;

  // Question-to-question transition: the answered card slides away, the next one slides in.
  // Taps are ignored while a card is moving, so a tap always lands on a still card.
  let qDir = 'next', leaving = false;
  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const Q_OUT_MS = 170, Q_IN_MS = 240;
  function moving() { return leaving || !!app.querySelector('.q-card.entering'); }
  function leaveQuestion(then) {
    const card = app.querySelector('.q-card');
    if (!card || reduced()) { then(); return; }
    if (leaving) return;
    leaving = true;
    card.classList.remove('entering');
    card.classList.add('leaving');
    setTimeout(() => { leaving = false; then(); }, Q_OUT_MS);
  }
  function settleQuestion() {
    const card = app.querySelector('.q-card.entering');
    if (!card) return;
    if (reduced()) { card.classList.remove('entering'); return; }
    setTimeout(() => card.classList.remove('entering'), Q_IN_MS);
  }

  function choose(index) {
    if (moving()) return;
    const q = state.questions[state.index];
    if (index < 0 || index >= q.options.length) return;
    state.answers[q.id] = index;
    const input = app.querySelector(`input[name="answer"][value="${index}"]`);
    if (input && !input.checked) input.checked = true;
    const r = reactionFor(q, index);
    react('q', r.mood, r.line);
    renderHud();
    // Move on by itself once Pipi has reacted; Back is always there to change it.
    clearTimeout(advanceTimer);
    const at = state.index;
    advanceTimer = setTimeout(() => { if (state.screen === 'question' && state.index === at) next(); }, ADVANCE_MS);
  }

  function next() {
    const q = state.questions[state.index];
    if (state.answers[q.id] == null) return;
    qDir = 'next';
    if (state.index < state.questions.length - 1) leaveQuestion(() => { state.index += 1; render(); });
    else leaveQuestion(() => go('transition'));
  }

  function back() {
    if (state.screen === 'transition') { state.index = state.questions.length - 1; qDir = 'back'; go('question'); qDir = 'next'; return; }
    if (state.index === 0) { go('welcome'); return; }
    if (leaving) return;
    qDir = 'back'; state.index -= 1; render(); qDir = 'next';
  }

  function computeResult() {
    const answers = state.questions.map((q) => ({ questionId: q.id, optionIndex: state.answers[q.id] }));
    const result = SI.engine.interpret(answers);
    const same = state.result && JSON.stringify(state.result.blend.map((b) => [b.spice.id, b.pct])) === JSON.stringify(result.blend.map((b) => [b.spice.id, b.pct])) && state.result.dish === result.dish;
    if (!same) { clearCard(); state.card = null; state.result = result; state.cardRevealed = false; }
  }

  function setStatus(msg) { const el = document.getElementById('share-status'); if (el) el.textContent = msg; }

  function copyResult() {
    const text = state.result.text.share;
    try {
      navigator.clipboard.writeText(text).then(
        () => setStatus('Copied! Paste it anywhere.'),
        () => setStatus('Copying isn’t available here. Try Share instead.')
      );
    } catch (e) {
      setStatus('Copying isn’t available here. Try Share instead.');
    }
  }

  app.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    switch (btn.dataset.action) {
      case 'start': state.index = 0; go('question'); break;
      case 'next': next(); break;
      case 'back': back(); break;
      case 'blend': computeResult(); go('blend'); break;
      case 'dish': go('dish'); break;
      case 'to-card': go('card'); break;
      case 'show-spice': showSpice(Number(btn.dataset.index)); break;
      case 'to-blend': go('blend'); break;
      case 'restart': clearCard(); state = freshState(); render(); break;
      case 'copy': copyResult(); break;
      case 'save': saveCard(); break;
      case 'flip': flipCard(); break;
      case 'share-card': shareCard(); break;
    }
  });

  app.addEventListener('change', (e) => {
    if (e.target.name === 'answer') choose(Number(e.target.value));
  });
  // Tapping the answer that's already selected (e.g. after Back) doesn't fire "change", so move on from here.
  app.addEventListener('click', (e) => {
    if (e.target.name === 'answer' && state.screen === 'question') choose(Number(e.target.value));
  });


  document.addEventListener('keydown', (e) => {
    if (state.screen !== 'question' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^[1-6]$/.test(e.key)) {
      const idx = Number(e.key) - 1;
      if (idx < state.questions[state.index].options.length) {
        e.preventDefault();
        choose(idx);
        const input = app.querySelector(`input[name="answer"][value="${idx}"]`);
        if (input) input.focus();
      }
    } else if (e.key === 'Enter' && e.target.matches && e.target.matches('input[name="answer"], body, h2')) {
      e.preventDefault();
      next();
    }
  });

  downloadsReady.then(updateCardButtons);

  state = freshState();
  render(false);

  // Exposed for automated tests and debugging only.
  SI.app = { getState: () => state, render: () => render(false) };
})(globalThis.SI = globalThis.SI || {});
