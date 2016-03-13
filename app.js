'use strict';

const Deck = require('./lib/Deck.js');
const Hand = require('./lib/Hand.js');
const Players = require('./lib/Players.js');
const config = require('./lib/config.js');

const players = Players.generate();
const shoe = Deck.generateShoe();

for (var i = 0; i < config.handCount; i++) {
    Hand.deal(players, shoe);

    players.forEach((player, index, players) => Hand.play(player, index, players, shoe));
};
