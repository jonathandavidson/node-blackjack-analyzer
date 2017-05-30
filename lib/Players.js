'use strict';

const Strategy = require('./Strategy.js');
const Hand = require('./Hand.js');
const config = require('./config.js');

function generate(numberOfPlayers) {
    console.log(generatePlayer);
    let players = [];

    for (var i = 0; i < numberOfPlayers; i++) {
        const player = Object.assign({}, this.generatePlayer(`player ${i+1}`, Strategy.basic));

        players.push(player);
    }

    return players;
}

function generateDealer() {
    return Object.assign({}, this.generatePlayer('dealer', Strategy.dealer));
}

function generatePlayer(name, strategy) {
    return {
        bankroll: 0,
        hand: {
            bet: 0,
            cards: []
        },
        name: name,
        strategy: strategy
    };
}

module.exports = {
    generate,
    generateDealer,
    generatePlayer
}
