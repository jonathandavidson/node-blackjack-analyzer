import * as Card from '../../lib/Card';

describe('Card', () => {
  describe('Initializes properly', () => {
    const name = 'name';
    const values = [1, 2, 3];
    const card = new Card.Card(name, 'clubs', values);

    it('Card is instantiated with a name', () => {
      expect(card.name).toEqual(name);
    });

    it('Card is instantiated with an array of values', () => {
      expect(card.values).toEqual(values);
    });
  });

  describe('getLowValue()', () => {
    it('returns the lowest value', () => {
      const card = new Card.Card('ace', 'clubs', [1, 11]);
      expect(card.getLowValue()).toBe(1);
    });
  });

  describe('isAce()', () => {
    it('identifies ace', () => {
      const card = new Card.Card('ace', 'clubs', [1, 11]);
      expect(card.isAce()).toBe(true);
    });

    it('identifies non-ace', () => {
      const card = new Card.Card('two', 'clubs', [2]);
      expect(card.isAce()).toBe(false);
    });
  });

  describe('isTen', () => {
    it('returns true when the value is 10', () => {
      const card = new Card.Card('ten', 'clubs', [10]);
      expect(card.isTen()).toBe(true);
    });

    it('returns false when the value is not 10', () => {
      const card = new Card.Card('two', 'clubs', [2]);
      expect(card.isTen()).toBe(false);
    });
  });

  describe('getDisplayName()', () => {
    it('returns the displayName', () => {
      const card = new Card.Card('ace', 'spades', [1, 11]);
      expect(card.getDisplayName()).toEqual('ace of spades');
    });
  });
});

describe('lib/Card', () => {
  describe('create()', () => {
    it('creates a Card instance with the correct display name', () => {
      const card = Card.create(Card.cards.Two, Card.suits.Spades);
      expect(card).toEqual(jasmine.any(Card.Card));
      expect(card.getDisplayName()).toEqual('Two of spades');
    });
  });

  describe('getAll()', () => {
    const cards = Card.getAll();

    it('returns an array of 52 objects', () => {
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(52);
    });

    it('array contains 4 aces', () => {
      expect(cards.filter(item => {
        return item.values.length === 2 && item.values.includes(1) && item.values.includes(11);
      }).length).toBe(4);
    });

    it('array contains 4 cards of each value 2 through 9', () => {
      for (let i = 2; i <= 9; i++) {
        expect(cards.filter(item => {
          return item.values.length === 1 && item.values.includes(i);
        }).length).toBe(4);
      }
    });

    it('array contains 16 cards of value 10', () => {
      expect(cards.filter(item => {
        return item.values.length === 1 && item.values.includes(10);
      }).length).toBe(16);
    });

    it('every item in the array has a displayName property', () => {
      expect(cards.every(item => item.hasOwnProperty('displayName'))).toBe(true);
    });
  });
});
