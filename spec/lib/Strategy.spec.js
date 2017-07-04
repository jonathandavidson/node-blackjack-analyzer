const Strategy = require('../../lib/Strategy');
const Card = require('../../lib/Card');
const Hand = require('../../lib/Hand');

const ace = Card.values[0];
const three = Card.values[2];
const five = Card.values[4];
const six = Card.values[5];
const seven = Card.values[6];
const ten = Card.values[9];

const hand = Hand.create();

describe('lib/Strategy', () => {
  describe('dealer()', () => {
    describe('when hand value is less than 17', () => {
      hand.cards = [ten, three, three];
      const result = Strategy.dealer(hand);

      it('returns hit', () => {
        expect(result).toEqual(Strategy.actions.hit);
      });
    });

    describe('when hand value is 17', () => {
      describe('and the hand contains a soft ace', () => {
        hand.cards = [ace, three, three];
        const result = Strategy.dealer(hand);

        it('returns hit', () => {
          expect(result).toEqual(Strategy.actions.hit);
        });
      });

      describe('and the hand contains no soft ace', () => {
        hand.cards = [ten, ace, six];
        const result = Strategy.dealer(hand);

        it('returns stand', () => {
          expect(result).toEqual(Strategy.actions.stand);
        });
      });

      describe('and the hand contains no aces', () => {
        hand.cards = [ten, seven];
        const result = Strategy.dealer(hand);

        it('returns stand', () => {
          expect(result).toEqual(Strategy.actions.stand);
        });
      });
    });

    describe('when hand value is greater than 17', () => {
      hand.cards = [ten, five, three];
      const result = Strategy.dealer(hand);

      it('returns stand', () => {
        expect(result).toEqual(Strategy.actions.stand);
      });
    });
  });
});
