function create () {
  return new Hand();
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

  isBlackjack () {
    return Boolean(
      (this.cards[0].isAce() && this.cards[1].isTen()) ||
      (this.cards[0].isTen() && this.cards[1].isAce())
    );
  }

  isBusted () {
    return this.getLowValue() >= 21;
  }

  isSoft () {
    return Boolean(
      this.containsAce() && (this.getLowValue() + 10) <= 21
    );
  }

  placeBet(bet) {
    this.bet += bet;
  }

  receiveCard(card) {
    this.cards.push(card);
  }
}

module.exports = {
  create
};
