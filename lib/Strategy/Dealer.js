const actions = require('./index').actions; 
const Card = require('../Card');
const Hand = require('../Hand');

function strategy (hand) {
  const { hit, stand } = actions;
  let action = hit;

  if (Hand.getValue(hand) > 17) {
    action = stand;
  } else if (Hand.getValue(hand) === 17) {
    if (!(Hand.containsAce(hand) && Hand.isSoft(hand))) {
      action = stand;
    }
  }

  return action;
}

module.exports = strategy;
