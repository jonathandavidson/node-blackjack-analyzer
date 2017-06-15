const Card = require('../../lib/Card');
const Deck = require('../../lib/Deck');
const Game = require('../../lib/Game');
const Players = require('../../lib/Players');

describe('Game', () => {
  describe('create()', () => {
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
        deckCount: 1,
        handCount: 2,
        playerCount: 2,
        deckPenetration: 0.75
      };

      const game = Game.create(config);
      const result = Game.play(game);

      expect(result.handCount).toEqual(2);
    });

    describe('when bets have not been placed', () => {
      describe('and the shoe needs shuffled', () => {
        beforeEach(() => {
          spyOn(Deck, 'generateShoe').and.callThrough();
        });

        const config = {
          deckCount: 1,
          handCount: 1,
          playerCount: 1,
          deckPenetration: 0.75
        };

        const game = Game.create(config);
        game.shoe.shouldShuffle = true;

        it('shuffles the shoe', () => {
          const result = Game.play(game);
          expect(Deck.generateShoe.calls.count()).toEqual(1);
          expect(result.shoe.cards.length).toEqual(49);
        });
      });

      describe('and the shoe does not need shuffled', () => {
        let result;

        beforeEach(() => {
          const config = {
            deckCount: 1,
            handCount: 1,
            playerCount: 2,
            deckPenetration: 0.75
          };

          const game = Game.create(config);

          game.shoe.cards = [
            'foo',
            'bar',
            Card.generateShuffleMarker(),
            'baz',
            'qux',
            'quux',
            'corge',
            'uier'
          ];

          game.handStarted = false;
          Game.play(game);

          result = Game.play.calls.argsFor(1)[0];
        });

        it('places a bet for each player', () => {
          const player1 = result.players[0];
          const player2 = result.players[1];

          expect(player1.hands[0].bet).toEqual(1);
          expect(player1.bankroll).toEqual(-1);
          expect(player2.hands[0].bet).toEqual(1);
          expect(player1.bankroll).toEqual(-1);
        });

        it('does not place a bet for the dealer', () => {
          const dealer = result.players[2];
          expect(dealer.bankroll).toEqual(0);
        });

        it('deals each player the correct cards', () => {
          const player1 = result.players[0];
          const player2 = result.players[1];

          expect(player1.hands[0].cards).toEqual([
            'foo',
            'qux'
          ]);
          expect(player2.hands[0].cards).toEqual([
            'bar',
            'quux'
          ]);
        });
      });
    });

    describe('after everyone has played', () => {
      const game = Game.create({
        deckCount: 4,
        handCount: 2,
        playerCount: 2,
        deckPenetration: 0.75
      });

      const result = Game.play(game);

      it('resets everyone\'s hands/bets', () => {
        expect(result.players[0].hands.length).toEqual(1);
        expect(result.players[1].hands.length).toEqual(1);
        expect(result.players[2].hands.length).toEqual(1);

        expect(result.players[0].hands[0].cards.length).toEqual(0);
        expect(result.players[1].hands[0].cards.length).toEqual(0);
        expect(result.players[2].hands[0].cards.length).toEqual(0);

        expect(result.players[0].hands[0].bet).toEqual(0);
        expect(result.players[1].hands[0].bet).toEqual(0);
        expect(result.players[2].hands[0].bet).toEqual(0);
      });
    });
  });
});
