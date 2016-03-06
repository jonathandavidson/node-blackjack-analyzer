'use strict';

const Deck = require('./lib/Deck.js');
const Hand = require('./lib/Hand.js');
const Players = require('./lib/Players.js');

const deckCount = 1;
const handCount = 1;
const playerCount = 3;

const players = Players.generate(playerCount);
const shoe = Deck.generateShoe(deckCount);

for (var i = 0; i < handCount; i++) {
    Hand.deal(players, shoe);
    players.forEach(player => {
        Hand.play(player, players, shoe);
    });
};
