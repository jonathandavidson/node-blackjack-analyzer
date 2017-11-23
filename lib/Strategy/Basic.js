const actions = require('./index').actions; 
const Card = require('../Card');
const Hand = require('../Hand');

const { doubleDown, hit, split, stand, surrender } = actions;

function getSplitStrategy(value, dealerValue) {
  let action = split;

  if ((value === 4 || value === 6) && [1, 8, 9, 10].find(card => card === dealerValue)) {
    action = hit;
  } else if (value === 8 && [1, 2, 3, 4, 7, 8, 9, 10].find(card => card === dealerValue)) {
    action = hit;
  }

  return action;
}

function isPair(hand) {
  const cards = hand.cards;

  return cards.length === 2 && (Card.lowValue(hand.cards[0]) === Card.lowValue(hand.cards[1]));
}

function strategy (hand, dealerCard, doubleDownIsAllowed, surrenderIsAllowed) {
  const value = Hand.getValue(hand);
  const dealerValue = Card.lowValue(dealerCard);

  let action = hit;

  if (isPair(hand) && value !== 20 && value != 10) {
    action = getSplitStrategy(value, dealerValue);
  } else if (value === 9 && dealerValue >= 3 && dealerValue <= 6) {
    action = doubleDownIsAllowed ? doubleDown : hit;
  } else if (value === 10 && dealerValue > 1 && dealerValue <= 9) {
    action = doubleDownIsAllowed ? doubleDown : hit;
  } else if (value === 11) {
    action = doubleDownIsAllowed ? doubleDown : hit;
  } else if (value === 12 && dealerValue >= 4 && dealerValue <= 6) {
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
        action = surrenderIsAllowed ? surrender : hit;
      }
    } else if ([4, 5, 6].find(value => value === dealerValue)) {
      action = doubleDownIsAllowed ? doubleDown : hit;
    }
  } else if (value === 16) {
    if (!Hand.isSoft(hand)) {
      if (dealerValue >= 2 && dealerValue <= 6) {
        action = stand;
      } else if ([1, 9, 10].find(value => value === dealerValue)) {
        action = surrenderIsAllowed ? surrender : hit;
      }
    } else if ([4, 5, 6].find(value => value === dealerValue)) {
      action = doubleDownIsAllowed ? doubleDown : hit;
    }
  } else if (value === 17) {
    if (!Hand.isSoft(hand)) {
      if (dealerValue >= 2 && dealerValue <= 10) {
        action = stand;
      } else {
        action = surrenderIsAllowed ? surrender : stand;
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

module.exports = strategy;
