import { actions } from '../strategy';
import * as Card from '../card';
import * as Shoe from '../shoe';
import * as Hand from '../hand';
import * as Player from '../player';
import * as Stats from '../stats';

export function create (config) {
  return {
    handStarted: false,
    config: config,
    players: Player.createList(config.playerCount),
    shoe: Shoe.create(config.deckCount, config.deckPenetration),
    handCount: 0
  };
}

function dealCard (hand, shoe) {
  let card = shoe.cards.shift();

  if (!(card instanceof Card.Card)) {
    shoe.shouldShuffle = true;
    card = shoe.cards.shift();
  }

  hand.receiveCard(card);

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
    if (Player.isDealer(player)) return player;

    player.hands.forEach(hand => {
      hand.placeBet(1);
    });
    player.bankroll--;

    return player;
  });

  return game;
}

export function start (state) {
  let game = Object.assign({}, state);

  for (let i = 0; i < game.config.handCount; i++) {
    game = prepareHand(game);
    game = this.playHand(game);
    game.stats = Stats.generate(game);
    game.handCount++;
  }

  return game;
}

function prepareHand (state) {
  let game = Object.assign({}, state);

  if (game.shoe.shouldShuffle === true) {
    game.shoe.shuffle(
      game.config.deckCount,
      game.config.deckPenetration
    );
  }

  game = placeBets(game);
  game = dealCards(game);

  return game;
}

export function playHand (state) {
  let game = Object.assign({}, state);

  game.players = game.players.map(currentPlayer => {
    if (currentPlayer.hands[0].isBlackjack()) {
      return currentPlayer;
    }

    let { player, shoe } = playHands(currentPlayer, game.players, game.shoe);
    game.shoe = shoe;

    return player;
  });

  game.players = game.players.map(currentPlayer => {
    if (!Player.isDealer(currentPlayer)) {
      const dealer = game.players.find(player => Player.isDealer(player));
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

    if (currentHand.isSplit && currentHand.cards[0].isAce()) {
      handCompleted = true;
    } else if (dealerHand.isBlackjack()) {
      handCompleted = true;
    } else if (action === actions.hit) {
      ({ hand, shoe } = dealCard(currentHand, shoeInstance));
      shoeInstance = shoe;
      currentHand = hand;
      handCompleted = currentHand.isBusted();
    } else if (action === actions.stand) {
      handCompleted = true;
    } else if (action === actions.doubleDown) {
      if (currentHand.cards.length > 2) {
        throw new Error('Double Down is not allowed after hit.')
      }

      ({ hand, shoe } = dealCard(currentHand, shoeInstance));
      shoeInstance = shoe;
      currentHand = hand;
      currentHand.placeBet(1);
      player.bankroll--;
      handCompleted = true;
    } else if (action === actions.split) {
      if (currentHand.cards[0].getLowValue() !== currentHand.cards[1].getLowValue()) {
        throw new Error('Splitting of unequal cards is not allowed.');
      } else if (currentHand.cards.length > 2) {
        throw new Error('Splittinng is not allowed after hit.');
      }

      splitHand = Hand.create();
      splitHand.placeBet(1);
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
    player.totalBets += hand.bet;

    if (hand.isSurrendered === true) {
      player.bankroll += hand.bet / 2;
    } else if (hand.isBlackjack() && !dealer.hands[0].isBlackjack()) {
      player.bankroll += hand.bet + hand.bet * config.blackjackPayout;
    } else if (!hand.isBusted() && dealer.hands[0].isBusted()) {
      player.bankroll += hand.bet * 2;
    } else if (!hand.isBusted() && hand.getValue() > dealer.hands[0].getValue()) {
      player.bankroll += hand.bet * 2;
    } else if (!hand.isBusted() && hand.getValue() === dealer.hands[0].getValue()) {
      player.bankroll += hand.bet;
    }

    return hand;
  });

  return player;
}
