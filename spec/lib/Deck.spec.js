const Deck = require('../../lib/Deck.js');
const Card = require('../../lib/Card.js');

describe('lib/Deck', () => {
  describe('generateCards()', () => {
    let cards;

    beforeEach(() => {
      spyOn(Deck, 'shuffle').and.callThrough();
      cards = Deck.generateCards(2, 0.75);
    });

    it('returns an array with the correct number of cards', () => {
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(52 * 2 + 1);
    });

    it('shuffles the cards', () => {
      expect(Deck.shuffle).toHaveBeenCalledTimes(1);
    });

    it('inserts a shuffle marker in the correct location', () => {
      expect(Card.isShuffleMarker(cards[78])).toBe(true);
    });
  });

  describe('generateShoe()', () => {
    let shoe;

    const deckCount = 2;
    const deckPenetration = 0.75;
    const generateCardsReturnValue = [
      'foo',
      'bar',
      'baz'
    ];

    beforeEach(() => {
      spyOn(Deck, 'generateCards').and.returnValue(generateCardsReturnValue);
      shoe = Deck.generateShoe(deckCount, deckPenetration);
    });

    it('returns an object', () => {
      expect(typeof shoe).toBe('object');
    });

    it('has a cards property equal to the return value of generateCards()', () => {
      expect(shoe.cards).toEqual(generateCardsReturnValue);
    });

    it('calls generateCards() once with the correct params', () => {
      expect(Deck.generateCards).toHaveBeenCalledTimes(1);
      expect(Deck.generateCards.calls.argsFor(0)).toEqual([deckCount, deckPenetration]);
    });

    it('has a shouldShuffle property of type boolean defaulting to false', () => {
      expect(shoe.hasOwnProperty('shouldShuffle')).toBe(true);
      expect(typeof shoe.shouldShuffle).toBe('boolean');
      expect(shoe.shouldShuffle).toEqual(false);
    });
  });

  describe('shuffle()', () => {
    const cards = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    const shuffledCards = Deck.shuffle(cards);

    it('should return an array with the correct number of cards', () => {
      expect(Array.isArray(shuffledCards)).toBe(true);
      expect(shuffledCards.length).toEqual(cards.length);
    });

    it('should contain each of the original cards', () => {
      cards.forEach(card => {
        expect(shuffledCards.includes(card)).toBe(true);
      });
    });

    it('should not be in the original order', () => {
      expect(shuffledCards).not.toEqual(cards);
    });
  });
});
