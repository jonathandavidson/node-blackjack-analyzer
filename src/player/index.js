import * as Hand from '../hand';
import {
  basic as basicStrategy,
  dealer as dealerStrategy
} from '../strategy';

export function createList (numberOfPlayers) {
  let players = [];

  for (var i = 0; i < numberOfPlayers; i++) {
    const player = Object.assign({}, this.create(`player ${i + 1}`, basicStrategy));

    players.push(player);
  }

  players.push(this.generateDealer());

  return players;
}

export function generateDealer () {
  return this.create('dealer', dealerStrategy, true);
}

export function create (...props) {
  return new Player(...props);
}

export function isDealer (player) {
  return player.isDealer === true;
}

class Player {
  constructor (name, strategy, isDealer) {
    this.name = name;
    this.strategy = strategy;
    this.bankroll = 0;
    this.hands = [Hand.create()];
    this.totalBets = 0;
    this.isDealer = Boolean(isDealer);
  }
}
