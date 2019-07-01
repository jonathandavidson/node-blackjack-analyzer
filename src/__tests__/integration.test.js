import config from '../../config/settings';
import * as Game from '../game';
import * as Shoe from '../shoe';

describe('game stats are correct', () => {
  config.handCount = 10000;

  beforeEach(() => {
    spyOn(Shoe, 'shuffle').and.callFake(array => array);
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
