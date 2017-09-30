const Card = require('./Card');
const Hand = require('./Hand');

const actions = {
  doubleDown: 'double down',
  hit: 'hit',
  stand: 'stand',
  surrender: 'surrender'
}

function basic (hand, dealerCard) {
  const value = Hand.getValue(hand);
  const dealerValue = Card.lowValue(dealerCard);
  let action = actions.hit;

  if (value === 9 && dealerValue >= 3 && dealerValue <= 6) {
    action = actions.doubleDown;
  } else if (value === 10 && dealerValue > 1 && dealerValue <= 9) {
    action = actions.doubleDown;
  } else if (value === 11) {
    action = actions.doubleDown;
  } else if (value === 12 && dealerValue >=4 && dealerValue <= 6) {
    action = actions.stand;
  } else if (value === 13) {
    if (!Hand.isSoft(hand) && dealerValue >= 2 && dealerValue <= 6) {
      action = actions.stand;
    } else if (Hand.isSoft(hand) && [5, 6].find(value => value === dealerValue)) {
      action = actions.doubleDown;
    }
  }

  return action;
}

function dealer (hand) {
  let action = actions.hit;

  if (Hand.getValue(hand) > 17) {
    action = actions.stand;
  } else if (Hand.getValue(hand) === 17) {
    if (!(Hand.containsAce(hand) && Hand.isSoft(hand))) {
      action = actions.stand;
    }
  }

  return action;
}

module.exports = {
  actions,
  basic,
  dealer
}
