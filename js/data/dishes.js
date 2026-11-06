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
    {
      id: 'larb', name: 'Larb', origin: 'Laos', flag: '🇱🇦',
      subtitle: 'Zesty, punchy and refreshingly direct.',
      spices: { chilli: 0.4, galangal: 0.35, blackpepper: 0.25 },
      story: 'Larb is all bright edges: minced meat tossed with lime, toasted rice, chilli and a fistful of mint, scooped up in crisp lettuce. No fuss, all flavour.',
      art: { type: 'larb' }
    },
    {
      id: 'massaman', name: 'Massaman curry', origin: 'Thailand', flag: '🇹🇭',
      subtitle: 'Mellow, worldly and generous with its warmth.',
      spices: { cardamom: 0.25, cinnamon: 0.2, tamarind: 0.2, cumin: 0.15, cloves: 0.1, nutmeg: 0.1 },
      story: 'Massaman is a well-travelled curry, borrowing warm spices from distant trade routes and settling them into coconut, potato and peanuts. Gentle, rich and easy to love.',
      art: { type: 'bowl', broth: '#C27A2C', noodles: false, toppings: ['potato', 'chicken', 'peanut', 'friedOnion', 'potato'] }
    },
    {
      id: 'bulgogi', name: 'Bulgogi', origin: 'Korea', flag: '🇰🇷',
      subtitle: 'Sweet-natured, sociable and quietly smouldering.',
      spices: { sesame: 0.45, ginger: 0.3, blackpepper: 0.25 },
      story: 'Bulgogi is marinated beef grilled at the table while everyone talks over it. Sweet, smoky and toasty with sesame, it’s as much about the gathering as the food.',
      art: { type: 'plate', style: 'bulgogi' }
    },
    {
      id: 'mapo', name: 'Mapo tofu', origin: 'Sichuan, China', flag: '🇨🇳',
      subtitle: 'Soft on the outside, electric underneath.',
      spices: { sichuan: 0.4, chilli: 0.35, ginger: 0.25 },
      story: 'Mapo tofu looks gentle, all silky tofu, until the numbing tingle of Sichuan pepper arrives. Comforting and thrilling in the same mouthful.',
      art: { type: 'mapo' }
    },
    {
      id: 'dandan', name: 'Dan dan noodles', origin: 'Sichuan, China', flag: '🇨🇳',
      subtitle: 'Quick, nutty and full of tingle.',
      spices: { sichuan: 0.35, sesame: 0.3, chilli: 0.25, cinnamon: 0.1 },
      story: 'Dan dan noodles started as street food carried on a shoulder pole. Small bowl, big personality: nutty sesame, chilli oil and a tingle that hangs around.',
      art: { type: 'dandan' }
    },
    {
      id: 'cuminlamb', name: 'Cumin lamb skewers', origin: 'Xinjiang, China', flag: '🇨🇳',
      subtitle: 'Smoky, bold and made for late nights out.',
      spices: { cumin: 0.5, chilli: 0.3, sichuan: 0.2 },
      story: 'Chuanr are grilled over coals at night markets and eaten standing up with friends. Smoky, cumin-crusted and impossible to stop at one.',
      art: { type: 'plate', style: 'skewers' }
    },
    {
      id: 'charsiu', name: 'Char siu', origin: 'Guangdong, China', flag: '🇨🇳',
      subtitle: 'Sweet, glossy and a reliable crowd-pleaser.',
      spices: { staranise: 0.2, fennel: 0.2, cinnamon: 0.15, cloves: 0.15, ginger: 0.15, sesame: 0.15 },
      story: 'Char siu hangs glistening in the shop window and everyone stops to look. Sticky, sweet and smoky at the edges, it makes a plain bowl of rice feel like a treat.',
      art: { type: 'charsiu' }
    },
    {
      id: 'hongshao', name: 'Red-braised pork belly', origin: 'China', flag: '🇨🇳',
      subtitle: 'Patient, generous and quietly indulgent.',
      spices: { staranise: 0.35, cinnamon: 0.25, ginger: 0.25, chilli: 0.15 },
      story: 'Hong shao rou simmers slowly in soy, sugar and star anise until it’s glossy and melting. It’s the dish families make when they want to spoil someone.',
      art: { type: 'hongshao' }
    },
    {
      id: 'teaeggs', name: 'Tea eggs', origin: 'China', flag: '🇨🇳',
      subtitle: 'Unassuming outside, beautifully patterned within.',
      spices: { staranise: 0.3, cinnamon: 0.25, sichuan: 0.15, fennel: 0.15, cloves: 0.15 },
      story: 'Tea eggs are cracked and left to soak in spiced tea, so the marbling only shows once you peel them. There’s always more to them than the plain shell suggests.',
      art: { type: 'teaeggs' }
    },
    {
      id: 'nasilemak', name: 'Nasi lemak', origin: 'Malaysia', flag: '🇲🇾',
      subtitle: 'Easygoing, satisfying and with a fiery streak.',
      spices: { chilli: 0.4, tamarind: 0.25, ginger: 0.2, galangal: 0.15 },
      story: 'Nasi lemak is coconut rice with all the trimmings: crispy anchovies, peanuts, egg, cucumber and a sambal that does the talking. Breakfast, lunch or midnight, it’s always welcome.',
      art: { type: 'nasilemak' }
    },
    {
      id: 'roticanai', name: 'Roti canai & dhal', origin: 'Malaysia', flag: '🇲🇾',
      subtitle: 'Flaky, friendly and fun to watch in action.',
      spices: { cumin: 0.2, coriander: 0.2, fennel: 0.2, turmeric: 0.15, cardamom: 0.1, cinnamon: 0.1, mustard: 0.05 },
      story: 'Roti canai is spun, flipped and slapped on the griddle with a bit of showmanship, then torn and dunked in dhal. Simple, sociable and best shared at a mamak stall.',
      art: { type: 'roticanai' }
    },
    {
      id: 'satay', name: 'Satay', origin: 'Malaysia & Indonesia', flag: '🇲🇾🇮🇩',
      subtitle: 'Golden, sociable and always the first plate empty.',
      spices: { turmeric: 0.3, coriander: 0.25, cumin: 0.2, fennel: 0.15, galangal: 0.1 },
      story: 'Satay is turmeric-gold, charred over coals and dragged through peanut sauce. Small skewers, big following: nobody ever orders just one.',
      art: { type: 'satay' }
    },
    {
      id: 'nasigoreng', name: 'Nasi goreng', origin: 'Indonesia', flag: '🇮🇩',
      subtitle: 'Resourceful, hearty and ready for anything.',
      spices: { chilli: 0.45, coriander: 0.2, blackpepper: 0.15, galangal: 0.1, turmeric: 0.1 },
      story: 'Nasi goreng turns yesterday’s rice into something everyone wants, crowned with a fried egg. No plan needed, just a hot wok and good instincts.',
      art: { type: 'nasigoreng' }
    },
    {
      id: 'sotoayam', name: 'Soto ayam', origin: 'Indonesia', flag: '🇮🇩',
      subtitle: 'Sunny, soothing and good for the soul.',
      spices: { turmeric: 0.3, galangal: 0.2, ginger: 0.2, coriander: 0.15, blackpepper: 0.15 },
      story: 'Soto ayam is a golden turmeric chicken soup that every Indonesian family makes their own way. Bright, restoring and the first thing you want when you’re run down.',
      art: { type: 'bowl', broth: '#F2B830', noodles: true, toppings: ['chicken', 'egg', 'friedOnion', 'lime', 'herbs'] }
    },
    {
      id: 'amok', name: 'Fish amok', origin: 'Cambodia', flag: '🇰🇭',
      subtitle: 'Gentle, fragrant and quietly refined.',
      spices: { galangal: 0.35, turmeric: 0.3, chilli: 0.2, ginger: 0.15 },
      story: 'Amok is fish steamed in coconut and kroeung paste inside a little banana-leaf cup until it sets like a soft custard. Delicate, fragrant and made with real care.',
      art: { type: 'amok' }
    },
    {
      id: 'loklak', name: 'Lok lak', origin: 'Cambodia', flag: '🇰🇭',
      subtitle: 'Straight-talking, zesty and peppery.',
      spices: { blackpepper: 0.6, chilli: 0.2, ginger: 0.2 },
      story: 'Lok lak is seared beef on crisp lettuce and tomato, with a fried egg and a dipping sauce of lime and Kampot pepper. Simple, sharp and exactly what it says.',
      art: { type: 'loklak' }
    },
    {
      id: 'samlormachu', name: 'Samlor machu', origin: 'Cambodia', flag: '🇰🇭',
      subtitle: 'Sour, bright and full of life.',
      spices: { tamarind: 0.4, galangal: 0.25, chilli: 0.2, turmeric: 0.15 },
      story: 'Samlor machu is a sweet-sour Khmer soup of tamarind, fish, pineapple and herbs. It wakes up every taste bud and makes a family meal feel lively.',
      art: { type: 'bowl', broth: '#E59A3C', noodles: false, toppings: ['fish', 'pineapple', 'tomato', 'herbs', 'chilli'] }
    },

    /* ---------- South Asia ---------- */
    {
      id: 'butterchicken', name: 'Butter chicken', origin: 'India', flag: '🇮🇳',
      subtitle: 'Warm, generous and confidently rich.',
      spices: { fenugreek: 0.2, chilli: 0.2, cardamom: 0.15, cumin: 0.15, coriander: 0.1, cinnamon: 0.1, cloves: 0.1 },
      story: 'Butter chicken is a warm hug of a dish. Everyone feels at home around it, and there’s more care in the sauce than first appears.',
      art: { type: 'handi' }
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
      art: { type: 'katori' }
    },
    {
      id: 'vindaloo', name: 'Vindaloo', origin: 'Goa, India', flag: '🇮🇳',
      subtitle: 'Fiery, fearless and sharper than it looks.',
      spices: { chilli: 0.3, cumin: 0.15, blackpepper: 0.15, mustard: 0.1, cloves: 0.1, cinnamon: 0.1, turmeric: 0.1 },
      story: 'Vindaloo has a reputation, but it’s more than heat. Vinegar, garlic and warm spices give it a tangy depth that rewards anyone brave enough to dig in.',
      art: { type: 'kadai' }
    },
    {
      id: 'roganjosh', name: 'Rogan josh', origin: 'Kashmir, India', flag: '🇮🇳',
      subtitle: 'Deep, warm and richer than it lets on.',
      spices: { fennel: 0.25, ginger: 0.2, chilli: 0.2, cardamom: 0.15, cloves: 0.1, cinnamon: 0.1 },
      story: 'Rogan josh gets its deep red from mild Kashmiri chilli, not fire. Slow-cooked lamb, fennel and ginger make it warming rather than wild.',
      art: { type: 'bowl', rim: '#E0A050', band: '#8A4A1E', broth: '#9A1E14', noodles: false, toppings: ['stewBeef', 'redOil', 'stewBeef', 'stewBeef', 'herbs'] }
    },
    {
      id: 'chole', name: 'Chole bhature', origin: 'Punjab, India', flag: '🇮🇳',
      subtitle: 'Big-hearted, hearty and fun to share.',
      spices: { coriander: 0.2, cumin: 0.2, chilli: 0.15, cardamom: 0.1, cinnamon: 0.1, cloves: 0.1, fenugreek: 0.1, turmeric: 0.05 },
      story: 'Chole bhature is spiced chickpeas with a puffed-up bread that arrives like a balloon. Loud, generous and best eaten with friends on a weekend.',
      art: { type: 'chole' }
    },
    {
      id: 'dosa', name: 'Masala dosa', origin: 'South India', flag: '🇮🇳',
      subtitle: 'Crisp, light and cleverly put together.',
      spices: { mustard: 0.3, turmeric: 0.25, chilli: 0.2, fenugreek: 0.15, cumin: 0.1 },
      story: 'Masala dosa is a huge, paper-thin crêpe wrapped around spiced potato, with chutneys and sambar alongside. Light, crisp and a lot more skill than it lets on.',
      art: { type: 'dosa' }
    },
    {
      id: 'nihari', name: 'Nihari', origin: 'Pakistan', flag: '🇵🇰',
      subtitle: 'Slow, steady and deeply satisfying.',
      spices: { ginger: 0.2, fennel: 0.15, cardamom: 0.15, cloves: 0.1, cinnamon: 0.1, blackpepper: 0.1, nutmeg: 0.1, chilli: 0.1 },
      story: 'Nihari cooks overnight so it’s ready at dawn, a rich, silky stew topped with ginger, chilli and lemon. Worth the wait, and the people who make it know it.',
      art: { type: 'bowl', band: '#2E8F6A', broth: '#7A3416', noodles: false, toppings: ['stewBeef', 'gingerShreds', 'redOil', 'stewBeef', 'greenChilli'] }
    },
    {
      id: 'karahi', name: 'Chicken karahi', origin: 'Pakistan', flag: '🇵🇰',
      subtitle: 'Fast, fiery and made to share.',
      spices: { chilli: 0.3, cumin: 0.2, coriander: 0.2, blackpepper: 0.15, ginger: 0.15 },
      story: 'Karahi is cooked fast over a roaring flame and served in the same wok it was made in. Tomato, ginger and green chilli, straight to the table while it’s still sizzling.',
      art: { type: 'kadai', sauce: '#C8401E', glaze: '#E8642E', meat: 'chicken', garnish: 'ginger' }
    },
    {
      id: 'chapli', name: 'Chapli kebab', origin: 'Peshawar, Pakistan', flag: '🇵🇰',
      subtitle: 'Bold, rustic and full of crunch.',
      spices: { coriander: 0.4, cumin: 0.2, chilli: 0.2, blackpepper: 0.1, ginger: 0.1 },
      story: 'Chapli kebabs are flat, crisp-edged patties packed with crushed coriander seed and pomegranate, fried in a huge pan in Peshawar’s bazaars. Rough round the edges, in a good way.',
      art: { type: 'chapli' }
    },
    {
      id: 'kottu', name: 'Kottu roti', origin: 'Sri Lanka', flag: '🇱🇰',
      subtitle: 'Noisy, energetic and endlessly fun.',
      spices: { coriander: 0.25, cumin: 0.2, chilli: 0.2, fennel: 0.15, cinnamon: 0.1, cardamom: 0.1 },
      story: 'You hear kottu before you see it: the clatter of metal blades chopping roti, egg and vegetables on a hot griddle. It’s street food with a soundtrack.',
      art: { type: 'kottu' }
    },
    {
      id: 'ambulthiyal', name: 'Fish ambul thiyal', origin: 'Sri Lanka', flag: '🇱🇰',
      subtitle: 'Sharp, peppery and built to last.',
      spices: { blackpepper: 0.45, chilli: 0.15, ginger: 0.15, turmeric: 0.15, cardamom: 0.1 },
      story: 'Ambul thiyal is tuna cooked dry and dark with black pepper and sour goraka in a clay pot, a recipe made to keep for days. Tangy, peppery and resourceful.',
      art: { type: 'ambulthiyal' }
    },
    {
      id: 'hoppers', name: 'Egg hoppers', origin: 'Sri Lanka', flag: '🇱🇰',
      subtitle: 'Light, crisp and sweet with a kick.',
      spices: { chilli: 0.35, cinnamon: 0.25, cardamom: 0.15, cloves: 0.15, blackpepper: 0.1 },
      story: 'A hopper is a bowl-shaped pancake, lacy and crisp at the edges, soft in the middle, with an egg cooked right in it. Add sweet-spicy seeni sambol and it’s a joy.',
      art: { type: 'hoppers' }
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
    {
      id: 'fattoush', name: 'Fattoush', origin: 'Lebanon', flag: '🇱🇧',
      subtitle: 'Fresh, zingy and full of crunch.',
      spices: { sumac: 0.55, blackpepper: 0.25, chilli: 0.2 },
      story: 'Fattoush is a salad that makes leftovers exciting: crisp vegetables, toasted pita and a lemony dressing, all dusted with tart, ruby-red sumac.',
      art: { type: 'fattoush' }
    },
    {
      id: 'lahmacun', name: 'Lahmacun', origin: 'Turkey', flag: '🇹🇷',
      subtitle: 'Quick-witted, crisp and always on the move.',
      spices: { chilli: 0.3, paprika: 0.2, cumin: 0.2, sumac: 0.2, allspice: 0.1 },
      story: 'Lahmacun is a paper-thin flatbread topped with spiced mince, baked fast and hot. Squeeze over lemon, pile on herbs, roll it up and keep walking.',
      art: { type: 'flatbread' }
    },
    {
      id: 'sholehzard', name: 'Sholeh zard', origin: 'Iran', flag: '🇮🇷',
      subtitle: 'Golden, graceful and quietly radiant.',
      spices: { saffron: 0.45, cardamom: 0.3, cinnamon: 0.25 },
      story: 'Sholeh zard is a saffron rice pudding scented with rosewater and cardamom, decorated with cinnamon patterns and nuts. It’s made to share at celebrations.',
      art: { type: 'sholehzard' }
    },
    {
      id: 'koshari', name: 'Koshari', origin: 'Egypt', flag: '🇪🇬',
      subtitle: 'Resourceful, hearty and a little chaotic.',
      spices: { cumin: 0.4, coriander: 0.25, chilli: 0.2, cinnamon: 0.15 },
      story: 'Koshari throws rice, lentils, pasta and chickpeas together, then crowns them with spiced tomato sauce and crispy onions. It shouldn’t work. It absolutely does.',
      art: { type: 'koshari' }
    },
    {
      id: 'merguez', name: 'Merguez & harissa', origin: 'Tunisia', flag: '🇹🇳',
      subtitle: 'Smoky, spirited and never boring.',
      spices: { chilli: 0.35, caraway: 0.25, coriander: 0.2, cumin: 0.2 },
      story: 'Merguez are slim, spicy sausages that hiss on the grill. Pair them with a spoonful of harissa, fiery with chilli and caraway, and the table wakes right up.',
      art: { type: 'plate', style: 'merguez' }
    },
    {
      id: 'suya', name: 'Suya', origin: 'Nigeria', flag: '🇳🇬',
      subtitle: 'Bold, nocturnal and the reason everyone stays out late.',
      spices: { chilli: 0.4, ginger: 0.3, paprika: 0.2, nutmeg: 0.1 },
      story: 'Suya is street food at its best: skewers of beef rolled in a fiery peanut spice and grilled over open flames, served late at night with raw onion and tomato.',
      art: { type: 'suya' }
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
      id: 'pizza', name: 'Pizza diavola', origin: 'Italy', flag: '🇮🇹',
      subtitle: 'Fun-loving, crowd-pleasing and a little devilish.',
      spices: { chilli: 0.4, fennel: 0.3, blackpepper: 0.15, paprika: 0.15 },
      story: 'Pizza diavola is the ‘devil’s pizza’: blistered crust, spicy salami and a shake of chilli flakes. Everyone grabs a slice, and nobody stops at one.',
      art: { type: 'pizza' }
    },
    {
      id: 'moussaka', name: 'Moussaka', origin: 'Greece', flag: '🇬🇷',
      subtitle: 'Comforting, layered and made with love.',
      spices: { cinnamon: 0.35, nutmeg: 0.25, allspice: 0.2, blackpepper: 0.2 },
      story: 'Moussaka layers silky aubergine and cinnamon-spiced meat under a thick blanket of golden béchamel. It takes an afternoon to make and seconds to disappear.',
      art: { type: 'lasagne', stripes: ['#6B3F7A', '#A8401E', '#F2C14E', '#6B3F7A', '#A8401E', '#FFF6E6'], top: '#F0C35A', spots: '#C07A2A', side: '#E8B85A', garnish: 'herbs' }
    },
    {
      id: 'rarebit', name: 'Welsh rarebit', origin: 'Wales, UK', flag: '🇬🇧',
      subtitle: 'Cheeky, cosy and sharper than you’d expect.',
      spices: { mustard: 0.45, blackpepper: 0.3, chilli: 0.25 },
      story: 'Welsh rarebit is cheese on toast that went to finishing school: a molten sauce sharpened with mustard and a pinch of cayenne, grilled until bubbling.',
      art: { type: 'plate', style: 'toast' }
    },
    {
      id: 'brulee', name: 'Lavender crème brûlée', origin: 'France', flag: '🇫🇷',
      subtitle: 'Elegant, playful and delightfully crackable.',
      spices: { vanilla: 0.6, lavender: 0.3, nutmeg: 0.1 },
      story: 'Crème brûlée hides a soft, vanilla-scented heart under a glassy sugar crust. The best part is the first tap of the spoon.',
      art: { type: 'ramekin' }
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
    },
    {
      id: 'jambalaya', name: 'Jambalaya', origin: 'Louisiana, USA', flag: '🇺🇸',
      subtitle: 'Loud, lively and always up for a party.',
      spices: { paprika: 0.4, chilli: 0.3, blackpepper: 0.3 },
      story: 'Jambalaya is a one-pot celebration of rice, sausage, prawns and peppers, cooked down with Cajun spice. It’s made in big batches because more people always turn up.',
      art: { type: 'plate', base: '#D2692E', style: 'rice', toppings: ['prawn', 'sausage', 'pepperStrip', 'sausage', 'chives'] }
    },
    {
      id: 'ceviche', name: 'Ceviche', origin: 'Peru', flag: '🇵🇪',
      subtitle: 'Bright, quick and impossible to ignore.',
      spices: { chilli: 0.5, ginger: 0.25, blackpepper: 0.25 },
      story: 'Ceviche is “cooked” in minutes by lime alone: raw fish, ají chilli, red onion and a zingy leche de tigre. Fresh, sharp and gone before you know it.',
      art: { type: 'ceviche' }
    },
    {
      id: 'empanadas', name: 'Empanadas', origin: 'Argentina', flag: '🇦🇷',
      subtitle: 'Warm, dependable and full of surprises.',
      spices: { cumin: 0.35, paprika: 0.35, chilli: 0.3 },
      story: 'Empanadas are little parcels of comfort: crimped pastry around spiced beef, egg and olives. Everyone has a family recipe, and they’re all the best one.',
      art: { type: 'empanadas' }
    }
  ];
})(globalThis.SI = globalThis.SI || {});
