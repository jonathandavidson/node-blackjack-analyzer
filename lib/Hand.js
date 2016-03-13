'use strict';

const Deck = require('./Deck.js');
const Card = require('./Card.js');

function deal(players, shoe, count) {
    players.forEach(player => {
        player.hand.cards = [];
        player.hand.cards.push(dealCard(shoe));
        player.hand.cards.push(dealCard(shoe));
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

function isBusted(hand) {
    const sum = hand.cards.reduce((previousValue, currentValue) => {
        return previousValue + Card.lowValue(currentValue);
    }, 0);

    return sum > 21;
}

function play(player, index, players, shoe) {
    let action = player.strategy(player.cards);

    if (action === 'stand') {
        return;
    } else if (action === 'hit') {
        player.hand.cards.push(dealCard(shoe));
    }

    if (!isBusted(player.hand)) {
        play(player, index, players, shoe);
    }
}

module.exports = {
    deal,
    isBusted,
    play
};
