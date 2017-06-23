'use strict';

const Hand = require('../../lib/Hand');
const Card = require('../../lib/Card');

const ace = Card.values[0];
const two = Card.values[1];
const ten = Card.values[9];

describe('lib/Hand', () => {
  describe('create()', () => {
    const hand = Hand.create();

    it('returns and object', () => {
      expect(typeof hand).toBe('object');
    });

    it('has a bet property with a zero value', () => {
      expect(hand.hasOwnProperty('bet')).toBe(true);
      expect(hand.bet).toEqual(0);
    });

    it('has a cards property which is an empty array', () => {
      expect(hand.hasOwnProperty('cards')).toBe(true);
      expect(Array.isArray(hand.cards)).toBe(true);
      expect(hand.cards.length).toEqual(0);
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
});
