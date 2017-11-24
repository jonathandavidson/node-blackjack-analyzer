function netGainOrLoss(game) {
  return game.players[0].bankroll;
}

function generate(game) {
  return {
    netGainOrLoss: {
      description: 'Net gain (loss)',
      value: netGainOrLoss(game)
    }
  }
}

module.exports = {
  generate,
  netGainOrLoss
}
