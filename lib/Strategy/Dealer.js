import { actions } from './index';

export default function dealerStrategy (hand) {
  const { hit, stand } = actions;
  let action = hit;

  if (hand.getValue() > 17) {
    action = stand;
  } else if (hand.getValue() === 17) {
    if (!(hand.containsAce() && hand.isSoft())) {
      action = stand;
    }
  }

  return action;
}
