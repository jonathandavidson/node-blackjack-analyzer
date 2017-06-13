const Deck = require('./Deck.js');
const Hand = require('./Hand.js');
const Players = require('./Players.js');

function create(config) {
  return {
    dealer: Players.generateDealer(),
    players: Players.generate(config.playerCount),
    shoe: Deck.generateShoe(config.deckCount, config.deckPenetration)
  }
}

function play(game) {

}

module.exports = {
  create,
  play
}
