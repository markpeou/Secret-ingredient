/*
 * Narrative generation. Rule-based text built from the scoring output.
 * Kept separate from scoring so it can later be swapped for richer generation.
 */
(function (SI) {
  // What it sounds like when a dimension is strong.
  const HIGH = {
    explore: 'you’re drawn to the new and the untested',
    energy: 'you bring momentum wherever you go',
    steady: 'you value things that are solid and well made',
    warmth: 'the people around you matter enormously',
    space: 'you need room of your own to think and recharge',
    observe: 'you notice what other people miss',
    drive: 'you go after the things that matter properly',
    flow: 'you bend rather than break when plans change',
    play: 'you have a knack for making ordinary moments more fun'
  };

  // Gentle notes for the least prominent dimension.
  const LOW = {
    explore: 'You don’t need constant novelty to feel content.',
    energy: 'You don’t need to be busy to feel like yourself.',
    steady: 'Routine has never really been your thing.',
    warmth: 'You don’t need a crowd around you to feel good.',
    space: 'You rarely need to retreat to recharge.',
    observe: 'You’d rather act than analyse every angle.',
    drive: 'You’re not one to force things.',
    flow: 'You like knowing where things are headed.',
    play: 'You tend to keep things on the sincere side.'
  };

  // Seemingly contradictory pairs, read as interesting combinations.
  const CONTRASTS = [
    { pair: ['explore', 'steady'], text: 'You love discovering something new, yet you like coming home to something you trust.' },
    { pair: ['warmth', 'space'], text: 'You care deeply about your people, and you still guard your own space. Connected without being consumed.' },
    { pair: ['drive', 'flow'], text: 'You can push hard when it counts, and you also know when to let go.' },
    { pair: ['energy', 'space'], text: 'You can light up a room, but you also need quiet time to recover afterwards.' },
    { pair: ['play', 'observe'], text: 'You’re quick with a joke, but you’re quietly taking everything in at the same time.' },
    { pair: ['drive', 'warmth'], text: 'You’re ambitious without leaving anyone behind.' },
    { pair: ['explore', 'space'], text: 'You’ll wander off the map, and you’re perfectly happy to do it alone.' },
    { pair: ['energy', 'observe'], text: 'You can be calm without being passive, and lively without missing the details.' }
  ];

  const ROLE_LABELS = ['The foundation', 'The main note', 'The supporting layer', 'The twist'];

  function listJoin(words) { return words.length < 2 ? words.join('') : words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1]; }
  function article(word) { return /^[aeiou]/i.test(word) ? 'an' : 'a'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function roleFor(index, count, spice) {
    if (index === 0) return ROLE_LABELS[0];
    if (index === count - 1) return spice.kick ? 'The hidden kick' : 'The finishing touch';
    return ROLE_LABELS[index] || ROLE_LABELS[3];
  }

  function blendName(blend, profile) {
    if (profile.balanced) return 'The Beautiful Balance';
    const first = blend[0].spice, second = blend[1].spice;
    return 'The ' + second.adj + ' ' + first.noun;
  }

  function findContrast(profile) {
    const top = new Set(profile.ranked.slice(0, 4));
    return CONTRASTS.find((c) => top.has(c.pair[0]) && top.has(c.pair[1]) &&
      profile.affinity[c.pair[0]] > profile.mean && profile.affinity[c.pair[1]] > profile.mean);
  }

  function overview(profile) {
    const [a, b] = profile.ranked;
    const lowest = profile.ranked[profile.ranked.length - 1];
    const parts = [];
    if (profile.balanced) {
      parts.push('You don’t lean too hard in any one direction. ' + cap(HIGH[a]) + ', but ' + HIGH[b] + ' too.');
      parts.push('You can move between moods and settings without losing yourself, which makes you easy company in almost any situation.');
      return parts.join(' ');
    }
    parts.push('At heart, ' + HIGH[a] + ', and ' + HIGH[b] + '.');
    const contrast = findContrast(profile);
    if (contrast) {
      parts.push('You’re a blend of contrasts. ' + contrast.text);
    } else {
      parts.push(LOW[lowest]);
    }
    return parts.join(' ');
  }

  function flavourWords(blend) {
    return blend.map((b, i) => {
      const last = i === blend.length - 1 && blend.length > 2;
      return cap(last && b.pct <= 15 ? 'occasionally ' + b.spice.word : b.spice.word);
    });
  }

  function spiceLines(blend) {
    return blend.map((b, i) => ({
      role: roleFor(i, blend.length, b.spice),
      line: b.pct >= 25 ? b.spice.strong : b.spice.subtle
    }));
  }

  function dishText(result) {
    const { blend, dish } = result;
    const first = blend[0], second = blend[1], last = blend[blend.length - 1];
    // Describes the player's own mix of the dish's real spices, without tying any
    // spice to a specific part of the dish.
    const lower = (b) => b.spice.name.toLowerCase();
    const mapping =
      'Your version is ' + first.pct + '% ' + lower(first) + ', so it’s ' + first.spice.word + ' at heart, with ' +
      article(second.spice.word) + ' ' + second.spice.word + ' note from ' + lower(second) +
      (blend.length > 2 ? ' and ' + article(last.spice.word) + ' ' + last.spice.word + ' finish from ' + lower(last) : '') + '.';
    return { story: dish.story, mapping };
  }

  function profileRecap(blend) {
    const last = blend[blend.length - 1];
    const middle = blend.slice(1, -1);
    return [
      { label: 'Foundation', text: blend[0].spice.essence },
      { label: 'Main flavour', text: middle.length ? listJoin(middle.map((m) => m.spice.word)) : blend[1].spice.essence },
      { label: 'Finishing touch', text: article(last.spice.word) + ' ' + last.spice.word + (last.spice.kick ? ' spark' : ' finish') }
    ];
  }

  function shareText(result) {
    const t = result.text;
    const mix = result.blend.map((b) => b.pct + '% ' + b.spice.name).join(', ');
    return 'My secret ingredient blend is ' + t.name + ' (' + mix + '). My signature dish: ' + result.dish.name + '. ' +
      result.dish.subtitle + ' What dish would you be?';
  }

  // Trading-card details. Playful, never diagnostic.
  const STRENGTH = {
    explore: 'Up for anything', energy: 'Gets things moving', steady: 'Rock-solid reliable', warmth: 'Makes people feel at home',
    space: 'Happy in their own company', observe: 'Notices everything', drive: 'Sees things through', flow: 'Rolls with any change', play: 'Lights up a room'
  };
  const CLICKS = {
    explore: 'Fellow adventurers', energy: 'Anyone with a plan', steady: 'People who show up', warmth: 'Big-hearted friends',
    space: 'Low-key company', observe: 'Deep talkers', drive: 'Fellow go-getters', flow: 'Easy-going types', play: 'Anyone who laughs easily'
  };
  const WEAKNESS = {
    explore: 'Repeat orders', energy: 'Sitting still', steady: 'Last-minute changes', warmth: 'Saying no',
    space: 'Crowded rooms', observe: 'Small talk', drive: 'Indecision', flow: 'Rigid plans', play: 'Serious meetings'
  };
  const RESISTS = {
    explore: 'Boredom', energy: 'Slow Mondays', steady: 'Chaos', warmth: 'Bad vibes',
    space: 'Peer pressure', observe: 'Mind games', drive: 'Setbacks', flow: 'Plot twists', play: 'Gloomy days'
  };
  const RECHARGE = {
    explore: 'New places', energy: 'A good sweat', steady: 'Home cooking', warmth: 'Good company',
    space: 'Alone time', observe: 'Quiet details', drive: 'Ticking boxes', flow: 'Going with it', play: 'A good laugh'
  };

  function cardInfo(result) {
    const { profile, blend, dish } = result;
    const r = profile.ranked;
    const raw = 30 + blend.reduce((sum, b) => sum + (b.spice.heat || 0) * b.pct, 0);
    const heat = Math.max(30, Math.min(160, Math.round(raw / 10) * 10));
    return {
      heat,
      rarity: blend.length >= 5 ? 3 : blend.length === 4 ? 2 : 1,
      origin: dish.origin,
      number: SI.DISHES.indexOf(dish) + 1,
      total: SI.DISHES.length,
      strengths: r.slice(0, 3).map((d) => STRENGTH[d]),
      weakness: WEAKNESS[r[0]],
      recharge: RECHARGE[r[0]],
      clicks: CLICKS[r[1]],
      resists: RESISTS[r[2]],
      moves: blend.slice(0, 2).map((b) => ({
        spice: b.spice, pct: b.pct, name: b.spice.move.name, text: b.spice.move.text,
        cost: b.pct >= 40 ? 3 : b.pct >= 25 ? 2 : 1
      }))
    };
  }

  function compose(result) {
    const { profile, blend } = result;
    const text = {
      name: blendName(blend, profile),
      overview: overview(profile),
      flavour: flavourWords(blend),
      spices: spiceLines(blend),
      dish: dishText(result),
      recap: profileRecap(blend),
      card: cardInfo(result)
    };
    result.text = text;
    text.share = shareText(result);
    return text;
  }

  SI.narrative = { compose, HIGH, LOW, CONTRASTS };
})(globalThis.SI = globalThis.SI || {});
