const Card = require('./Card');

function containsAce (hand) {
  return Boolean(hand.cards.find(card => Card.isAce(card)));
}

function create () {
  return {
    bet: 0,
    cards: []
  };
}

function getLowValue (hand) {
  const sum = hand.cards.reduce((previousValue, currentValue) => {
    return previousValue + Card.lowValue(currentValue);
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

function isBlackjack (hand) {
  if (
    (Card.isAce(hand.cards[0]) && Card.isTen(hand.cards[1])) ||
    (Card.isTen(hand.cards[0]) && Card.isAce(hand.cards[1]))
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

function placeBet (hand, bet) {
  hand.bet += bet;
  return hand;
}

function receiveCard (hand, card) {
  hand.cards.push(card);
  return hand;
}

module.exports = {
  containsAce,
  create,
  getValue,
  isBlackjack,
  isBusted,
  isSoft,
  placeBet,
  receiveCard
};
