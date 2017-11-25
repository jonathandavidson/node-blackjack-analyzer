const config = require('../config/settings');
const Game = require('../lib/Game');
const Deck = require('../lib/Deck');

describe('game stats are correct', () => {
  config.handCount = 10000;

  beforeEach(() => {
    spyOn(Deck, 'shuffle').and.callFake(array => array);
  });

  it('matches expected results', () => {
    const game = Game.create(config);
    const result = Game.start(game);
    expect(result.stats).toEqual({
      netGainOrLoss: { description: 'Net Gain (Loss)', value: 9230 },
      returnOnInvestment: { description: 'Return on Investment', value: 0.8570102135561746 }
    });
  });
});
