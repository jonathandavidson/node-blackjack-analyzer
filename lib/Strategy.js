const Hand = require('./Hand');

const actions = {
  doubleDown: 'double down',
  hit: 'hit',
  stand: 'stand'
}

function basic (player, players) {
  return actions.hit;
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
