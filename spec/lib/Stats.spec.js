const Stats = require('../../lib/Stats.js');
const Game = require('../../lib/Game.js');

describe('Stats', () => {
  describe('netGainOrLoss()', () => {
    it('returns bankroll value for the first player', () => {
      const game = Game.create({
        playerCount: 2,
        deckCount: 6,
        deckPenetration: .75
      });
      game.players[0].bankroll = 10;

      expect(Stats.netGainOrLoss(game)).toBe(10);
    });
  });
});
