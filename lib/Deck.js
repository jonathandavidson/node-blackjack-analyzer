'use strict';

const config = require('./config.js');
const Card = require('./Card.js');

function generateDeck() {
    var deck = [];

    Card.suits.forEach(suit => {
        deck = deck.concat(Card.values.map(value => {
            let card = Object.assign({}, value);
            
            card.suit = suit;
            card.displayName = `${value.name} of ${suit}`;

            return card;
        }));
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
