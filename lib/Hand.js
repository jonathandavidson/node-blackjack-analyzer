'use strict';

const Deck = require('./Deck.js');
const Card = require('./Card.js');


function deal(players, dealer, shoe) {
    players.forEach(player => {
        player.hand.cards = [];
        player.hand.cards.push(dealCard(shoe));
    });

    dealer.hand.cards = [];
    dealer.hand.cards.push(dealCard(shoe));

    players.forEach(player => {
        player.hand.cards.push(dealCard(shoe));
    });

    dealer.hand.cards.push(dealCard(shoe));
}

function dealCard(shoe) {
    let card = shoe.cards.shift();

    if (Card.isShuffleMarker(card)) {
        shoe.shouldShuffle = true;
        card = shoe.cards.shift();
    }

    return card;
}

function isBlackjack(hand) {
    if (
        (Card.isAce(hand.cards[0]) && Card.isTen(hand.cards[1])) ||
        (Card.isTen(hand.cards[0]) && Card.isAce(hand.cards[1]))
    ) {
        return true;
    } else {
        return false;
    }
}

function isBusted(hand) {
    const sum = hand.cards.reduce((previousValue, currentValue) => {
        return previousValue + Card.lowValue(currentValue);
    }, 0);

    return sum > 21;
}

function play(player, shoe) {
    let action = player.strategy(player.hand.cards);

    if (action === 'stand') {
        return;
    } else if (action === 'hit') {
        player.hand.cards.push(dealCard(shoe));
    }

    if (!isBusted(player.hand)) {
        play(player, shoe);
    }
}

module.exports = {
    deal,
    isBlackjack,
    isBusted,
    play
};
