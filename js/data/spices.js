/*
 * Spice library, grouped by the part of the plant each spice comes from.
 *
 *   family   – bark | seed | fruit | flower | root (shown on the card back)
 *   vector   – how strongly each hidden dimension expresses this spice
 *   word     – single flavour-profile word
 *   adj/noun – used to build blend names: "The {adj of #2} {noun of #1}"
 *   short    – optional shorter label for tight spaces
 *   move     – the signature move shown on the trading card
 *   essence  – short trait line shown in recaps and on the card back
 *   strong   – explanation when the spice is a big part of the blend (>= 25%)
 *   subtle   – explanation when it is a smaller accent (< 25%)
 *   kick     – true if it reads naturally as a "hidden kick" finisher
 *   heat     – how much it adds to the card's Heat score
 *   colour   – character / bar colour; text is the readable label colour on top of it
 *
 * Dimensions: explore, energy, steady, warmth, space, observe, drive, flow, play.
 */
(function (SI) {
  SI.SPICE_FAMILIES = { bark: 'Bark', seed: 'Seed & pod', fruit: 'Fruit & berry', flower: 'Flower & stigma', root: 'Root & rhizome' };

  SI.SPICES = [
    /* ---------- Bark ---------- */
    {
      id: 'cinnamon', name: 'Cinnamon', family: 'bark', colour: '#A85A2A', text: '#FFFFFF', heat: 0.1,
      vector: { warmth: 3, play: 1, steady: 1 },
      word: 'warm', adj: 'Warm', noun: 'Heart', kick: false,
      move: { name: 'Warm Welcome', text: 'Makes everyone at the table feel at home. Soothes hurt feelings instantly.' },
      essence: 'warm, affectionate and comforting',
      strong: 'People are the centre of it for you. You make others feel welcome without seeming to try.',
      subtle: 'An undercurrent of warmth. You may not lead with it, but the people close to you know it’s there.'
    },

    /* ---------- Seeds & pods ---------- */
    {
      id: 'cardamom', name: 'Cardamom', family: 'seed', colour: '#6E9A4A', text: '#FFFFFF', heat: 0,
      vector: { space: 3, observe: 2 },
      word: 'independent', adj: 'Quiet', noun: 'Original', kick: false,
      move: { name: 'Quiet Depth', text: 'Keeps a little mystery in reserve. Gets more interesting the longer you know them.' },
      essence: 'thoughtful, independent and quietly distinctive',
      strong: 'You do things your own way and you need room to think. That independence is a big part of your flavour.',
      subtle: 'You keep a private corner of yourself, and it adds a depth people only notice over time.'
    },
    {
      id: 'coriander', name: 'Coriander seed', short: 'Coriander', family: 'seed', colour: '#C9A86A', text: '#3B1E12', heat: 0,
      vector: { flow: 2, warmth: 1, steady: 1 },
      word: 'easy-going', adj: 'Breezy', noun: 'Friend', kick: false,
      move: { name: 'Bright Side', text: 'Lifts the mood of any room and gets along with absolutely everyone.' },
      essence: 'bright, easy-going and friendly',
      strong: 'You’re easy to be around. You fit in anywhere and make things feel lighter without any fuss.',
      subtle: 'A bright, citrusy note that keeps the rest of your blend from getting too heavy.'
    },
    {
      id: 'cumin', name: 'Cumin', family: 'seed', colour: '#8C6A2F', text: '#FFFFFF', heat: 0,
      vector: { steady: 3, drive: 1 },
      word: 'grounded', adj: 'Steady', noun: 'Anchor', kick: false,
      move: { name: 'Steady Simmer', text: 'Keeps everything ticking along. Totally reliable when it counts.' },
      essence: 'grounded, practical and reliable',
      strong: 'You’re the reliable one. You like things that work, and people lean on you more than you realise.',
      subtle: 'A grounding note that keeps the rest of your blend from floating off.'
    },
    {
      id: 'fennel', name: 'Fennel seed', short: 'Fennel', family: 'seed', colour: '#9DBF6B', text: '#3B1E12', heat: 0,
      vector: { space: 2, warmth: 1, flow: 1 },
      word: 'gentle', adj: 'Gentle', noun: 'Soul', kick: false,
      move: { name: 'Calm Down', text: 'Soothes the room. Everyone breathes out a little when they’re around.' },
      essence: 'gentle, soothing and quietly sweet',
      strong: 'You have a calming effect on people. You don’t need to be loud to leave an impression.',
      subtle: 'A soft, sweet note that rounds off your sharper edges.'
    },
    {
      id: 'fenugreek', name: 'Fenugreek', family: 'seed', colour: '#D9A93B', text: '#3B1E12', heat: 0,
      vector: { observe: 2, steady: 2 },
      word: 'deep', adj: 'Deep', noun: 'Old Soul', kick: false,
      move: { name: 'Slow Burn', text: 'Takes a while to get to know, then becomes everyone’s favourite.' },
      essence: 'deep, bittersweet and loyal',
      strong: 'You’re a bit of an acquired taste, in the best way. Once people get you, they’re hooked for life.',
      subtle: 'A bittersweet depth that makes the whole blend more interesting.'
    },
    {
      id: 'mustard', name: 'Mustard seed', short: 'Mustard', family: 'seed', colour: '#F2D44A', text: '#3B1E12', heat: 0.6,
      vector: { energy: 2, drive: 1, play: 1 },
      word: 'zippy', adj: 'Zippy', noun: 'Live Wire', kick: true,
      move: { name: 'Pop and Sizzle', text: 'Bursts into action the moment things heat up. Never a dull moment.' },
      essence: 'zippy, quick and full of pep',
      strong: 'You come alive when things get going. You’re quick off the mark and bring a fizz to everything.',
      subtle: 'A little pop that shows up exactly when things need livening up.'
    },
    {
      id: 'nutmeg', name: 'Nutmeg', family: 'seed', colour: '#7A4B32', text: '#FFFFFF', heat: 0,
      vector: { warmth: 2, steady: 1, space: 1 },
      word: 'cosy', adj: 'Cosy', noun: 'Classic', kick: false,
      move: { name: 'Fireside Glow', text: 'Turns any evening into a cosy one. Smells like home.' },
      essence: 'cosy, nostalgic and gently warm',
      strong: 'You make spaces feel comfortable. People relax around you and stay longer than they planned.',
      subtle: 'A whisper of cosiness. Just a grating, but everyone would miss it.'
    },
    {
      id: 'sesame', name: 'Sesame', family: 'seed', colour: '#EADBB8', text: '#3B1E12', heat: 0,
      vector: { warmth: 2, energy: 1, flow: 1 },
      word: 'sociable', adj: 'Sociable', noun: 'Connector', kick: false,
      move: { name: 'Sprinkle Everywhere', text: 'Shows up at every gathering and somehow knows everyone there.' },
      essence: 'sociable, nutty and good company',
      strong: 'You’re the connector. You bring people together and make introductions without thinking about it.',
      subtle: 'A nutty, friendly finish that makes everything a little more inviting.'
    },
    {
      id: 'caraway', name: 'Caraway', family: 'seed', colour: '#5E5436', text: '#FFFFFF', heat: 0,
      vector: { steady: 2, observe: 1, space: 1 },
      word: 'traditional', adj: 'Old-School', noun: 'Keeper', kick: false,
      move: { name: 'Family Recipe', text: 'Remembers how things are done and keeps the good traditions alive.' },
      essence: 'traditional, earthy and dependable',
      strong: 'You value the tried and true. You remember birthdays, keep rituals going and hold things together.',
      subtle: 'An earthy, old-world note that gives your blend roots.'
    },

    /* ---------- Fruits & berries ---------- */
    {
      id: 'blackpepper', name: 'Black pepper', family: 'fruit', colour: '#3E3633', text: '#FFFFFF', heat: 0.9,
      vector: { drive: 2, observe: 1, steady: 1 },
      word: 'direct', adj: 'Decisive', noun: 'Straight Shooter', kick: true,
      move: { name: 'Straight Talk', text: 'Cuts through the waffle and makes the call while others are still deciding.' },
      essence: 'direct, sharp-witted and decisive',
      strong: 'You like clarity. You say what you mean, make the call, and get on with it.',
      subtle: 'A sharp edge that comes out when a decision needs making and nobody else will make it.'
    },
    {
      id: 'pinkpepper', name: 'Pink peppercorn', short: 'Pink pepper', family: 'fruit', colour: '#E06A90', text: '#3B1E12', heat: 0.4,
      vector: { play: 3, warmth: 1, flow: 1 },
      word: 'playful', adj: 'Mischievous', noun: 'Charmer', kick: true,
      move: { name: 'Cheeky Sprinkle', text: 'Adds a dash of mischief. Soon the whole table is giggling.' },
      essence: 'playful, charming and a little mischievous',
      strong: 'You have a lightness that makes ordinary moments more fun, and people tend to relax around you.',
      subtle: 'A sprinkle of mischief that surprises people who only know your serious side.'
    },
    {
      id: 'allspice', name: 'Allspice', family: 'fruit', colour: '#6B3A2A', text: '#FFFFFF', heat: 0.2,
      vector: { flow: 2, explore: 1, warmth: 1, play: 1 },
      word: 'versatile', adj: 'Versatile', noun: 'All-Rounder', kick: false,
      move: { name: 'Jack of All Trades', text: 'Can do a bit of everything, and usually ends up doing it all well.' },
      essence: 'versatile, generous and hard to pin down',
      strong: 'You’re a bit of everything at once. You adapt to whatever the moment needs and still feel like you.',
      subtle: 'A many-sided note that tastes a little like everything else in the jar.'
    },
    {
      id: 'chilli', name: 'Chilli', family: 'fruit', colour: '#D8342B', text: '#FFFFFF', heat: 1.4,
      vector: { drive: 3, energy: 2, play: 1 },
      word: 'fiery', adj: 'Fiery', noun: 'Spark', kick: true,
      move: { name: 'Turn Up the Heat', text: 'Goes all in when it matters. Everyone at the table feels the temperature rise.' },
      essence: 'bold, intense and quietly competitive',
      strong: 'There’s real heat in how you go after things. When you care, people can feel it.',
      subtle: 'Most of the time it stays in the background, but there’s a spark that shows up the moment something matters.'
    },
    {
      id: 'paprika', name: 'Paprika', family: 'fruit', colour: '#E8743B', text: '#3B1E12', heat: 0.5,
      vector: { play: 2, energy: 2, warmth: 1 },
      word: 'vibrant', adj: 'Vibrant', noun: 'Showstopper', kick: false,
      move: { name: 'Colour Splash', text: 'Brightens up the whole plate. Impossible to miss, in a good way.' },
      essence: 'vibrant, smoky and full of colour',
      strong: 'You bring colour to everything. People notice when you walk in, and the room gets warmer.',
      subtle: 'A smoky splash of colour that makes the whole blend look as good as it tastes.'
    },
    {
      id: 'staranise', name: 'Star anise', family: 'fruit', colour: '#6A3A5E', text: '#FFFFFF', heat: 0.3,
      vector: { explore: 2, space: 1, play: 1, observe: 1 },
      word: 'intriguing', adj: 'Mysterious', noun: 'Wildcard', kick: true,
      move: { name: 'Plot Twist', text: 'Does the one thing nobody saw coming, and somehow it works.' },
      essence: 'unconventional, imaginative and intriguing',
      strong: 'You see things from an unusual angle. It keeps people guessing, in a good way.',
      subtle: 'A slightly unexpected note. Just when people think they have you figured out, you surprise them.'
    },
    {
      id: 'vanilla', name: 'Vanilla', family: 'fruit', colour: '#F3E2B3', text: '#3B1E12', heat: 0,
      vector: { steady: 2, warmth: 2, observe: 1 },
      word: 'sweet', adj: 'Sweet', noun: 'Softie', kick: false,
      move: { name: 'Secret Softie', text: 'Looks simple, turns out to be the most complex one in the room.' },
      essence: 'sweet, comforting and underrated',
      strong: 'People call it plain, but real vanilla is anything but. You’re comforting, and far deeper than you let on.',
      subtle: 'A sweet, rounding note that makes everything around it taste better.'
    },
    {
      id: 'tamarind', name: 'Tamarind', family: 'fruit', colour: '#8A5A3C', text: '#FFFFFF', heat: 0,
      vector: { play: 2, explore: 1, flow: 1, drive: 1 },
      word: 'tangy', adj: 'Tangy', noun: 'Rascal', kick: true,
      move: { name: 'Sweet and Sour', text: 'Sweet one moment, sharp the next. Keeps everyone on their toes.' },
      essence: 'tangy, cheeky and full of contrasts',
      strong: 'You’re a sweet-and-sour mix. Kind and cheeky at the same time, and people love the contrast.',
      subtle: 'A tangy twist that stops things from ever getting too predictable.'
    },
    {
      id: 'sichuan', name: 'Sichuan pepper', short: 'Sichuan', family: 'fruit', colour: '#A33A3A', text: '#FFFFFF', heat: 1.0,
      vector: { explore: 3, energy: 1, play: 1 },
      word: 'electric', adj: 'Electric', noun: 'Thrill-Seeker', kick: true,
      move: { name: 'Tingle Shock', text: 'Leaves everyone buzzing. You never forget your first time.' },
      essence: 'electric, thrilling and unforgettable',
      strong: 'You’re after the buzz of something new. You make life feel a little electric for everyone around you.',
      subtle: 'A tingle that sneaks up on people and stays with them long after.'
    },
    {
      id: 'sumac', name: 'Sumac', family: 'fruit', colour: '#8E2A4A', text: '#FFFFFF', heat: 0,
      vector: { observe: 2, play: 2 },
      word: 'zesty', adj: 'Zesty', noun: 'Wit', kick: true,
      move: { name: 'Quick Wit', text: 'Delivers the perfect one-liner at exactly the right moment.' },
      essence: 'zesty, sharp and quick-witted',
      strong: 'You have a sharp, zesty wit. You notice the funny side of things and say it out loud.',
      subtle: 'A zesty squeeze that brightens everything at the very end.'
    },

    /* ---------- Flowers & stigmas ---------- */
    {
      id: 'cloves', name: 'Cloves', family: 'flower', colour: '#5A3420', text: '#FFFFFF', heat: 0.3,
      vector: { drive: 2, space: 1, observe: 1 },
      word: 'intense', adj: 'Intense', noun: 'Powerhouse', kick: true,
      move: { name: 'Small but Mighty', text: 'Only takes one to change the whole mood. Never underestimate it.' },
      essence: 'intense, potent and small but mighty',
      strong: 'You have a quiet intensity. You don’t take up much space, but your impact is huge.',
      subtle: 'Just one or two, but you can taste them in every bite.'
    },
    {
      id: 'saffron', name: 'Saffron', family: 'flower', colour: '#C44C14', text: '#FFFFFF', heat: 0,
      vector: { observe: 3, warmth: 1, explore: 1 },
      word: 'perceptive', adj: 'Perceptive', noun: 'Artist', kick: false,
      move: { name: 'Fine Eye', text: 'Spots the tiny detail that everyone else walked straight past.' },
      essence: 'perceptive, refined and creative',
      strong: 'You notice what others walk past: details, moods, the thing nobody said out loud.',
      subtle: 'A fine thread of perception running through everything. A little goes a long way.'
    },
    {
      id: 'lavender', name: 'Lavender', family: 'flower', colour: '#9C82C9', text: '#3B1E12', heat: 0,
      vector: { space: 2, flow: 2 },
      word: 'dreamy', adj: 'Dreamy', noun: 'Daydreamer', kick: false,
      move: { name: 'Daydream', text: 'Drifts off somewhere lovely and takes everyone along for the ride.' },
      essence: 'dreamy, calm and a little romantic',
      strong: 'You have a dreamy, unhurried way about you. You know how to slow down and enjoy things.',
      subtle: 'A floral, dreamy note that makes everything feel a bit more relaxed.'
    },

    /* ---------- Roots & rhizomes ---------- */
    {
      id: 'ginger', name: 'Ginger', family: 'root', colour: '#E39B2E', text: '#3B1E12', heat: 0.8,
      vector: { energy: 3, explore: 2, flow: 1 },
      word: 'lively', adj: 'Restless', noun: 'Explorer', kick: true,
      move: { name: 'Zing Dash', text: 'Bolts out the door before anyone has finished asking where we’re going.' },
      essence: 'energetic, adventurous and resilient',
      strong: 'You bring momentum. You’d rather be out finding something than waiting for it to arrive.',
      subtle: 'A little zing that keeps you from settling into the same routine for too long.'
    },
    {
      id: 'turmeric', name: 'Turmeric', family: 'root', colour: '#F0A000', text: '#3B1E12', heat: 0.4,
      vector: { flow: 3, drive: 1, energy: 1 },
      word: 'adaptable', adj: 'Golden', noun: 'Shapeshifter', kick: false,
      move: { name: 'Golden Bounce', text: 'Bounces back from any setback, glowing brighter than before.' },
      essence: 'adaptable, resilient and purposeful',
      strong: 'You bend rather than break. When plans fall apart, you’re already working out the next one.',
      subtle: 'A resilient streak that helps you roll with things when they don’t go to plan.'
    },
    {
      id: 'galangal', name: 'Galangal', family: 'root', colour: '#E7B8A8', text: '#3B1E12', heat: 0.4,
      vector: { explore: 2, drive: 2 },
      word: 'daring', adj: 'Daring', noun: 'Pioneer', kick: true,
      move: { name: 'First Through the Door', text: 'Always the first to try it, and the one who reports back.' },
      essence: 'daring, sharp and pioneering',
      strong: 'You like to go first. You’ll try the thing everyone else is nervous about, and make it look easy.',
      subtle: 'A sharp, piney edge that adds a little daring to the whole blend.'
    }
  ];
})(globalThis.SI = globalThis.SI || {});
