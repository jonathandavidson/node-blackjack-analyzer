'use strict';

const Deck = require('./lib/Deck.js');
const Hand = require('./lib/Hand.js');
const Players = require('./lib/Players.js');
const config = require('./lib/config.js');

const players = Players.generate(config.playerCount);
const dealer = Players.generateDealer();
let shoe = Deck.generateShoe(config.deckCount, config.deckPenetration);

for (var i = 0; i < config.handCount; i++) {
  players.forEach(player => {
    player.hand.bet = 1;
    player.bankroll--;
  });

  if (shoe.shouldShuffle === true) {
    shoe = Deck.generateShoe(config.deckCount, config.deckPenetration);
  }

  Hand.deal(players, dealer, shoe);

  if (Hand.isBlackjack(dealer.hand)) {
    players.forEach(player => {
      dealer.bankroll += player.hand.bet;
      player.hand.bet = 0;
    });
  } else {
    players.forEach((player) => Hand.play(player, shoe));
    Hand.play(dealer, shoe);
  }
};
