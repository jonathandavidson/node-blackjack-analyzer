export function netGainOrLoss (game) {
  return game.players[0].bankroll;
}

export function returnOnInvestment (game) {
  return netGainOrLoss(game) / game.players[0].totalBets;
}

export function generate (game) {
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
