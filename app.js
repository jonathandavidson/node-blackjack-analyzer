const config = require('./config/settings');
const Game = require('./lib/Game');

const game = Game.create(config);
Game.start(game);
