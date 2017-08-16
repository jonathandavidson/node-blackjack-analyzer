const Hand = require('./Hand');

const actions = {
  doubleDown: 'double down',
  hit: 'hit',
  stand: 'stand',
  surrender: 'surrender'
}

function basic (hand, dealerHand) {
  const value = Hand.getValue(hand);
  const dealerValue = Hand.getValue(dealerHand);
  let action = actions.hit;

  if (value === 9 && dealerValue >= 3 && dealerValue <= 6) {
    action = actions.doubleDown;
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
