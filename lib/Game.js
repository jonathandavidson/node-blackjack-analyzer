const Deck = require('./Deck');
const Hand = require('./Hand')
const Players = require('./Players');

function create (config) {
  return {
    betsPlaced: false,
    config: config,
    dealer: Players.generateDealer(),
    players: Players.generate(config.playerCount),
    shoe: Deck.generateShoe(config.deckCount, config.deckPenetration),
    handCount: 0
  };
}

function play (state) {
  const game = Object.assign({}, state);

  if (game.handCount < game.config.handCount) {
    if (!game.betsPlaced) {
      game.players = game.players.map(player => {
        player.hands = player.hands.map(hand => {
          return Hand.placeBet(hand, 1);
        });
        return player;
      });

      game.betsPlaced = true;
    }

    game.handCount++;

    return this.play(game);
  }

  return game;
}

module.exports = {
  create,
  play
}
