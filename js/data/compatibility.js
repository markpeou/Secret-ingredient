/*
 * Compatibility chart: how the nine hidden traits get along.
 * Every unordered pair of traits (45 in all, including a trait with itself) has
 *
 *   score – 2 perfect complement, 1 easy, 0 neutral, -1 friction, -2 spicy tension
 *   name  – the pairing's nickname, shown to players
 *   line  – one playful sentence about the pair, written to "you two"
 *
 * Players never see trait names, only spices, so names and lines avoid them.
 * Like a horoscope chart, it's for fun: playful, never diagnostic.
 */
(function (SI) {
  SI.PAIRINGS = {
    /* ---------- Explore ---------- */
    'explore|explore': { score: 1, name: 'Fellow Adventurers', line: 'You’ll both say yes to the detour. Someone still needs to book the hotel.' },
    'explore|energy': { score: 1, name: 'Road Trip', line: 'Same direction, same speed, windows down.' },
    'explore|steady': { score: 2, name: 'Adventurer & Anchor', line: 'One finds the new thing, the other makes it actually happen.' },
    'explore|warmth': { score: 1, name: 'Tour Guide', line: 'One brings back the stories, the other makes everyone feel part of them.' },
    'explore|space': { score: 0, name: 'Solo Travellers', line: 'You both love to wander, just not necessarily together.' },
    'explore|observe': { score: 1, name: 'Field Researchers', line: 'One goes looking, the other notices what you found.' },
    'explore|drive': { score: 1, name: 'Expedition', line: 'One spots the mountain, the other plans the route up.' },
    'explore|flow': { score: 1, name: 'Yes, And', line: 'Any plan works for you two, as long as it’s a new one.' },
    'explore|play': { score: 1, name: 'Mischief Makers', line: 'Curiosity plus cheek. Things are about to get interesting.' },

    /* ---------- Energy ---------- */
    'energy|energy': { score: 0, name: 'Double Espresso', line: 'Brilliant for an hour. Someone will need a nap.' },
    'energy|steady': { score: -1, name: 'Spark vs Routine', line: 'One wants to shake things up, the other likes them right where they are.' },
    'energy|warmth': { score: 1, name: 'Hosts with the Most', line: 'Between you, nobody at the party gets left out.' },
    'energy|space': { score: -2, name: 'Party vs Recharge', line: 'One wants the party, the other needs a quiet night in.' },
    'energy|observe': { score: -1, name: 'Stage & Critic', line: 'One’s performing, the other’s quietly taking notes.' },
    'energy|drive': { score: 0, name: 'Full Throttle', line: 'Unstoppable together, as long as someone remembers to stop.' },
    'energy|flow': { score: 2, name: 'Spark & Glide', line: 'One gets things going, the other keeps them running smoothly.' },
    'energy|play': { score: 1, name: 'Party Starters', line: 'Put a song on and you’re both up.' },

    /* ---------- Steady ---------- */
    'steady|steady': { score: 1, name: 'Old Reliables', line: 'Comfortable, dependable and always on time.' },
    'steady|warmth': { score: 1, name: 'Home Base', line: 'Together you make any place feel like home.' },
    'steady|space': { score: 1, name: 'Quiet Sunday', line: 'Comfortable silences and no surprises. Bliss.' },
    'steady|observe': { score: 1, name: 'Master Planners', line: 'Nothing gets past you two, and nothing gets forgotten.' },
    'steady|drive': { score: 1, name: 'Builder & Boss', line: 'One sets the goal, the other makes sure it’s built properly.' },
    'steady|flow': { score: -1, name: 'Plan vs Wing It', line: 'One made a spreadsheet. The other forgot there was a plan.' },
    'steady|play': { score: -1, name: 'Rules vs Pranks', line: 'One keeps the rules, the other keeps testing them.' },

    /* ---------- Warmth ---------- */
    'warmth|warmth': { score: 1, name: 'Group Hug', line: 'Kind, caring and probably feeding each other.' },
    'warmth|space': { score: -1, name: 'Hugger vs Personal Space', line: 'One leans in, the other needs a little room.' },
    'warmth|observe': { score: 1, name: 'Listener & Carer', line: 'One notices how people are doing, the other makes them feel better.' },
    'warmth|drive': { score: 2, name: 'Captain & Heart', line: 'One sets the direction, the other brings everyone along.' },
    'warmth|flow': { score: 1, name: 'Easy Company', line: 'Effortless to be around, together or apart.' },
    'warmth|play': { score: 1, name: 'Fun Aunt & Uncle', line: 'Warmth and silliness in equal measure.' },

    /* ---------- Space ---------- */
    'space|space': { score: 1, name: 'Parallel Play', line: 'Happy in the same room doing completely different things.' },
    'space|observe': { score: 1, name: 'Quiet Ones', line: 'Few words, lots understood.' },
    'space|drive': { score: -1, name: 'Don’t Tell Me What to Do', line: 'One likes to steer, the other likes to find their own way.' },
    'space|flow': { score: 1, name: 'Slow Travellers', line: 'No rush, no fuss, no itinerary.' },
    'space|play': { score: 2, name: 'Wallflower & Instigator', line: 'One coaxes the other out, the other keeps them grounded.' },

    /* ---------- Observe ---------- */
    'observe|observe': { score: -1, name: 'Two Overthinkers', line: 'Great conversations. Decisions may take a while.' },
    'observe|drive': { score: 1, name: 'Strategist & General', line: 'One sees all the angles, the other makes the call.' },
    'observe|flow': { score: -1, name: 'Overthinker vs Shrugger', line: 'One has thought it through twice. The other’s already gone with it.' },
    'observe|play': { score: 2, name: 'Wit & Audience', line: 'One spots the joke, the other runs with it.' },

    /* ---------- Drive ---------- */
    'drive|drive': { score: -2, name: 'Two Captains', line: 'Two people, one steering wheel. Take turns.' },
    'drive|flow': { score: 1, name: 'Leader & Wingmate', line: 'One picks the direction, the other is happy to come along.' },
    'drive|play': { score: -1, name: 'Boss vs Class Clown', line: 'One wants it done, the other wants it fun.' },

    /* ---------- Flow & play ---------- */
    'flow|flow': { score: -1, name: 'Nobody Decides', line: 'Lovely company. You’ll never pick a restaurant.' },
    'flow|play': { score: 1, name: 'Improv Duo', line: 'You make it up as you go, and somehow it works.' },
    'play|play': { score: 1, name: 'Double Trouble', line: 'Cheeky, chaotic and very good company.' }
  };
})(globalThis.SI = globalThis.SI || {});
