const Strategy = require('../../../lib/Strategy');
const basicStrategy = require('../../../lib/Strategy/Basic');
const dealerStrategy = require('../../../lib/Strategy/Dealer');
const Card = require('../../../lib/Card');
const Hand = require('../../../lib/Hand');

const [ace, two, three, four, five, six, seven, eight, nine, ten] = Card.values;

describe('Dealer', () => {
  const { hit, stand } = Strategy.actions;
  const hand = Hand.create();

  describe('when hand value is less than 17', () => {
    hand.cards = [ten, three, three];
    const result = dealerStrategy(hand);

    it('returns hit', () => {
      expect(result).toEqual(hit);
    });
  });

  describe('when hand value is 17', () => {
    describe('and the hand contains a soft ace', () => {
      hand.cards = [ace, three, three];
      const result = dealerStrategy(hand);

      it('returns hit', () => {
        expect(result).toEqual(hit);
      });
    });

    describe('and the hand contains no soft ace', () => {
      hand.cards = [ten, ace, six];
      const result = dealerStrategy(hand);

      it('returns stand', () => {
        expect(result).toEqual(stand);
      });
    });

    describe('and the hand contains no aces', () => {
      hand.cards = [ten, seven];
      const result = dealerStrategy(hand);

      it('returns stand', () => {
        expect(result).toEqual(stand);
      });
    });
  });

  describe('when hand value is greater than 17', () => {
    hand.cards = [ten, five, three];
    const result = dealerStrategy(hand);

    it('returns stand', () => {
      expect(result).toEqual(stand);
    });
  });
});
