const actions = {
  doubleDown: 'double down',
  hit: 'hit',
  stand: 'stand'
}

function basic (player, players) {
  return actions.hit;
}

function dealer (player, players) {
  return actions.hit;
}

module.exports = {
  actions,
  basic,
  dealer
}
