/*
 * Question bank.
 *
 * Each option carries hidden "signals" across nine broad dimensions.
 * Weights are 1–3. Nothing here is ever shown to the participant except
 * the prompt and option text.
 *
 * Dimensions:
 *   explore  – novelty, curiosity, the untried
 *   energy   – action, momentum, physicality
 *   steady   – stability, practicality, the reliable
 *   warmth   – connection, care, people
 *   space    – independence, room of one's own
 *   observe  – noticing, reflecting, reading people and places
 *   drive    – determination, intensity, follow-through
 *   flow     – adaptability, spontaneity, bending with change
 *   play     – fun, mischief, expressiveness
 */
(function (SI) {
  SI.DIMENSIONS = ['explore', 'energy', 'steady', 'warmth', 'space', 'observe', 'drive', 'flow', 'play'];

  SI.QUESTIONS_PER_SESSION = 10;

  SI.QUESTIONS = [
    {
      id: 'saturday',
      title: 'The perfect Saturday',
      prompt: 'You’ve got a completely free Saturday. No commitments, no expectations. What sounds best?',
      options: [
        { text: 'Head somewhere I’ve never been.', s: { explore: 3, energy: 1 } },
        { text: 'Spend time with my favourite people.', s: { warmth: 3, steady: 1 } },
        { text: 'Get outside and do something active.', s: { energy: 3, drive: 1 } },
        { text: 'Enjoy a slow day and recharge.', s: { space: 2, steady: 2 } },
        { text: 'Start something I’ve been meaning to do.', s: { drive: 2, observe: 1, steady: 1 } },
        { text: 'See where the day takes me.', s: { flow: 3, explore: 1 } }
      ]
    },
    {
      id: 'group',
      title: 'The group dynamic',
      prompt: 'You’re out with a group of friends, and nobody can decide what to do next. What are you most likely to do?',
      options: [
        { text: 'Suggest something and get everyone moving.', s: { drive: 2, energy: 2 } },
        { text: 'Find out what everyone actually wants.', s: { warmth: 2, observe: 2 } },
        { text: 'Throw out a wild idea to shake things up.', s: { play: 3, explore: 1 } },
        { text: 'Go with the flow and see what happens.', s: { flow: 3, warmth: 1 } },
        { text: 'Suggest splitting up if everyone wants different things.', s: { space: 2, drive: 1, steady: 1 } },
        { text: 'Quietly observe until something feels right.', s: { observe: 3, space: 1 } }
      ]
    },
    {
      id: 'invitation',
      title: 'The unexpected invitation',
      prompt: 'A friend invites you to something completely outside your usual routine. What’s your first instinct?',
      options: [
        { text: 'Absolutely. When are we going?', s: { explore: 2, energy: 2 } },
        { text: 'Tell me more before I commit.', s: { observe: 2, steady: 2 } },
        { text: 'I’m in, as long as someone comes with me.', s: { warmth: 3, explore: 1 } },
        { text: 'Depends on how much energy I have.', s: { space: 2, observe: 1, flow: 1 } },
        { text: 'Probably not, but I appreciate the invitation.', s: { steady: 2, space: 2 } },
        { text: 'I’ll decide on the day.', s: { flow: 3, play: 1 } }
      ]
    },
    {
      id: 'frustration',
      title: 'The little frustration',
      prompt: 'Which situation gets under your skin the most?',
      options: [
        { text: 'People who can’t make up their minds.', s: { drive: 3, energy: 1 } },
        { text: 'Feeling like nobody really understands me.', s: { observe: 2, space: 1, warmth: 1 } },
        { text: 'Being stuck doing the same thing over and over.', s: { explore: 3, energy: 1 } },
        { text: 'People who make everything unnecessarily complicated.', s: { steady: 2, flow: 1, drive: 1 } },
        { text: 'Feeling like I’m not making progress.', s: { drive: 3, steady: 1 } },
        { text: 'When people don’t consider how their actions affect others.', s: { warmth: 3, observe: 1 } }
      ]
    },
    {
      id: 'friendship',
      title: 'Your role in a friendship',
      prompt: 'Which sounds most like you?',
      options: [
        { text: 'I’m the one who makes the plans happen.', s: { drive: 2, steady: 1, energy: 1 } },
        { text: 'I’m the person people come to when they need to talk.', s: { warmth: 3, observe: 1 } },
        { text: 'I’m the one who keeps things interesting.', s: { play: 3, explore: 1 } },
        { text: 'I’m happy to join in, but I need my own space, too.', s: { space: 3, flow: 1 } },
        { text: 'I’m the one who gets everyone out of their comfort zone.', s: { explore: 2, energy: 1, drive: 1 } },
        { text: 'I’m usually the one who notices when something is off.', s: { observe: 3, warmth: 1 } }
      ]
    },
    {
      id: 'menu',
      title: 'The unfamiliar menu',
      prompt: 'You’re at a restaurant you’ve never visited. What do you order?',
      options: [
        { text: 'The most unusual thing on the menu.', s: { explore: 3, play: 1 } },
        { text: 'Something familiar that I know I’ll enjoy.', s: { steady: 3, space: 1 } },
        { text: 'Ask the waiter what they recommend.', s: { warmth: 2, flow: 2 } },
        { text: 'Whatever looks freshest or most interesting.', s: { observe: 2, explore: 1, flow: 1 } },
        { text: 'Something different from what everyone else is ordering.', s: { space: 2, play: 1, explore: 1 } },
        { text: 'Whatever I’m craving at that moment.', s: { flow: 2, energy: 1, play: 1 } }
      ]
    },
    {
      id: 'difficult',
      title: 'When things get difficult',
      prompt: 'You’ve put a lot of effort into something, and it isn’t working out. What do you tend to do?',
      options: [
        { text: 'Keep going until I crack it.', s: { drive: 3, energy: 1 } },
        { text: 'Step back and work out what’s going wrong.', s: { observe: 3, steady: 1 } },
        { text: 'Try a completely different approach.', s: { flow: 2, explore: 2 } },
        { text: 'Talk it through with someone I trust.', s: { warmth: 3, observe: 1 } },
        { text: 'Take a break and return to it later.', s: { space: 2, steady: 1, flow: 1 } },
        { text: 'Accept that sometimes it’s time to move on.', s: { flow: 3, space: 1 } }
      ]
    },
    {
      id: 'environment',
      title: 'Your ideal environment',
      prompt: 'Which setting feels most appealing?',
      options: [
        { text: 'A lively city full of things to discover.', s: { explore: 2, energy: 2, play: 1 } },
        { text: 'A quiet place surrounded by nature.', s: { space: 3, steady: 1 } },
        { text: 'A cosy space filled with familiar people.', s: { warmth: 3, steady: 1 } },
        { text: 'Somewhere beautiful, considered and full of little details.', s: { observe: 3, play: 1 } },
        { text: 'Somewhere physically challenging, where I can test myself.', s: { drive: 3, energy: 2 } },
        { text: 'Somewhere new, where nobody knows me.', s: { explore: 2, space: 2 } }
      ]
    },
    {
      id: 'compliment',
      title: 'The unexpected compliment',
      prompt: 'Which compliment would mean the most to you?',
      options: [
        { text: '“You make things happen.”', s: { drive: 3, energy: 1 } },
        { text: '“I feel like I can be myself around you.”', s: { warmth: 3, flow: 1 } },
        { text: '“There’s always something interesting about you.”', s: { play: 2, explore: 2 } },
        { text: '“You’re stronger than you realise.”', s: { flow: 2, drive: 1, steady: 1 } },
        { text: '“You understand people in a way most don’t.”', s: { observe: 3, warmth: 1 } },
        { text: '“You make life more fun.”', s: { play: 3, energy: 1 } }
      ]
    },
    {
      id: 'change',
      title: 'The last-minute change',
      prompt: 'You’ve carefully planned a weekend away. The weather ruins your plans. What’s your response?',
      options: [
        { text: 'Find another activity and keep the day going.', s: { energy: 2, flow: 2 } },
        { text: 'I’m disappointed, but I’ll make the best of it.', s: { steady: 2, flow: 2 } },
        { text: 'Honestly, I secretly enjoy having an excuse to do nothing.', s: { space: 3, play: 1 } },
        { text: 'Rally everyone and come up with a new plan.', s: { drive: 2, warmth: 2 } },
        { text: 'Take the opportunity to explore somewhere unexpected.', s: { explore: 3, flow: 1 } },
        { text: 'I need a moment to adjust before I can enjoy the alternative.', s: { observe: 2, steady: 2 } }
      ]
    },
    {
      id: 'decision',
      title: 'The big decision',
      prompt: 'You have to make a decision that really matters. How do you usually land on an answer?',
      options: [
        { text: 'Go with my gut, usually quite quickly.', s: { drive: 2, flow: 1, energy: 1 } },
        { text: 'Research it until I feel properly sure.', s: { steady: 2, observe: 2 } },
        { text: 'Ask the people whose opinions I trust.', s: { warmth: 3, observe: 1 } },
        { text: 'Picture the most interesting version and go with that.', s: { explore: 2, play: 2 } },
        { text: 'Sleep on it and let the answer come to me.', s: { space: 2, flow: 2 } },
        { text: 'Pick something and adjust as I go.', s: { flow: 3, energy: 1 } }
      ]
    },
    {
      id: 'newplace',
      title: 'First impressions',
      prompt: 'You walk into a place you’ve never been before. What do you notice first?',
      options: [
        { text: 'The people and the general mood.', s: { warmth: 2, observe: 2 } },
        { text: 'The little details everyone else walks past.', s: { observe: 3, space: 1 } },
        { text: 'Where the quiet corners are.', s: { space: 2, steady: 2 } },
        { text: 'What’s happening and where I can join in.', s: { energy: 2, play: 2 } },
        { text: 'Whatever seems out of place or unexpected.', s: { explore: 2, observe: 1, play: 1 } },
        { text: 'Whether it was worth the trip.', s: { drive: 2, steady: 2 } }
      ]
    },
    {
      id: 'groupchat',
      title: 'The group chat',
      prompt: 'You’re in a busy group chat with friends. What’s your usual style?',
      options: [
        { text: 'Send the memes and keep it buzzing.', s: { play: 3, energy: 1 } },
        { text: 'Pin down the actual plan before it drifts.', s: { drive: 2, steady: 2 } },
        { text: 'Check in on whoever’s gone quiet.', s: { warmth: 3, observe: 1 } },
        { text: 'Read everything, reply now and then.', s: { observe: 2, space: 2 } },
        { text: 'Drop in with something completely left-field.', s: { explore: 2, play: 1, space: 1 } },
        { text: 'Mute it and catch up whenever.', s: { space: 3, flow: 1 } }
      ]
    },
    {
      id: 'freehour',
      title: 'The surprise free hour',
      prompt: 'Your afternoon unexpectedly frees up for an hour. What happens?',
      options: [
        { text: 'Tackle something from the to-do list.', s: { drive: 2, steady: 2 } },
        { text: 'Call someone I’ve been meaning to catch up with.', s: { warmth: 3, play: 1 } },
        { text: 'Go for a walk with no particular destination.', s: { flow: 2, explore: 1, space: 1 } },
        { text: 'Fall down a rabbit hole about something random.', s: { explore: 2, observe: 2 } },
        { text: 'Do absolutely nothing, guilt-free.', s: { space: 3, steady: 1 } },
        { text: 'Squeeze in a workout or a quick game of something.', s: { energy: 3, drive: 1 } }
      ]
    }
  ];
})(globalThis.SI = globalThis.SI || {});
