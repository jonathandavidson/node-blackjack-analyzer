'use strict';

const Strategy = require('./Strategy.js');

function generate(numberOfPlayers) {
    let players = [];

    for (var i = 0; i <= numberOfPlayers; i++) {
        let isDealer = i === numberOfPlayers;

        let player = {
            cards: [],
            name: isDealer ? 'dealer' : `player ${i+1}`,
            strategy: 'dealer' ? Strategy.dealer : Strategy.basic
        }

        players.push(player);
    }

    return players;
}

module.exports = {
    generate
}
