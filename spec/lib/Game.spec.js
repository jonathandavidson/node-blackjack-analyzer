const Card = require('../../lib/Card');
const Shoe = require('../../lib/Shoe');
const Game = require('../../lib/Game');
const Players = require('../../lib/Players');
const actions = require('../../lib/Strategy').actions;
const Stats = require('../../lib/Stats');

const [
  ace, two, three, four, five, six, seven, eight, nine, ten
] = Object.keys(Card.cards).map(
  card => Card.create(Card.cards[card], 'spades')
);

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
      spyOn(Shoe, 'create').and.returnValue(shoeMock);
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

  describe('start()', () => {
    beforeEach(() => {
      spyOn(Game, 'playHand').and.callThrough();
    });

    it('plays the correct number of hands', () => {
      const config = {
        deckCount: 1,
        handCount: 2,
        playerCount: 2,
        deckPenetration: 0.75
      };

      const game = Game.create(config);
      game.players[2].strategy = () => actions.hit;
      const result = Game.start(game);

      expect(result.handCount).toEqual(2);
    });

    describe('when bets have not been placed', () => {
      describe('and the shoe needs shuffled', () => {
        beforeEach(() => {
          spyOn(Shoe, 'shuffle').and.callThrough();
        });

        const config = {
          deckCount: 1,
          handCount: 1,
          playerCount: 1,
          deckPenetration: 0.75
        };

        const game = Game.create(config);
        game.shoe.shouldShuffle = true;
        game.handStarted = false;
        game.players[0].strategy = () => actions.stand;
        game.players[1].strategy = () => actions.stand;

        it('shuffles the shoe', () => {
          const result = Game.start(game);
          expect(Shoe.shuffle.calls.count()).toEqual(1);
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
            two,
            null,
            three,
            ace,
            four,
            five,
            six,
            seven
          ];

          game.handStarted = false;
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.stand;
          game.players[2].strategy = () => actions.stand;

          Game.start(game);

          result = Game.playHand.calls.argsFor(0)[0];
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
          const dealer = result.players[2];

          expect(player1.hands[0].cards).toEqual([
            two, four
          ]);

          expect(player2.hands[0].cards).toEqual([
            three, five
          ]);

          expect(dealer.hands[0].cards).toEqual([
            ace, six
          ]);
        });
      });
    });

    describe('handles player actions properly', () => {
      let game;

      beforeEach(() => {
        const config = {
          deckCount: 1,
          handCount: 1,
          playerCount: 1,
          deckPenetration: 0.75
        };

        game = Game.create(config);
        game.shoe.cards = [two, two, two, two, two, ten, ten, ten];
        game.players[1].strategy = () => actions.stand;
      });

      describe('stategies receive the correct arguments', () => {
        it('dealer stategy receives correct arguments', () => {
          game.shoe.cards = [ace, two, three, four];

          game.players[1].strategy = jasmine.createSpy().and.returnValue(actions.stand);
          game.players[0].strategy = jasmine.createSpy().and.returnValue(actions.stand);

          Game.start(game);

          expect(game.players[1].strategy).toHaveBeenCalledTimes(1);
          expect(game.players[1].strategy)
            .toHaveBeenCalledWith(game.players[1].hands[0], game.players[1].hands[0].cards[0], true, true);
        });

        describe('when the hand has not been hit or split', () => {
          it('player strategy receives the correct arguments', () => {
            game.shoe.cards = [ace, two, three, four];

            game.players[1].strategy = jasmine.createSpy().and.returnValue(actions.stand);
            game.players[0].strategy = jasmine.createSpy().and.returnValue(actions.stand);

            Game.start(game);

            expect(game.players[0].strategy).toHaveBeenCalledTimes(1);
            expect(game.players[0].strategy)
              .toHaveBeenCalledWith(game.players[0].hands[0], game.players[1].hands[0].cards[0], true, true);
          });
        });

        describe('when the hand has been hit', () => {
          it('player strategy receives the correct arguments', () => {
            game.shoe.cards = [ace, two, three, four, five];

            game.players[1].strategy = jasmine.createSpy().and.returnValue(actions.stand);
            game.players[0].strategy = jasmine.createSpy().and.returnValues(actions.hit, actions.stand);

            Game.start(game);

            expect(game.players[0].strategy).toHaveBeenCalledTimes(2);
            expect(game.players[0].strategy.calls.argsFor(1))
              .toEqual([game.players[0].hands[0], game.players[1].hands[0].cards[0], false, false]);
          });
        });

        describe('when the hand has been split', () => {
          it('player strategy receives the correct arguments', () => {
            game.shoe.cards = [two, three, two, four, five, six];

            game.players[1].strategy = jasmine.createSpy().and.returnValue(actions.stand);
            game.players[0].strategy = jasmine.createSpy().and.returnValues(actions.split, actions.stand, actions.stand);

            Game.start(game);

            expect(game.players[0].strategy).toHaveBeenCalledTimes(3);
            expect(game.players[0].strategy.calls.argsFor(1))
              .toEqual([game.players[0].hands[0], game.players[1].hands[0].cards[0], true, false]);
          });
        });
      });

      describe('when the dealer has a blackjack', () => {
        it('ignores the player’s hit actions', () => {
          game.shoe.cards = [ten, ace, ten, ten, two];
          game.players[1].strategy = () => actions.hit;
          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[0].cards.length).toBe(2);
        });
      });

      describe('when the player has a blackjack', () => {
        it('deals no cards to the player', () => {
          game.shoe.cards = [ace, ten, ten, ten, ten];
          game.players[0].strategy = () => actions.hit;
          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[0].cards.length).toBe(2);
        });
      });

      describe('when the player’s strategy says to stand', () => {
        it('deals no cards to the player', () => {
          game.players[0].strategy = () => actions.stand;
          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[0].cards.length).toBe(2);
        });
      });

      describe('when the player’s strategy continues to say to hit', () => {
        it('deals until the player busts', () => {
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.hit, actions.hit, actions.hit, actions.hit);

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[0].cards.length).toBe(5);
          expect(game.players[0].strategy).toHaveBeenCalledTimes(3);
        });
      });

      describe('when the player’s strategy says to hit then stand', () => {
        it('deals until the player stands', () => {
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.hit, actions.hit, actions.stand);

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[0].cards.length).toBe(4);
          expect(game.players[0].strategy).toHaveBeenCalledTimes(3);
        });
      });

      describe('when the player’s strategy says to double down', () => {
        describe('and the hand has not been hit', () => {
          it('deals the player one card and doubles the bet', () => {
            game.players[0].strategy = () => actions.doubleDown;
            game.shoe.cards = [two, ten, two, ten, two];
            Game.start(game);
            const result = Game.playHand.calls.argsFor(0)[0];

            expect(result.players[0].hands[0].cards.length).toBe(3);
            expect(result.players[0].bankroll).toEqual(-2);
          });
        });

        describe('and the hand has been hit', () => {
          it('throws an error', () => {
            game.shoe.cards = [two, ten, two, ten, two];
            game.players[0].strategy = jasmine.createSpy().and.returnValues(
              actions.hit, actions.doubleDown);

            expect(() => Game.start(game)).toThrow(new Error('Double Down is not allowed after hit.'));
          });
        });
      });

      describe('when the player’s strategy says to split', () => {
        it('creates a second hand', () => {
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.split, actions.stand, actions.stand);

          game.shoe.cards = [two, two, two, two, three, three, ten];

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands.length).toBe(2);
          expect(result.players[0].hands[0].cards).toEqual([two, three]);
          expect(result.players[0].hands[1].cards).toEqual([two, three]);
        });

        it('places a bet for the second hand', () => {
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.split, actions.stand, actions.stand);

          game.shoe.cards = [two, two, two, two, three, three, ten];

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[1].bet).toEqual(1);
        });

        it('plays both hands', () => {
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.split, actions.hit, actions.stand, actions.hit, actions.stand);

          game.shoe.cards = [two, two, two, two, three, three, ten, ten];

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];
          expect(result.players[0].hands[0].cards).toEqual([two, three, ten]);
          expect(result.players[0].hands[1].cards).toEqual([two, three, ten]);
        });

        it('does not allow split of unequal value cards', () => {
          game.shoe.cards = [two, two, three, two, two, ten, ten, ten];
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.split, actions.hit, actions.stand, actions.hit, actions.stand);

          expect(() => Game.start(game)).toThrow(new Error('Splitting of unequal cards is not allowed.'));
        });

        it('allows resplits', () => {
          game.shoe.cards = [two, two, two, two, two, two, three, three, three, three];
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.split, actions.split, actions.stand, actions.stand, actions.split, actions.stand, actions.stand);

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands[0].cards).toEqual([two, three]);
          expect(result.players[0].hands[1].cards).toEqual([two, three]);
          expect(result.players[0].hands[2].cards).toEqual([two, three]);
          expect(result.players[0].hands[3].cards).toEqual([two, three]);
        });

        it('only deals a single card to split aces', () => {
          game.shoe.cards = [ace, ace, ace, ace, ace, ace, two, two, two, two];
          game.players[0].strategy = jasmine.createSpy().and.returnValues(
            actions.split, actions.split, actions.stand, actions.stand, actions.split, actions.stand, actions.stand);

          Game.start(game);
          const result = Game.playHand.calls.argsFor(0)[0];

          expect(result.players[0].hands.length).toEqual(2);
          expect(result.players[0].hands[0].cards.length).toEqual(2);
          expect(result.players[0].hands[1].cards.length).toEqual(2);
        });

        describe('and the hand has been hit', () => {
          it('throws an error', () => {
            game.shoe.cards = [two, ten, two, ten, two];
            game.players[0].strategy = jasmine.createSpy().and.returnValues(
              actions.hit, actions.split);

            expect(() => Game.start(game)).toThrow(new Error('Splittinng is not allowed after hit.'));
          });
        });
      });

      describe('when the player’s strategy says to surrender', () => {
        describe('and the hand has not been hit or split', () => {
          it('deals the player no more cards', () => {
            game.shoe.cards = [two, ten, two, ten];
            game.players[0].strategy = jasmine.createSpy().and.returnValues(actions.surrender, actions.hit);

            Game.start(game);
            const result = Game.playHand.calls.argsFor(0)[0];

            expect(result.players[0].hands[0].cards).toEqual([two, two]);
          });
        });

        describe('and the hand has been hit', () => {
          it('throws an error', () => {
            game.shoe.cards = [two, ten, two, ten, two];
            game.players[0].strategy = jasmine.createSpy().and.returnValues(
                actions.hit, actions.surrender);

            expect(() => Game.start(game)).toThrow(new Error('Surrender is not allowed after hitting'));
          });
        });

        describe('and the hand has been split', () => {
          it('throws an error', () => {
            game.shoe.cards = [two, ten, two, ten, two, two];
            game.players[0].strategy = jasmine.createSpy().and.returnValues(
                actions.split, actions.surrender);

            expect(() => Game.start(game)).toThrow(new Error('Surrender is not allowed after splitting'));
          });
        });
      });
    });

    describe('after everyone has played', () => {
      let game;

      beforeEach(() => {
        game = Game.create({
          deckCount: 4,
          handCount: 1,
          playerCount: 1,
          deckPenetration: 0.75,
          blackjackPayout: 3 / 2
        });
      });

      describe('and a player has blackjack', () => {
        it('increases the player’s bankroll by the blackjack payout', () => {
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [ace, ten, ten, ten];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(1.5);
        });
      });

      describe('and the player has surrendered', () => {
        it('decreases the player’s bankroll by half a bet', () => {
          game.players[0].strategy = () => actions.surrender;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [ten, ten, ten, nine];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(-0.5);
        });
      });

      describe('and a player is busted', () => {
        it('player’s bankroll is unchanged', () => {
          game.players[0].strategy = () => actions.hit;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [ten, two, ten, two, ten];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(-1);
        });
      });

      describe('and the dealer is busted', () => {
        it('increases the player’s bankroll by two bets', () => {
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.hit;
          game.shoe.cards = [two, ten, two, ten, ten];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(1);
        });
      });

      describe('and both the player and the dealer are busted', () => {
        it('player’s bankroll is unchanged', () => {
          game.players[0].strategy = () => actions.hit;
          game.players[1].strategy = () => actions.hit;
          game.shoe.cards = [ten, ten, ten, ten, ten, ten];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(-1);
        });
      });

      describe('and a player scores higher than the dealer', () => {
        it('increases the player’s bankroll by two bets', () => {
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [ten, two, ten, two];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(1);
        });
      });

      describe('dealer scores higher than the player', () => {
        it('decreases the player’s bankroll by two bets', () => {
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [two, ten, two, ten];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(-1);
        });
      });

      describe('the player ties the dealer', () => {
        it('increases the player’s bankroll by one bet', () => {
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [two, two, two, two];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(0);
        });
      });

      describe('the player ties the dealer with blackjack', () => {
        it('increases the player’s bankroll by one bet', () => {
          game.players[0].strategy = () => actions.stand;
          game.players[1].strategy = () => actions.stand;
          game.shoe.cards = [ace, ace, ten, ten];
          const result = Game.start(game);

          expect(result.players[0].bankroll).toEqual(0);
        });
      });
    });

    describe('after bets are settled', () => {
      const game = Game.create({
        deckCount: 4,
        handCount: 2,
        playerCount: 2,
        deckPenetration: 0.75
      });

      game.players[0].strategy = () => actions.stand;
      game.players[1].strategy = () => actions.stand;
      game.players[2].strategy = () => actions.stand;

      const result = Game.start(game);

      it('resets everyone’s hands/bets', () => {
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

      it('increments each players totalBets property by the amount risked', () => {
        expect(result.players[0].totalBets).toEqual(2);
        expect(result.players[1].totalBets).toEqual(2);
      });
    });

    describe('return value', () => {
      const stats = { testProperty: 'testValue' };

      const config = {
        deckCount: 4,
        handCount: 2,
        playerCount: 2,
        deckPenetration: 0.75
      };

      let game;

      beforeEach(() => {
        spyOn(Stats, 'generate').and.returnValue(stats);
        game = Game.create(config);
      });

      it('adds stats to return value', () => {
        const result = Game.start(game);
        expect(result.stats).toEqual(stats);
      });
    });
  });
});
