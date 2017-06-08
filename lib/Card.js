const suits = [
    'spades',
    'hearts',
    'clubs',
    'diamonds'
];

const values = [
    { name: 'ace', values: [1, 11]},
    { name: 'two', values: [2]},
    { name: 'three', values: [3]},
    { name: 'four', values: [4]},
    { name: 'five', values: [5]},
    { name: 'six', values: [6]},
    { name: 'seven', values: [7]},
    { name: 'eight', values: [8]},
    { name: 'nine', values: [9]},
    { name: 'ten', values: [10]},
    { name: 'jack', values: [10]},
    { name: 'queen', values: [10]},
    { name: 'king', values: [10]}
];

function generateCard(name, values, suit) {
    return {
        displayName: `${name} of ${suit}`,
        name: name,
        suit: suit,
        values: values
    };
}

function generateShuffleMarker() {
    return {
        displayName: 'shuffle marker',
        isShuffleMarker: true
    };
}

function getAll() {
    const cards = [];

    suits.forEach(suit => {
        values.forEach(value => {
            cards.push(generateCard(value.name, value.values, suit));
        });
    });

    return cards;
}

function isAce(card) {
    return lowValue(card) === 1;
}

function isShuffleMarker(card) {
    return true === card.isShuffleMarker;
}

function isTen(card) {
    return lowValue(card) === 10;
}

function lowValue(card) {
    return Math.min.apply(Math, card.values)
}

module.exports = {
    getAll,
    generateShuffleMarker,
    isAce,
    isShuffleMarker,
    isTen,
    lowValue,
    suits,
    values
}
