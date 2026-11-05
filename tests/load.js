// Loads the browser scripts into Node (they attach to globalThis.SI).
require('../js/data/questions.js');
require('../js/data/spices.js');
require('../js/data/dishes.js');
require('../js/data/compatibility.js');
try { require('../js/data/calibration.js'); } catch (e) { /* not generated yet */ }
require('../js/engine/narrative.js');
require('../js/engine/scoring.js');
require('../js/engine/compat.js');
module.exports = globalThis.SI;
