import * as Card from '../card';

export function shuffle (array) {
  const newArray = array.slice(0);

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }

  return newArray;
}

export function generateCards (deckCount) {
  let cards = [];

  for (var i = 0; i < deckCount; i++) {
    cards = cards.concat(Card.getAll());
  };

  return cards;
}

export function create (deckCount, shufflePenetration) {
  return new Shoe(deckCount, shufflePenetration);
}

export class Shoe {
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
