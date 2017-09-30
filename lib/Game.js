const actions = require('./Strategy').actions;
const Card = require('./Card');
const Deck = require('./Deck');
const Hand = require('./Hand');
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

function start (state) {
  let game = Object.assign({}, state);

  for (let i = 0; i < game.config.handCount; i++) {
    game = prepareHand(game);
    game = this.playHand(game);
    game.handCount++;
  }

  return game;
}

function prepareHand (state) {
  let game = Object.assign({}, state);

  if (game.shoe.shouldShuffle === true) {
    game.shoe = Deck.generateShoe(
      game.config.deckCount,
      game.config.deckPenetration
    );
  }

  game = placeBets(game);
  game = dealCards(game);

  return game;
}

function playHand (state) {
  let game = Object.assign({}, state);

  game.players = game.players.map(currentPlayer => {
    if (Hand.isBlackjack(currentPlayer.hands[0])) {
      return currentPlayer;
    }

    let { player, shoe } = playHands(currentPlayer, game.players, game.shoe);
    game.shoe = shoe;

    return player;
  });

  game.players = game.players.map(currentPlayer => {
    if (!Players.isDealer(currentPlayer)) {
      const dealer = game.players.find(player => Players.isDealer(player));
      currentPlayer = settleBets(currentPlayer, dealer, game.config);
    }

    return Object.assign({}, currentPlayer, {
      hands: [ Hand.create() ]
    });
  });

  return game;
}

function playHands (player, players, shoeInstance, handIndex = 0) {
  let currentHand = player.hands[handIndex];
  let handCompleted = false;
  let hand;
  let shoe;
  let splitHand

  while (!handCompleted) {
    const dealerHand = players[players.length - 1].hands[0];
    const dealerCard = dealerHand.cards[0];
    const doubleDownIsAllowed = currentHand.cards.length < 3;
    const surrenderIsAllowed = currentHand.cards.length < 3 && currentHand.isSplit !== true;
    const action = player.strategy(currentHand, dealerCard, doubleDownIsAllowed, surrenderIsAllowed);

    if (Hand.isBlackjack(dealerHand)) {
      handCompleted = true;
    } else if (action === actions.hit) {
      ({ hand, shoe } = dealCard(currentHand, shoeInstance));
      shoeInstance = shoe;
      currentHand = hand;
      handCompleted = Hand.isBusted(currentHand);
    } else if (action === actions.stand) {
      handCompleted = true;
    } else if (action === actions.doubleDown) {
      if (currentHand.cards.length > 2) {
        throw new Error('Double Down is not allowed after hit.')
      }

      ({ hand, shoe } = dealCard(currentHand, shoeInstance));
      shoeInstance = shoe;
      currentHand = Hand.placeBet(hand, 1);
      player.bankroll--;
      handCompleted = true;
    } else if (action === actions.split) {
      if (Card.lowValue(currentHand.cards[0]) !== Card.lowValue(currentHand.cards[1])) {
        throw new Error('Splitting of unequal cards is not allowed.');
      }

      if (currentHand.isSplit === true &&
        Card.isAce(currentHand.cards[0]) &&
        Card.isAce(currentHand.cards[1])
      ) {
        throw new Error('Resplitting of aces is not allowed.');
      }

      splitHand = Hand.placeBet(Hand.create(), 1);
      player.bankroll--;

      splitHand.cards.push(currentHand.cards.pop());

      ({ hand, shoe } = dealCard(currentHand, shoeInstance));
      shoeInstance = shoe;
      currentHand = hand;
      currentHand.isSplit = true;

      ({ hand, shoe } = dealCard(splitHand, shoeInstance));
      shoeInstance = shoe;
      splitHand = hand;
      splitHand.isSplit = true;

      player.hands.splice(handIndex + 1, 0, splitHand);
    } else if (action === actions.surrender) {
      if (currentHand.isSplit) {
        throw new Error('Surrender is not allowed after splitting');
      }

      if (currentHand.cards.length > 2) {
        throw new Error('Surrender is not allowed after hitting');
      }

      currentHand.isSurrendered = true;
      handCompleted = true;
    }
  }

  player.hands[handIndex] = currentHand;

  if (player.hands.length > handIndex + 1) {
    return playHands(player, players, shoeInstance, handIndex + 1);
  }

  return { player, shoe: shoeInstance };
}

function settleBets (player, dealer, config) {
  player.hands = player.hands.map(hand => {
    if (hand.isSurrendered === true) {
      player.bankroll += hand.bet / 2;
    } else if (Hand.isBlackjack(hand) && !Hand.isBlackjack(dealer.hands[0])) {
      player.bankroll += hand.bet + hand.bet * config.blackjackPayout;
    } else if (!Hand.isBusted(hand) && Hand.isBusted(dealer.hands[0])) {
      player.bankroll += hand.bet * 2;
    } else if (!Hand.isBusted(hand) && Hand.getValue(hand) > Hand.getValue(dealer.hands[0])) {
      player.bankroll += hand.bet * 2;
    } else if (!Hand.isBusted(hand) && Hand.getValue(hand) === Hand.getValue(dealer.hands[0])) {
      player.bankroll += hand.bet;
    }

    return hand;
  });

  return player;
}

module.exports = {
  create,
  playHand,
  start
}
