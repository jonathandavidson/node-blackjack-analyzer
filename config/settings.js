const config = {
  allowDoubleAfterSplit: true, // Always true. Not yet supported
  allowResplit: true, // Always true. Not yet supported
  allowResplitAces: false, // Always false. Not yet supported
  allowSplitAnyTens: true, // Always true. Not yet supported
  allowLateSurrender: true, // Surrender not yet supported
  blackjackPayout: 3 / 2,
  dealerHitsSoft17: true, // Always true. Not yet supported
  deckCount: 4,
  deckPenetration: 0.75,
  handCount: 100000,
  insurancePayout: 2, // Insurance not yet supported
  playerCount: 3
};

module.exports = config;
