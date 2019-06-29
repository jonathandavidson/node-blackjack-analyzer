import * as Shoe from '../../lib/Shoe.js';

describe('lib/Shoe', () => {
  describe('Shoe class initializes properly', () => {
    let shoe;

    beforeAll(() => {
      spyOn(Shoe, 'shuffle').and.callThrough();
      shoe = Shoe.create(2, 0.75);
    });

    it('card property is an array with the correct number of cards', () => {
      expect(Array.isArray(shoe.cards)).toBe(true);
      expect(shoe.cards.length).toBe(52 * 2 + 1);
    });

    it('shuffles the cards', () => {
      expect(Shoe.shuffle).toHaveBeenCalledTimes(1);
    });

    it('inserts a shuffle marker in the correct location', () => {
      expect(shoe.cards[78]).toBe(null);
    });
  });

  describe('generateCards()', () => {
    const cards = Shoe.generateCards(2);

    it('returns an array with the correct number of cards', () => {
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(52 * 2);
    });
  });

  describe('shuffle()', () => {
    const cards = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    const shuffledCards = Shoe.shuffle(cards);

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
