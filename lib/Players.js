const Hand = require('./Hand');
const Strategy = require('./Strategy');
const basicStrategy = require('./Strategy/Basic');

function generate (numberOfPlayers) {
  let players = [];

  for (var i = 0; i < numberOfPlayers; i++) {
    const player = Object.assign({}, this.generatePlayer(`player ${i + 1}`, basicStrategy));

    players.push(player);
  }

  players.push(this.generateDealer());

  return players;
}

function generateDealer () {
  return Object.assign(
    { isDealer: true },
    this.generatePlayer('dealer', Strategy.dealer)
  );
}

function generatePlayer (name, strategy) {
  return {
    bankroll: 0,
    hands: [
      Hand.create()
    ],
    name: name,
    strategy: strategy
  };
}

function isDealer (player) {
  return player.isDealer === true;
}

module.exports = {
  generate,
  generateDealer,
  generatePlayer,
  isDealer
}
