'use strict';

const Strategy = require('./Strategy.js');
const config = require('./config.js');

function generate() {
    const numberOfPlayers = config.playerCount;
    let players = [];

    for (var i = 0; i <= numberOfPlayers; i++) {
        let isDealer = i === numberOfPlayers;

        let player = {
            cards: [],
            name: isDealer ? 'dealer' : `player ${i+1}`,
            strategy: isDealer ? Strategy.dealer : Strategy.basic
        }

        players.push(player);
    }

    return players;
}

module.exports = {
    generate
}
