'use strict';

const Deck = require('./lib/Deck.js');
const Hand = require('./lib/Hand.js');
const Players = require('./lib/Players.js');
const config = require('./lib/config.js');

const players = Players.generate();
const dealer = Players.generateDealer();
const shoe = Deck.generateShoe();

for (var i = 0; i < config.handCount; i++) {
    players.forEach(player => {
        player.hand.bet = 1;
    });

    Hand.deal(players, dealer, shoe);

    // Check for dealer blackjack and end play of hand here if needed

    players.forEach((player) => Hand.play(player, shoe));
    Hand.play(dealer, shoe);
};
