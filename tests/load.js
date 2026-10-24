// Loads the browser scripts into Node (they attach to globalThis.SI).
require('../js/data/questions.js');
require('../js/data/spices.js');
require('../js/data/dishes.js');
try { require('../js/data/calibration.js'); } catch (e) { /* not generated yet */ }
require('../js/engine/narrative.js');
require('../js/engine/scoring.js');
module.exports = globalThis.SI;
