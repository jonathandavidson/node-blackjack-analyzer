'use strict';

const Strategy = require('./Strategy.js');
const Hand = require('./Hand.js');
const config = require('./config.js');

const playerTemplate = {
    hand: {
        cards: []
    },
    name: '',
    strategy: Strategy.basic
}

function generateDealer() {
    let dealer = Object.assign({}, playerTemplate);

    dealer.name = 'dealer';
    dealer.strategy = Strategy.dealer;

    return dealer;
}

function generate() {
    const numberOfPlayers = config.playerCount;
    let players = [];

    for (var i = 0; i < numberOfPlayers; i++) {
        let player = Object.assign({}, playerTemplate);

        player.name = `player ${i+1}`
        players.push(player);
    }

    return players;
}

module.exports = {
    generate,
    generateDealer
}
