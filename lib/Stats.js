function netGainOrLoss (game) {
  return game.players[0].bankroll;
}

function returnOnInvestment (game) {
  return netGainOrLoss(game) / game.players[0].totalBets;
}

function generate (game) {
  return {
    netGainOrLoss: {
      description: 'Net Gain (Loss)',
      value: netGainOrLoss(game)
    },
    returnOnInvestment: {
      description: 'Return on Investment',
      value: returnOnInvestment(game)
    }
  }
}

module.exports = {
  generate,
  netGainOrLoss,
  returnOnInvestment
}
