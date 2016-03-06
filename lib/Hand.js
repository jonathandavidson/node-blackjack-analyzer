'use strict';

const Deck = require('./Deck.js');

function deal(players, shoe, count) {
    players.forEach(player => {
        player.cards = [];
        player.cards.push(dealCard(shoe));
        player.cards.push(dealCard(shoe));
    });
}

function dealCard(shoe) {
    let card = shoe.cards.pop();

    if (card === 'shuffle marker') {
        shoe.cards = Deck.generateCards();
        card = shoe.cards.pop();
    }

    return card;
}

function play(player, players) {
}

module.exports = {
    deal,
    play
};
