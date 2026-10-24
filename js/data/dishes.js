/*
 * Dish library.
 *
 *   origin   – where the dish is from, shown on the dish screen and both card sides
 *   flag     – flag emoji for the origin; empty for regions spanning several countries
 *   spices   – the dish's real spice set with rough proportions (weights sum to ~1).
 *              A player's blend is only ever built from these spices, so every
 *              result makes culinary sense: no mustard in Phở, no ginger in lasagne.
 *              Spices are whole spices only (no fresh herbs, garlic or chilli paste).
 *   art      – parameters for the SVG illustration (js/ui/art.js).
 *
 * Dishes are matched by their spices and flavour, never by nationality or any
 * assumption about the player.
 */
(function (SI) {
  SI.DISHES = [
    /* ---------- East & Southeast Asia ---------- */
    {
      id: 'pho', name: 'Phở', origin: 'Vietnam', flag: '🇻🇳',
      subtitle: 'Grounded, comforting and quietly complex.',
      spices: { staranise: 0.25, cinnamon: 0.2, coriander: 0.15, ginger: 0.15, cloves: 0.15, cardamom: 0.1 },
      story: 'Phở looks simple, but that clear broth took hours of patience to get right. It’s comfort with hidden depth, the kind people come back to again and again.',
      art: { type: 'bowl', broth: '#E8B96A', noodles: true, toppings: ['beef', 'herbs', 'lime', 'chilli', 'sprouts'] }
    },
    {
      id: 'banhmi', name: 'Bánh mì', origin: 'Vietnam', flag: '🇻🇳',
      subtitle: 'Adaptable, resourceful and full of contrasts.',
      spices: { blackpepper: 0.35, chilli: 0.25, staranise: 0.15, fennel: 0.15, cinnamon: 0.1 },
      story: 'Bánh mì is the master of making things work. Crunchy and soft, rich and fresh, and endlessly adaptable to what’s on hand.',
      art: { type: 'banhmi' }
    },
    {
      id: 'greencurry', name: 'Thai green curry', origin: 'Thailand', flag: '🇹🇭',
      subtitle: 'Bright, energetic and perfectly balanced between sweet and heat.',
      spices: { galangal: 0.3, chilli: 0.25, coriander: 0.2, cumin: 0.15, blackpepper: 0.1 },
      story: 'Green curry is full of contrasts that somehow work together: creamy and sharp, sweet and hot, soothing and lively all at once.',
      art: { type: 'bowl', broth: '#A9C95E', noodles: false, toppings: ['basil', 'eggplant', 'chilli', 'basil'] }
    },
    {
      id: 'padthai', name: 'Pad Thai', origin: 'Thailand', flag: '🇹🇭',
      subtitle: 'Charming, approachable and easy to love.',
      spices: { tamarind: 0.5, chilli: 0.3, blackpepper: 0.2 },
      story: 'Pad Thai is the friend everyone gets along with: sweet, sour, salty and a little cheeky, and it adapts to whoever’s at the table.',
      art: { type: 'plate', style: 'padthai' }
    },
    {
      id: 'laksa', name: 'Curry laksa', origin: 'Malaysia & Singapore', flag: '🇲🇾🇸🇬',
      subtitle: 'Vibrant, rich and gloriously intense.',
      spices: { chilli: 0.25, galangal: 0.2, coriander: 0.2, turmeric: 0.15, cumin: 0.1, fennel: 0.1 },
      story: 'Laksa is a lot, in the best way. Rich, spicy, fragrant and layered, with something new in every spoonful.',
      art: { type: 'bowl', broth: '#E0612F', noodles: true, toppings: ['prawn', 'egg', 'tofu', 'chilli', 'sprouts'] }
    },
    {
      id: 'rendang', name: 'Beef rendang', origin: 'Indonesia', flag: '🇮🇩',
      subtitle: 'Rich, patient and deeply rewarding.',
      spices: { galangal: 0.2, chilli: 0.25, coriander: 0.15, turmeric: 0.1, cinnamon: 0.1, cloves: 0.1, staranise: 0.1 },
      story: 'Rendang is slow-cooked for hours until the coconut and spices cling to the beef. It can’t be rushed, and that’s exactly why it’s so good.',
      art: { type: 'plate', style: 'rendang' }
    },
    {
      id: 'ramen', name: 'Ramen with chilli oil', origin: 'Japan', flag: '🇯🇵',
      subtitle: 'Complex, comforting and with a kick when you least expect it.',
      spices: { sesame: 0.3, chilli: 0.25, ginger: 0.2, sichuan: 0.15, staranise: 0.1 },
      story: 'A good bowl of ramen is built in layers: a comforting foundation, plenty of depth, and a little heat that reveals itself over time.',
      art: { type: 'bowl', broth: '#E9C48C', noodles: true, toppings: ['egg', 'nori', 'chilliOil', 'spring'] }
    },
    {
      id: 'bibimbap', name: 'Bibimbap', origin: 'Korea', flag: '🇰🇷',
      subtitle: 'Versatile, balanced and full of distinct elements working together.',
      spices: { chilli: 0.4, sesame: 0.35, ginger: 0.15, blackpepper: 0.1 },
      story: 'Bibimbap keeps every element distinct and then mixes them into something better than the parts. Nothing dominates, and that’s the point.',
      art: { type: 'bibimbap' }
    },
    {
      id: 'hotpot', name: 'Sichuan hot pot', origin: 'China', flag: '🇨🇳',
      subtitle: 'Social, intense and impossible to ignore.',
      spices: { sichuan: 0.3, chilli: 0.3, staranise: 0.1, cinnamon: 0.1, fennel: 0.1, cloves: 0.1 },
      story: 'Hot pot is a bold, bubbling centrepiece that pulls everyone to the table. It’s intense, but it’s also an excuse to gather.',
      art: { type: 'hotpot' }
    },
    {
      id: 'duck', name: 'Five-spice duck', origin: 'China', flag: '🇨🇳',
      subtitle: 'Mysterious, layered and full of surprises.',
      spices: { staranise: 0.3, cinnamon: 0.2, fennel: 0.2, cloves: 0.15, sichuan: 0.15 },
      story: 'Five-spice duck keeps people guessing. Sweet, savoury and aromatic, with a flavour that’s hard to pin down and easy to remember.',
      art: { type: 'plate', style: 'duck', toppings: ['spring', 'staranise'] }
    },

    /* ---------- South Asia ---------- */
    {
      id: 'butterchicken', name: 'Butter chicken', origin: 'India', flag: '🇮🇳',
      subtitle: 'Warm, generous and confidently rich.',
      spices: { fenugreek: 0.2, chilli: 0.2, cardamom: 0.15, cumin: 0.15, coriander: 0.1, cinnamon: 0.1, cloves: 0.1 },
      story: 'Butter chicken is a warm hug of a dish. Everyone feels at home around it, and there’s more care in the sauce than first appears.',
      art: { type: 'bowl', broth: '#E5853A', noodles: false, toppings: ['cream', 'chicken', 'herbs', 'chicken'] }
    },
    {
      id: 'biryani', name: 'Biryani', origin: 'India', flag: '🇮🇳',
      subtitle: 'Layered, fragrant and a little bit grand.',
      spices: { saffron: 0.2, cardamom: 0.2, cinnamon: 0.15, cloves: 0.15, cumin: 0.15, blackpepper: 0.15 },
      story: 'Biryani is a dish of layers and patience: fragrant rice, tender meat and golden saffron, sealed and slow-cooked so every spoonful is a surprise.',
      art: { type: 'plate', style: 'biryani' }
    },
    {
      id: 'sambar', name: 'Sambar', origin: 'South India', flag: '🇮🇳',
      subtitle: 'Tangy, comforting and full of character.',
      spices: { tamarind: 0.25, mustard: 0.2, coriander: 0.15, fenugreek: 0.15, chilli: 0.15, cumin: 0.1 },
      story: 'Sambar is an everyday comfort that’s anything but plain: tangy tamarind, lentils and vegetables, finished with mustard seeds popping in hot oil.',
      art: { type: 'bowl', broth: '#C8742E', noodles: false, toppings: ['carrot', 'drumstick', 'curryLeaf', 'mustardSeeds', 'okra'] }
    },

    /* ---------- Middle East & Africa ---------- */
    {
      id: 'shawarma', name: 'Chicken shawarma', origin: 'The Levant', flag: '',
      subtitle: 'Bold, generous and great company.',
      spices: { cumin: 0.2, paprika: 0.2, coriander: 0.15, allspice: 0.15, cinnamon: 0.1, sumac: 0.1, turmeric: 0.1 },
      story: 'Shawarma turns slowly for hours, then gets wrapped up with pickles, sauce and something fresh. Every bite has a bit of everything.',
      art: { type: 'wrap' }
    },
    {
      id: 'shakshuka', name: 'Shakshuka', origin: 'North Africa', flag: '',
      subtitle: 'Direct, bold and gets the day started.',
      spices: { paprika: 0.35, cumin: 0.3, chilli: 0.2, blackpepper: 0.15 },
      story: 'Shakshuka gets straight to the point. Eggs, a punchy sauce and a pan, ready for whatever the day brings.',
      art: { type: 'pan' }
    },
    {
      id: 'tagine', name: 'Moroccan tagine', origin: 'Morocco', flag: '🇲🇦',
      subtitle: 'Patient, introspective and wonderfully complex.',
      spices: { cumin: 0.2, cinnamon: 0.2, ginger: 0.15, turmeric: 0.15, saffron: 0.15, coriander: 0.15 },
      story: 'A tagine can’t be rushed. It cooks slowly under its lid, quietly building flavour until the big reveal.',
      art: { type: 'tagine' }
    },
    {
      id: 'dorowat', name: 'Doro wat', origin: 'Ethiopia', flag: '🇪🇹',
      subtitle: 'Deep, warming and best shared.',
      spices: { chilli: 0.3, fenugreek: 0.15, cardamom: 0.15, ginger: 0.15, coriander: 0.15, cloves: 0.1 },
      story: 'Doro wat simmers for hours until the berbere-spiced sauce turns deep and glossy. It’s served on injera, torn and shared by hand from one plate.',
      art: { type: 'injera' }
    },
    {
      id: 'jollof', name: 'Jollof rice', origin: 'West Africa', flag: '',
      subtitle: 'Vibrant, celebratory and the life of every party.',
      spices: { chilli: 0.3, paprika: 0.25, ginger: 0.2, turmeric: 0.15, blackpepper: 0.1 },
      story: 'Jollof rice is the centrepiece of every celebration, rich with tomato and pepper. Everyone has an opinion on whose is best, and that’s half the fun.',
      art: { type: 'plate', style: 'jollof' }
    },

    /* ---------- Europe ---------- */
    {
      id: 'risotto', name: 'Saffron risotto', origin: 'Italy', flag: '🇮🇹',
      subtitle: 'Patient, attentive and quietly sophisticated.',
      spices: { saffron: 0.6, blackpepper: 0.2, nutmeg: 0.2 },
      story: 'Risotto rewards attention. It needs someone who notices the small moments and stirs at just the right time.',
      art: { type: 'plate', base: '#F2C14E', style: 'rice', toppings: ['herbs', 'cheese'] }
    },
    {
      id: 'lasagne', name: 'Lasagne', origin: 'Italy', flag: '🇮🇹',
      subtitle: 'Layered, generous and worth the wait.',
      spices: { nutmeg: 0.4, blackpepper: 0.35, fennel: 0.25 },
      story: 'Lasagne is built one careful layer at a time: rich sauce, silky pasta, creamy béchamel, then a golden top that everyone fights over.',
      art: { type: 'lasagne' }
    },
    {
      id: 'paella', name: 'Paella', origin: 'Spain', flag: '🇪🇸',
      subtitle: 'Bold, golden and made for a crowd.',
      spices: { saffron: 0.5, paprika: 0.35, blackpepper: 0.15 },
      story: 'Paella is cooked in one big pan and shared straight from it. The best part is the socarrat, the crispy rice at the bottom that rewards patience.',
      art: { type: 'paella' }
    },
    {
      id: 'provencal', name: 'Provençal roast chicken', origin: 'France', flag: '🇫🇷',
      subtitle: 'Relaxed, sunny and unhurried.',
      spices: { blackpepper: 0.4, fennel: 0.3, lavender: 0.3 },
      story: 'A Provençal roast chicken is a slow Sunday dish: golden skin, pan juices and a scattering of herbs and lavender from the hills.',
      art: { type: 'roast' }
    },
    {
      id: 'steak', name: 'Steak au poivre', origin: 'France', flag: '🇫🇷',
      subtitle: 'Bold, direct and quietly charming.',
      spices: { blackpepper: 0.5, pinkpepper: 0.3, mustard: 0.2 },
      story: 'Steak au poivre is confident and unfussy: a peppercorn crust, a quick sear and a creamy sauce. The pink peppercorns add a playful surprise.',
      art: { type: 'plate', style: 'steak' }
    },
    {
      id: 'goulash', name: 'Goulash', origin: 'Hungary', flag: '🇭🇺',
      subtitle: 'Hearty, honest and full of warmth.',
      spices: { paprika: 0.55, caraway: 0.3, blackpepper: 0.15 },
      story: 'Goulash is a big, generous stew that tastes better the next day. Paprika gives it its colour, and caraway gives it its soul.',
      art: { type: 'bowl', broth: '#A8401E', noodles: false, toppings: ['stewBeef', 'potato', 'cream', 'stewBeef', 'herbs'] }
    },
    {
      id: 'bratwurst', name: 'Bratwurst & sauerkraut', origin: 'Germany', flag: '🇩🇪',
      subtitle: 'Hearty, traditional and good with friends.',
      spices: { mustard: 0.35, caraway: 0.3, nutmeg: 0.2, blackpepper: 0.15 },
      story: 'Bratwurst is a dish for long tables and good company: grilled sausages, tangy sauerkraut and a proper dollop of mustard.',
      art: { type: 'plate', style: 'bratwurst' }
    },
    {
      id: 'kanelbullar', name: 'Cinnamon buns', origin: 'Sweden', flag: '🇸🇪',
      subtitle: 'Sweet, cosy and made for sharing.',
      spices: { cinnamon: 0.5, cardamom: 0.35, vanilla: 0.15 },
      story: 'Cinnamon buns are made to be shared over coffee with people you like. Swirled, soft and topped with pearl sugar, they’re a small, warm ritual.',
      art: { type: 'buns' }
    },

    /* ---------- The Americas & Caribbean ---------- */
    {
      id: 'tacos', name: 'Tacos al pastor', origin: 'Mexico', flag: '🇲🇽',
      subtitle: 'Social, playful and made for sharing.',
      spices: { chilli: 0.35, cumin: 0.2, blackpepper: 0.2, allspice: 0.15, cloves: 0.1 },
      story: 'Tacos al pastor are a party on a plate. Sweet pineapple, smoky spice and a squeeze of lime, best eaten standing up with friends.',
      art: { type: 'tacos' }
    },
    {
      id: 'mole', name: 'Mole poblano', origin: 'Mexico', flag: '🇲🇽',
      subtitle: 'Complex, mysterious and endlessly layered.',
      spices: { chilli: 0.35, cinnamon: 0.15, sesame: 0.15, cloves: 0.1, allspice: 0.1, blackpepper: 0.15 },
      story: 'Mole poblano combines chillies, chocolate, spices and seeds into one dark, glossy sauce. Every taste reveals something new.',
      art: { type: 'plate', style: 'mole' }
    },
    {
      id: 'churros', name: 'Churros & chocolate', origin: 'Spain & Mexico', flag: '🇪🇸🇲🇽',
      subtitle: 'Sweet, playful and best eaten hot.',
      spices: { cinnamon: 0.5, vanilla: 0.3, chilli: 0.2 },
      story: 'Churros are crispy outside, soft inside and rolled in cinnamon sugar. Dip them in thick chocolate with a hint of chilli and it’s a party.',
      art: { type: 'churros' }
    },
    {
      id: 'jerk', name: 'Jerk chicken', origin: 'Jamaica', flag: '🇯🇲',
      subtitle: 'Smoky, fiery and full of life.',
      spices: { allspice: 0.35, chilli: 0.3, cinnamon: 0.1, nutmeg: 0.1, ginger: 0.1, blackpepper: 0.05 },
      story: 'Jerk is all about big flavour: a marinade of allspice and scotch bonnet, slow smoke, and a char that keeps you coming back for one more piece.',
      art: { type: 'plate', style: 'jerk' }
    },
    {
      id: 'pumpkinpie', name: 'Pumpkin pie', origin: 'USA', flag: '🇺🇸',
      subtitle: 'Warm, nostalgic and a little bit festive.',
      spices: { cinnamon: 0.4, nutmeg: 0.2, ginger: 0.2, cloves: 0.1, allspice: 0.1 },
      story: 'Pumpkin pie is a dish for gatherings. It smells like autumn, tastes like home and always disappears faster than expected.',
      art: { type: 'pie' }
    }
  ];
})(globalThis.SI = globalThis.SI || {});
