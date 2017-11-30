const Card = require('./Card.js');

function shuffle (array) {
  const newArray = array.slice(0);

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }

  return newArray;
}

function generateCards (deckCount) {
  let cards = [];

  for (var i = 0; i < deckCount; i++) {
    cards = cards.concat(Card.getAll());
  };

  return cards;
}

function generateShoe (deckCount, deckPenetration) {
  let shoe = {
    cards: [],
    shouldShuffle: false
  };

  shoe.cards = this.shuffle(this.generateCards(deckCount));

  const shuffleIndex = Math.round(shoe.cards.length * deckPenetration);
  const shuffleMarker = null;
  shoe.cards.splice(shuffleIndex, 0, shuffleMarker);

  return shoe;
}

function create(deckCount, shufflePenetration) {
  return new Shoe(deckCount, shufflePenetration);
}

class Shoe {
  constructor(deckCount, shufflePenetration) {
    this.cards = generateCards(deckCount, shufflePenetration);
    this.shufflePenetration = shufflePenetration;
    this.shuffle();
  }

  shuffle() {
    this.cards = module.exports.shuffle(this.cards);
    const shuffleIndex = Math.round(this.cards.length * this.shufflePenetration);
    this.cards.splice(shuffleIndex, 0, null);
    this.shouldShuffle = false;
  }
}

module.exports = {
  create,
  Shoe,
  generateCards,
  generateShoe,
  shuffle
}
