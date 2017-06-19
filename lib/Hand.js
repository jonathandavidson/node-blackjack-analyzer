'use strict';

const Card = require('./Card');

function create () {
  return {
    bet: 0,
    cards: []
  };
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
  const sum = hand.cards.reduce((previousValue, currentValue) => {
    return previousValue + Card.lowValue(currentValue);
  }, 0);

  return sum >= 21;
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
  create,
  isBlackjack,
  isBusted,
  placeBet,
  receiveCard
};
