const actions = require('./Strategy').actions;
const Card = require('./Card');
const Deck = require('./Deck');
const Hand = require('./Hand')
const Players = require('./Players');

function create (config) {
  return {
    handStarted: false,
    config: config,
    players: Players.generate(config.playerCount),
    shoe: Deck.generateShoe(config.deckCount, config.deckPenetration),
    handCount: 0
  };
}

function dealCards (game) {
  for (let i = 0; i < 2; i++) {
    game.players = game.players.map(player => {
      player.hands = player.hands.map(hand => {
        let card = game.shoe.cards.shift();

        if (Card.isShuffleMarker(card)) {
          game.shoe.shouldShuffle = true;
          card = game.shoe.cards.shift();
        }

        return Hand.receiveCard(hand, card);
      });

      return player;
    });
  }

  return game;
}

function placeBets (game) {
  game.players = game.players.map(player => {
    if (Players.isDealer(player)) return player;

    player.hands = player.hands.map(hand => Hand.placeBet(hand, 1));
    player.bankroll--;

    return player;
  });

  return game;
}

function play (state) {
  let game = Object.assign({}, state);

  if (game.handCount < game.config.handCount) {
    if (!game.handStarted) {
      if (game.shoe.shouldShuffle === true) {
        game.shoe = Deck.generateShoe(
          game.config.deckCount,
          game.config.deckPenetration
        );
      }

      game = placeBets(game);
      game = dealCards(game);
      game.handStarted = true;
    } else {
      game = playHands(game);
      // Once everyone is finished the hands are evaluated and settled
      game.players = game.players.map(player => {
        return Object.assign({}, player, {
          hands: [ Hand.create() ]
        });
      });

      game.handStarted = false;
      game.handCount++;
    }

    return this.play(game);
  }

  return game;
}

function playHands(game) {
  game.players = game.players.map(player => {
    player.hands = player.hands.map(hand => {
      let handCompleted = false;

      while(!handCompleted) {
        const action = player.strategy(player, game.players);

        if (action === actions.hit) {
          handCompleted = true;
        }
        else if (action === actions.stand) {
          handCompleted = true;
        }
        else if (action === actions.doubleDown) {
          handCompleted = true;
        }
      }

      return hand;
    });
    return player;
  });

  return game;
}

module.exports = {
  create,
  play
}
