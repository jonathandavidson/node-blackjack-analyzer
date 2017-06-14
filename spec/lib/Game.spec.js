const Deck = require('../../lib/Deck');
const Game = require('../../lib/Game');
const Players = require('../../lib/Players');

describe('Game', () => {
  describe('create()', () => {
    const dealerMock = {
      isDealer: true
    };

    const playersMock = [ 'player1', 'player2' ];

    const shoeMock = {
      isShoe: true
    };

    const config = {
      deckCount: 4,
      playerCount: 3,
      deckPenetration: 0.75
    };

    let game;

    beforeEach(() => {
      spyOn(Players, 'generateDealer').and.returnValue(dealerMock);
      spyOn(Players, 'generate').and.returnValue(playersMock);
      spyOn(Deck, 'generateShoe').and.returnValue(shoeMock);
      game = Game.create(config);
    });

    it('returns an object', () => {
      expect(typeof game).toBe('object');
    });

    it('has a config property with the correct value', () => {
      expect(game.hasOwnProperty('config')).toBe(true);
      expect(game.config).toEqual(config);
    });

    it('has a dealer property with the correct value', () => {
      expect(game.hasOwnProperty('dealer')).toBe(true);
      expect(game.dealer).toEqual(dealerMock);
    });

    it('has a players property with the correct value', () => {
      expect(game.hasOwnProperty('players')).toBe(true);
      expect(game.players).toEqual(playersMock);
    });

    it('has a shoe property with the correct value', () => {
      expect(game.hasOwnProperty('shoe')).toBe(true);
      expect(game.shoe).toEqual(shoeMock);
    });
  });

  describe('play()', () => {
    beforeEach(() => {
      spyOn(Game, 'play').and.callThrough();
    });

    it('plays the correct number of hands', () => {
      const config = {
        handCount: 2,
        playerCount: 2
      };

      const game = Game.create(config);
      Game.play(game);

      expect(Game.play).toHaveBeenCalledTimes(3);
      expect(Game.play.calls.argsFor(1)[0].handCount).toBe(1);
      expect(Game.play.calls.argsFor(2)[0].handCount).toBe(2);
    });

    describe('when bets have not been placed', () => {
      it('places a bet for each player', () => {
        const config = {
          handCount: 1,
          playerCount: 2
        };

        const game = Game.create(config);
        game.betsPlaced = false;
        Game.play(game);

        const result = Game.play.calls.argsFor(1)[0];
        const player1 = result.players[0];
        const player2 = result.players[1];

        expect(player1.hands[0].bet).toEqual(1);
        expect(player2.hands[0].bet).toEqual(1);
      });
    });
  });
});
