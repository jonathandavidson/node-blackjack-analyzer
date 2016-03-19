'use strict';

const Strategy = require('./Strategy.js');
const Hand = require('./Hand.js');
const config = require('./config.js');

function generate() {
    const numberOfPlayers = config.playerCount;
    let players = [];

    for (var i = 0; i < numberOfPlayers; i++) {
        let player = Object.assign({}, generatePlayer());

        player.name = `player ${i+1}`
        players.push(player);
    }

    return players;
}

function generateDealer() {
    let dealer = Object.assign({}, generatePlayer());

    dealer.name = 'dealer';
    dealer.strategy = Strategy.dealer;

    return dealer;
}

function generatePlayer() {
    return {
        bankroll: 0,
        hand: {
            bet: 0,
            cards: []
        },
        name: '',
        strategy: Strategy.basic
    };
}

module.exports = {
    generate,
    generateDealer
}
