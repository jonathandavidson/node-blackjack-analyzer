'use strict';

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

const cardSuits = [
    'spades',
    'hearts',
    'clubs',
    'diamonds'
];

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function generateShoe(deckQuantity) {
    let shoe = [];

    for (var i = 0; i < deckQuantity; i++) {
        shoe = shoe.concat(generateDeck());
    };

    return shuffle(shoe);
}

function generateDeck() {
    var deck = [];

    cardSuits.forEach(suit => {
        deck = deck.concat(cardValues.map(value => `${value} of ${suit}`));
    });

    return deck;
}

module.exports = {
    generateShoe,
    shuffle
}
