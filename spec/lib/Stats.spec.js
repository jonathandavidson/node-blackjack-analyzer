import * as Stats from '../../src/Stats';
import * as Game from '../../src/Game';

describe('Stats', () => {
  describe('netGainOrLoss()', () => {
    it('returns bankroll value for the first player', () => {
      const game = Game.create({
        playerCount: 2,
        deckCount: 6,
        deckPenetration: 0.75
      });
      game.players[0].bankroll = 10;

      expect(Stats.netGainOrLoss(game)).toBe(10);
    });
  });

  describe('returnOnInvestment()', () => {
    it('returns the netGainOrLoss divided by the sum of bets placed', () => {
      const game = Game.create({
        playerCount: 2,
        deckCount: 6,
        deckPenetration: 0.75
      });
      game.players[0].bankroll = -1;
      game.players[0].totalBets = 12;

      const roi = Stats.returnOnInvestment(game);

      expect(typeof roi).toBe('number');
      expect(roi.toFixed(5)).toBe((-0.08333).toFixed(5));
    });
  })
});
