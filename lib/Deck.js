'use strict';

const Card = require('./Card.js');

function generateCards(deckCount, deckPenetration) {
    let cards = [];

    for (var i = 0; i < deckCount; i++) {
        cards = cards.concat(Card.getAll());
    };

    cards = this.shuffle(cards);
    const shuffleIndex = Math.round(cards.length * deckPenetration);
    const shuffleMarker = Card.generateShuffleMarker();
    cards.splice(shuffleIndex, 0, shuffleMarker);

    return cards;
}

function generateShoe(deckCount, deckPenetration) {
    let shoe = {
        cards: [],
        shouldShuffle: false
    };

    shoe.cards = this.generateCards(deckCount, deckPenetration);

    return shoe;
}

function shuffle(array) {
    const newArray = array.slice(0);

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }

    return newArray;
}

module.exports = {
    generateCards,
    generateShoe,
    shuffle
}
