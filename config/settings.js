const config = {
  allowDoubleAfterSplit: true, // Always true. False is not yet supported
  allowResplit: true, // Always true. False is not yet supported
  allowResplitAces: false, // Always false. True is not yet supported
  allowSplitAnyTens: true, // Always true. False is not yet supported
  allowLateSurrender: true, // Always true. False is not yet supported
  blackjackPayout: 3 / 2,
  dealerHitsSoft17: true, // Always true. Not yet supported
  deckCount: 4,
  deckPenetration: 0.75,
  handCount: 1000000,
  insurancePayout: 2, // Insurance not yet supported
  playerCount: 3
};

export default config;
