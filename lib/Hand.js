function containsAce (hand) {
  return Boolean(hand.cards.find(card => card.isAce()));
}

function create () {
  return new Hand();
}

function getLowValue (hand) {
  const sum = hand.cards.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.getLowValue();
  }, 0);

  return sum;
}

function getValue (hand) {
  let sum = getLowValue(hand);

  if (containsAce(hand) && (sum + 10 <= 21)) {
    sum += 10;
  }

  return sum;
}

function isBlackjack ({ cards }) {
  if (
    (cards[0].isAce() && cards[1].isTen()) ||
    (cards[0].isTen() && cards[1].isAce())
  ) {
    return true;
  } else {
    return false;
  }
}

function isBusted (hand) {
  return getLowValue(hand) >= 21;
}

function isSoft (hand) {
  let isSoft = false;

  if (containsAce(hand)) {
    isSoft = (getLowValue(hand) + 10) <= 21;
  }

  return isSoft;
}

class Hand {
  constructor() {
    this.bet = 0;
    this.cards = [];
  }

  placeBet(bet) {
    this.bet += bet;
  }

  receiveCard(card) {
    this.cards.push(card);
  }
}

module.exports = {
  containsAce,
  create,
  getValue,
  isBlackjack,
  isBusted,
  isSoft
};
