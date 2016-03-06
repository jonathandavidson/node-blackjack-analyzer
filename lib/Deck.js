'use strict';

const config = require('./config.js');

const cardSuits = [
    'spades',
    'hearts',
    'clubs',
    'diamonds'
];

const cardValues = [
    'ace',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'jack',
    'queen',
    'king'
];

function generateDeck() {
    var deck = [];

    cardSuits.forEach(suit => {
        deck = deck.concat(cardValues.map(value => `${value} of ${suit}`));
    });

    return deck;
}

function generateCards() {
    const deckQuantity = config.deckCount;
    const shufflePoint = config.shufflePoint;

    let cards = [];

    for (var i = 0; i < deckQuantity; i++) {
        cards = cards.concat(generateDeck());
    };

    cards = shuffle(cards);
    const shuffleIndex = Math.round(cards.length * shufflePoint);
    cards.splice(shuffleIndex, 0, 'shuffle marker');

    return cards;
}

function generateShoe() {
    let shoe = {
        cards: []
    };

    shoe.cards = generateCards();

    return shoe;
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = {
    generateShoe,
    generateCards,
    shuffle
}
