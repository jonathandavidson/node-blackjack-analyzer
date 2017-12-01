const Hand = require('../../lib/Hand');
const Card = require('../../lib/Card');

const [
  ace, two, three, four, five, six, seven, eight, nine, ten
] = Object.keys(Card.cards).map(
  card => Card.create(Card.cards[card], 'spades')
);

function createHandWithCards(...cards) {
  const hand = Hand.create();
  cards.forEach(card => hand.receiveCard(card));
  return hand;
}

describe('lib/Hand', () => {
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

  describe('isSoft()', () => {
    const hand = Hand.create();

    it('returns false when there are no aces', () => {
      hand.cards = [five, six];
      expect(Hand.isSoft(hand)).toBe(false);
    });

    it('returns false when all aces are hard', () => {
      hand.cards = [ten, two, ace];
      expect(Hand.isSoft(hand)).toBe(false);
    });

    it('returns true when there is a soft ace', () => {
      hand.cards = [two, ace];
      expect(Hand.isSoft(hand)).toBe(true);
    });
  });
});
