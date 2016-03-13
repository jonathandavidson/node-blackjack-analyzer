const suits = [
    'spades',
    'hearts',
    'clubs',
    'diamonds'
];

const values = [
    { name: 'ace', values: [1, 11]},
    { name: 'two', values: [1]},
    { name: 'three', values: [2]},
    { name: 'four', values: [3]},
    { name: 'five', values: [4]},
    { name: 'six', values: [5]},
    { name: 'seven', values: [6]},
    { name: 'eight', values: [7]},
    { name: 'nine', values: [8]},
    { name: 'ten', values: [9]},
    { name: 'jack', values: [10]},
    { name: 'queen', values: [10]},
    { name: 'king', values: [10]}
];

function lowValue(card) {
    return Math.min.apply(Math, card.values)
}

module.exports = {
    lowValue: lowValue,
    suits: suits,
    values: values
}
