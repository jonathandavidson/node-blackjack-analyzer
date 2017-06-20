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

function dealCard (hand, shoe) {
  let card = shoe.cards.shift();

  if (Card.isShuffleMarker(card)) {
    shoe.shouldShuffle = true;
    card = shoe.cards.shift();
  }

  hand = Hand.receiveCard(hand, card);

  return {
    hand,
    shoe
  }
}

function dealCards (game) {
  for (let i = 0; i < 2; i++) {
    game.players = game.players.map(player => {
      player.hands = player.hands.map(currentHand => {
        const { hand, shoe } = dealCard(currentHand, game.shoe);
        game.shoe = shoe;

        return hand;
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

function playHands (game) {
  game.players = game.players.map(player => {
    player.hands = player.hands.map(currentHand => {
      let handCompleted = false;
      let hand;
      let shoe;

      while (!handCompleted) {
        const action = player.strategy(player, game.players);

        if (action === actions.hit) {
          ({ hand, shoe } = dealCard(currentHand, game.shoe));
          game.shoe = shoe;
          currentHand = hand;
          handCompleted = Hand.isBusted(currentHand);
        } else if (action === actions.stand) {
          handCompleted = true;
        } else if (action === actions.doubleDown) {
          ({ hand, shoe } = dealCard(currentHand, game.shoe));
          game.shoe = shoe;
          currentHand = Hand.placeBet(hand, 1);
          player.bankroll--;
          handCompleted = true;
        }
      }

      return currentHand;
    });
    return player;
  });

  return game;
}

module.exports = {
  create,
  play
}
