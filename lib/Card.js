const suits = {
  Spades: 'spades',
  Hearts: 'hearts',
  Clubs: 'clubs',
  diamonds: 'diamonds'
};

const cards = {
  Ace: { name: 'Ace', values: [1, 11] },
  Two: { name: 'Two', values: [2] },
  Three: { name: 'Three', values: [3] },
  Four: { name: 'Four', values: [4] },
  Five: { name: 'Five', values: [5] },
  Six: { name: 'Six', values: [6] },
  Seven: { name: 'Seven', values: [7] },
  Eight: { name: 'Eight', values: [8] },
  Nine: { name: 'Nine', values: [9] },
  Ten: { name: 'Ten', values: [10] },
  Jack: { name: 'Jack', values: [10] },
  Queen: { name: 'Queen', values: [10] },
  King: { name: 'King', values: [10] },
  ShuffleMarker: { name: 'Shuffle Marker', values: null }
}

function create(card, suit) {
  return new Card(card.name, suit, card.values);
}

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

  Object.keys(suits).map(suit => {
    values.forEach(value => {
      cards.push(generateCard(value.name, value.values, suits[suit]));
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
  cards,
  create,
  getAll,
  generateCard,
  generateShuffleMarker,
  isShuffleMarker,
  suits,
  values
}
