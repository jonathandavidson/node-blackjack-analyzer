const suits = [
  'spades',
  'hearts',
  'clubs',
  'diamonds'
];

const values = [
  { name: 'ace', values: [1, 11] },
  { name: 'two', values: [2] },
  { name: 'three', values: [3] },
  { name: 'four', values: [4] },
  { name: 'five', values: [5] },
  { name: 'six', values: [6] },
  { name: 'seven', values: [7] },
  { name: 'eight', values: [8] },
  { name: 'nine', values: [9] },
  { name: 'ten', values: [10] },
  { name: 'jack', values: [10] },
  { name: 'queen', values: [10] },
  { name: 'king', values: [10] }
];

function generateCard (name, values, suit) {
  return new Card(name, suit, values);
}

function generateShuffleMarker () {
  return {
    displayName: 'shuffle marker',
    isShuffleMarker: true
  };
}

function getAll () {
  const cards = [];

  suits.forEach(suit => {
    values.forEach(value => {
      cards.push(generateCard(value.name, value.values, suit));
    });
  });

  return cards;
}

function isShuffleMarker (card) {
  if (card instanceof Card) {
    return card.isShuffleMarker();
  } else {
    return card.isShuffleMarker === true;
  }
}

function isTen (card) {
  if (card instanceof Card) {
    return card.isTen();
  } else {
    return lowValue(card) === 10;
  }
}

function lowValue (card) {
  if (card instanceof Card) {
    return card.getLowValue();
  } else {
    return Math.min.apply(Math, card.values);
  }
}

class Card {
  constructor(name, suit, values, isShuffleMarker=false) {
    this.displayName = `${name} of ${suit}`;
    this.suit = suit;
    this.name = name;
    this.shuffleMarker = isShuffleMarker;
    this.values = values;
  }

  getDisplayName() {
    return this.displayName;
  }

  isAce() {
    return this.getLowValue() === 1;
  }

  isShuffleMarker() {
    return this.shuffleMarker;
  }

  isTen() {
    return this.getLowValue() === 10;
  }

  getLowValue() {
    return Math.min.apply(Math, this.values);
  }
};

module.exports = {
  Card,
  getAll,
  generateCard,
  generateShuffleMarker,
  isShuffleMarker,
  isTen,
  lowValue,
  suits,
  values
}
