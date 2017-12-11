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

class Hand {
  constructor() {
    this.bet = 0;
    this.cards = [];
  }

  containsAce () {
    return Boolean(this.cards.find(card => card.isAce()));
  }

  getLowValue () {
    const sum = this.cards.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.getLowValue();
    }, 0);

    return sum;
  }

  getValue () {
    let sum = this.getLowValue();

    if (this.containsAce() && (sum + 10 <= 21)) {
      sum += 10;
    }

    return sum;
  }

  isSoft () {
    let isSoft = false;

    if (this.containsAce()) {
      isSoft = (this.getLowValue() + 10) <= 21;
    }

    return isSoft;
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
  isBlackjack,
  isBusted
};
