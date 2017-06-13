'use strict';

const Hand = require('../../lib/Hand');
const Card = require('../../lib/Card');
const Players = require('../../lib/Players');
const actions = require('../../lib/Strategy').actions;

const ace = Card.values[0];
const two = Card.values[1];
const ten = Card.values[9];

describe('lib/Hand', () => {
  describe('deal()', () => {
    let players;
    let dealer;
    let shoe;
    let shouldShuffle = false;

    beforeEach(() => {
      players = [
        Players.generatePlayer(),
        Players.generatePlayer()
      ];

      dealer = Players.generateDealer();

      shoe = {
        cards: [
          'foo',
          'bar',
          Card.generateShuffleMarker(),
          'baz',
          'qux',
          'quux',
          'corge',
          'uier'
        ],
        shouldShuffle: false
      };

      Hand.deal(players, dealer, shoe, shouldShuffle);
    });

    describe('players get the correct cards', () => {
      it('player 1 gets first card', () => {
        expect(players[0].hand.cards[0]).toBe('foo');
      });

      it('player 2 gets second card', () => {
        expect(players[1].hand.cards[0]).toBe('bar');
      });

      it('dealer gets third card', () => {
        expect(dealer.hand.cards[0]).toBe('baz');
      });

      it('player 1 gets fourth card', () => {
        expect(players[0].hand.cards[1]).toBe('qux');
      });

      it('player 2 gets fifth card', () => {
        expect(players[1].hand.cards[1]).toBe('quux');
      });

      it('dealer gets sixth card', () => {
        expect(dealer.hand.cards[1]).toBe('corge');
      });

      it('shoe has remaining card(s)', () => {
        expect(shoe.cards).toEqual(['uier']);
      });

      it('shoe indicates a shuffle is necessary', () => {
        expect(shoe.shouldShuffle).toBe(true);
      });
    });
  });

  describe('isBlackjack()', () => {
    it('identifies blackjack with ace and ten', () => {
      const hand = {
        cards: [ace, ten]
      };

      expect(Hand.isBlackjack(hand)).toBe(true);
    });

    it('identifies blackjack with ten and ace', () => {
      const hand = {
        cards: [ten, ace]
      };

      expect(Hand.isBlackjack(hand)).toBe(true);
    });

    it('identifies non-blackjack with ace and off-card', () => {
      const hand = {
        cards: [ace, two]
      };

      expect(Hand.isBlackjack(hand)).toBe(false);
    });

    it('identifies non-blackjack with off-card and ace', () => {
      const hand = {
        cards: [two, ace]
      };

      expect(Hand.isBlackjack(hand)).toBe(false);
    });

    it('identifies non-blackjack with ten and off-card', () => {
      const hand = {
        cards: [ten, two]
      };

      expect(Hand.isBlackjack(hand)).toBe(false);
    });

    it('identifies non-blackjack with off-card and ten', () => {
      const hand = {
        cards: [two, ten]
      };

      expect(Hand.isBlackjack(hand)).toBe(false);
    });

    it('identifies non-blackjack with two off-cards', () => {
      const hand = {
        cards: [two, two]
      };

      expect(Hand.isBlackjack(hand)).toBe(false);
    });
  });

  describe('isBusted()', () => {
    it('identifies bust with no ace', () => {
      const hand = {
        cards: [ten, ten, two]
      };

      expect(Hand.isBusted(hand)).toBe(true);
    });

    it('identifies non-bust without an ace', () => {
      const hand = {
        cards: [ten, two]
      };

      expect(Hand.isBusted(hand)).toBe(false);
    });

    it('identifies non-bust with an ace', () => {
      const hand = {
        cards: [ace, ten, two]
      };

      expect(Hand.isBusted(hand)).toBe(false);
    });
  });

  describe('play()', () => {
    let shoe;
    let player;

    beforeEach(() => {
      shoe = {
        cards: [two, two, ten, ten]
      };

      player = Players.generatePlayer();
      player.hand.cards = [two, two];
      player.hand.bet = 1;
    });

    describe('when the player\'s strategy says to stand', () => {
      beforeEach(() => {
        player.strategy = () => actions.stand;
      });

      it('deals no cards to the player', () => {
        Hand.play(player, shoe);
        expect(player.hand.cards.length).toBe(2);
      });
    });

    describe('when the player\'s strategy continues to say to hit', () => {
      beforeEach(() => {
        player.strategy = jasmine.createSpy().and.returnValues(actions.hit, actions.hit, actions.hit, actions.hit, actions.stand);
      });

      it('deals until the player busts', () => {
        Hand.play(player, shoe);
        expect(player.hand.cards.length).toBe(6);
        expect(player.strategy).toHaveBeenCalledTimes(4);
      });
    });

    describe('when the player\'s strategy says to hit then stand', () => {
      beforeEach(() => {
        player.strategy = jasmine.createSpy().and.returnValues(actions.hit, actions.hit, actions.stand);
      });

      it('deals until the player stands', () => {
        Hand.play(player, shoe);
        expect(player.hand.cards.length).toBe(4);
        expect(player.strategy).toHaveBeenCalledTimes(3);
      });
    });

    describe('when the player\'s strategy says to double down', () => {
      beforeEach(() => {
        player.strategy = jasmine.createSpy().and.returnValues(actions.doubleDown);
      });

      it('deals the player one card and doubles the bet', () => {
        Hand.play(player, shoe);
        expect(player.hand.cards.length).toBe(3);
        expect(player.hand.bet).toEqual(2);
      });
    });
  });
});
