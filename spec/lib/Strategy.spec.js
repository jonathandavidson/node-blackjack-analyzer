const Strategy = require('../../lib/Strategy');
const Card = require('../../lib/Card');
const Hand = require('../../lib/Hand');

const ace = Card.values[0];
const two = Card.values[1]
const three = Card.values[2];
const four = Card.values[3]
const five = Card.values[4];
const six = Card.values[5];
const seven = Card.values[6];
const eight = Card.values[7];
const nine = Card.values[8];
const ten = Card.values[9];

describe('lib/Strategy', () => {
  describe('dealer()', () => {
    const hand = Hand.create();

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

  describe('basic()', () => {
    function getResponses (playerCards, dealerCards) {
      const hand = Hand.create();
      hand.cards = playerCards;
      const dealerHand = Hand.create();

      return dealerCards.map(dealerCard => {
        dealerHand.cards = [dealerCard];
        return Strategy.basic(hand, dealerHand);
      });
    }

    describe('when the hand value is 5', () => {
      const playerCards = [two, three];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(responses.every(response => response === Strategy.actions.hit)).toBe(true);
      });
    });

    describe('when the hand value is 6', () => {
      const playerCards = [two, four];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(responses.every(response => response === Strategy.actions.hit)).toBe(true);
      });
    });

    describe('when the hand value is 7', () => {
      const playerCards = [three, four];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(responses.every(response => response === Strategy.actions.hit)).toBe(true);
      });
    });

    describe('when the hand value is 8', () => {
      const playerCards = [two, six];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(responses.every(response => response === Strategy.actions.hit)).toBe(true);
      });
    });

    describe('when the hand value is 9', () => {
      const playerCards = [two, seven];

      describe('and dealer shows 2, 7, 8, 9, 10 or Ace', () => {
        const dealerCards = [two, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns hit', () => {
          expect(responses.every(response => response === Strategy.actions.hit)).toBe(true);
        });
      });

      describe('and dealer shows 3, 4, 5 or 6', () => {
        const dealerCards = [three, four, five, six];
        const responses = getResponses(playerCards, dealerCards);

        it('returns double down', () => {
          expect(responses.every(response => response === Strategy.actions.doubleDown)).toBe(true);
        });
      });
    });

    describe('when the hand value is 10', () => {

    });

    describe('when the hand value is 11', () => {

    });

    describe('when the hand value is 12', () => {

    });

    describe('when the hand value is 13', () => {

    });

    describe('when the hand value is 14', () => {

    });

    describe('when the hand value is 15', () => {

    });

    describe('when the hand value is 16', () => {

    });

    describe('when the hand value is 17', () => {

    });

    describe('when the hand value is 18', () => {

    });

    describe('when the hand value is 19', () => {

    });

    describe('when the hand value is 20', () => {

    });

    describe('when the hand value is 21', () => {

    });
  });
});
