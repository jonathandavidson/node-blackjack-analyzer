import * as Card from '../../card';
import * as Hand from '../index';

const [
  ace, two, three, four, five, six, seven, eight, nine, ten
] = Object.keys(Card.cards).map(
  card => Card.create(Card.cards[card], 'spades')
);

function createHandWithCards (...cards) {
  const hand = Hand.create();
  cards.forEach(card => hand.receiveCard(card));
  return hand;
}

describe('src/Hand', () => {
  describe('containsAce()', () => {
    it('returns true when the hand contains an ace', () => {
      const hand = createHandWithCards(ace, two);
      expect(hand.containsAce()).toBe(true);
    });

    it('returns false when the hand contains no aces', () => {
      const hand = createHandWithCards(two, two);
      expect(hand.containsAce()).toBe(false);
    });
  });

  describe('create()', () => {
    const hand = Hand.create();

    it('returns an object', () => {
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

  describe('placeBet()', () => {
    it('add to the bet value when placeBet() is called', () => {
      const hand = Hand.create();

      hand.placeBet(1);
      expect(hand.bet).toEqual(1);

      hand.placeBet(2);
      expect(hand.bet).toEqual(3);
    });
  });

  describe('receiveCard()', () => {
    it('pushes the card to the card array', () => {
      const hand = createHandWithCards(ace);
      expect(hand.cards).toEqual([ace]);
    });
  });

  describe('getLowValue()', () => {
    it('returns the lowest possible value', () => {
      const hand = createHandWithCards(ace, two);
      expect(hand.getLowValue()).toEqual(3);
    });
  });

  describe('getValue()', () => {
    describe('when no aces are present', () => {
      it('sums the values of the cards', () => {
        const hand = createHandWithCards(ten, two);
        expect(hand.getValue()).toEqual(12);
      });
    });

    describe('when aces are present', () => {
      it('counts one ace as 11 if not busted', () => {
        const hand = createHandWithCards(ace, ace, two);
        expect(hand.getValue()).toEqual(14);
      });

      it('counts all aces as 1 if counting one as 11 busts', () => {
        const hand = createHandWithCards(ace, ace, ten);
        expect(hand.getValue()).toEqual(12);
      });
    });
  });

  describe('isBlackjack()', () => {
    it('identifies blackjack with ace and ten', () => {
      const hand = createHandWithCards(ace, ten);
      expect(hand.isBlackjack()).toBe(true);
    });

    it('identifies blackjack with ten and ace', () => {
      const hand = createHandWithCards(ten, ace);
      expect(hand.isBlackjack()).toBe(true);
    });

    it('identifies non-blackjack with ace and off-card', () => {
      const hand = createHandWithCards(ace, two);
      expect(hand.isBlackjack()).toBe(false);
    });

    it('identifies non-blackjack with off-card and ace', () => {
      const hand = createHandWithCards(two, ace);
      expect(hand.isBlackjack()).toBe(false);
    });

    it('identifies non-blackjack with ten and off-card', () => {
      const hand = createHandWithCards(ten, two);
      expect(hand.isBlackjack()).toBe(false);
    });

    it('identifies non-blackjack with off-card and ten', () => {
      const hand = createHandWithCards(two, ten);
      expect(hand.isBlackjack()).toBe(false);
    });

    it('identifies non-blackjack with two off-cards', () => {
      const hand = createHandWithCards(two, two);
      expect(hand.isBlackjack()).toBe(false);
    });
  });

  describe('isBusted()', () => {
    it('identifies bust with no ace', () => {
      const hand = createHandWithCards(ten, ten, two);
      expect(hand.isBusted()).toBe(true);
    });

    it('identifies non-bust without an ace', () => {
      const hand = createHandWithCards(ten, two);
      expect(hand.isBusted()).toBe(false);
    });

    it('identifies non-bust with an ace', () => {
      const hand = createHandWithCards(ace, ten, two);
      expect(hand.isBusted()).toBe(false);
    });
  });

  describe('isSoft()', () => {
    it('returns false when there are no aces', () => {
      const hand = createHandWithCards(five, six);
      expect(hand.isSoft()).toBe(false);
    });

    it('returns false when all aces are hard', () => {
      const hand = createHandWithCards(ten, two, ace);
      expect(hand.isSoft()).toBe(false);
    });

    it('returns true when there is a soft ace', () => {
      const hand = createHandWithCards(two, ace);
      expect(hand.isSoft()).toBe(true);
    });
  });
});
