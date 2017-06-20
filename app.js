const config = require('./lib/config');
const Game = require('./lib/Game');

const game = Game.create(config);
Game.play(game);
