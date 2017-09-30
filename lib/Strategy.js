const Card = require('./Card');
const Hand = require('./Hand');

const actions = {
  doubleDown: 'double down',
  hit: 'hit',
  stand: 'stand',
  surrender: 'surrender'
}

function basic (hand, dealerCard, doubleDownIsAllowed) {
  const value = Hand.getValue(hand);
  const dealerValue = Card.lowValue(dealerCard);
  const { doubleDown, hit, stand, surrender } = actions;

  let action = hit;

  if (value === 9 && dealerValue >= 3 && dealerValue <= 6) {
    action = doubleDownIsAllowed ? doubleDown : hit;
  } else if (value === 10 && dealerValue > 1 && dealerValue <= 9) {
    action = doubleDownIsAllowed ? doubleDown : hit;
  } else if (value === 11) {
    action = doubleDownIsAllowed ? doubleDown : hit;
  } else if (value === 12 && dealerValue >=4 && dealerValue <= 6) {
    action = stand;
  } else if (value === 13 || value === 14) {
    if (!Hand.isSoft(hand) && dealerValue >= 2 && dealerValue <= 6) {
      action = stand;
    } else if (Hand.isSoft(hand) && [5, 6].find(value => value === dealerValue)) {
      action = doubleDownIsAllowed ? doubleDown : hit;
    }
  } else if (value === 15) {
    if (!Hand.isSoft(hand)) {
      if (dealerValue >= 2 && dealerValue <= 6) {
        action = stand;
      } else if ([1, 10].find(value => value === dealerValue)) {
        action = surrender;
      }
    } else if ([4, 5, 6].find(value => value === dealerValue)) {
      action = doubleDownIsAllowed ? doubleDown : hit;
    }
  } else if (value === 16) {
    if (!Hand.isSoft(hand)) {
      if (dealerValue >= 2 && dealerValue <= 6) {
        action = stand;
      } else if ([1, 9, 10].find(value => value === dealerValue)) {
        action = surrender;
      }
    } else if ([4, 5, 6].find(value => value === dealerValue)) {
      action = doubleDownIsAllowed ? doubleDown : hit;
    }
  } else if (value === 17) {
    if (!Hand.isSoft(hand)) {
      if (dealerValue >= 2 && dealerValue <= 10) {
        action = stand;
      } else {
        action = surrender;
      }
    } else if ([3, 4, 5, 6].find(value => value === dealerValue)) {
      action = doubleDownIsAllowed ? doubleDown : hit;
    }
  } else if (value === 18) {
    if (Hand.isSoft(hand)) {
      if ([7, 8].find(value => value === dealerValue)) {
        action = stand;
      } else if ([2, 3, 4, 5, 6].find(value => value === dealerValue)) {
        action = doubleDownIsAllowed ? doubleDown : stand;
      }
    } else {
      action = stand;
    }
  } else if (value === 19) {
    if (Hand.isSoft(hand) && dealerValue === 6) {
      action = doubleDownIsAllowed ? doubleDown : stand;
    } else {
      action = stand;
    }
  } else if (value === 20 || value === 21) {
    action = stand;
  }

  return action;
}

function dealer (hand) {
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

module.exports = {
  actions,
  basic,
  dealer
}
