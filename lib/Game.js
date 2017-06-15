const Card = require('./Card');
const Deck = require('./Deck');
const Hand = require('./Hand')
const Players = require('./Players');

function create (config) {
  return {
    handStarted: false,
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
    if (!game.handStarted) {
      if (game.shoe.shouldShuffle === true) {
        game.shoe = Deck.generateShoe(game.config.deckCount, game.config.deckPenetration);
      }

      game.players = game.players.map(player => {
        player.hands = player.hands.map(hand => {
          let card = game.shoe.cards.shift();

          if (Card.isShuffleMarker(card)) {
            game.shoe.shouldShuffle = true;
            card = game.shoe.cards.shift();
          }

          return Hand.receiveCard(Hand.placeBet(hand, 1), card);
        });

        // this should be a method of Player - and could then be returned directly
        player.bankroll--;

        return player;
      });

      game.handStarted = true;
    }
    else {
      // Each player takes their turn until they are finished
      // Once everyone is finished the hands are evaluated and settled and reset
      game.handStarted = false;
      game.handCount++;
    }

    return this.play(game);
  }

  return game;
}

module.exports = {
  create,
  play
}
