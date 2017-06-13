const Deck = require('./Deck.js');
const Players = require('./Players.js');

function create (config) {
  return {
    config: config,
    dealer: Players.generateDealer(),
    players: Players.generate(config.playerCount),
    shoe: Deck.generateShoe(config.deckCount, config.deckPenetration),
    handCount: 0
  }
}

function play (state) {
  const game = Object.assign({}, state);

  if (game.handCount < game.config.handCount) {
    game.handCount++;
    return this.play(game);
  }

  return game;
}

module.exports = {
  create,
  play
}
