const actions = require('./index').actions; 
const Card = require('../Card');
const Hand = require('../Hand');

function strategy (hand) {
  const { hit, stand } = actions;
  let action = hit;

  if (hand.getValue() > 17) {
    action = stand;
  } else if (hand.getValue() === 17) {
    if (!(Hand.containsAce(hand) && hand.isSoft())) {
      action = stand;
    }
  }

  return action;
}

module.exports = strategy;
