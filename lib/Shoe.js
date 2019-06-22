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

function create (deckCount, shufflePenetration) {
  return new Shoe(deckCount, shufflePenetration);
}

class Shoe {
  constructor (deckCount, shufflePenetration) {
    this.deckCount = deckCount;
    this.shufflePenetration = shufflePenetration;
    this.shuffle();
  }

  shuffle () {
    this.cards = module.exports.shuffle(
      generateCards(this.deckCount, this.shufflePenetration)
    );
    const shuffleIndex = Math.round(this.cards.length * this.shufflePenetration);
    this.cards.splice(shuffleIndex, 0, null);
    this.shouldShuffle = false;
  }
}

module.exports = {
  create,
  Shoe,
  generateCards,
  shuffle
}
