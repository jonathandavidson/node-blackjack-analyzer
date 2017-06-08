const Card = require('../../lib/Card.js');

const ace = Card.values[0];
const two = Card.values[1];
const ten = Card.values[9];
const jack = Card.values[10];
const queen = Card.values[11];
const king = Card.values[12];

describe('lib/Card', () => {
    describe('generateShuffleMarker', () => {
        const shuffleMarker = Card.generateShuffleMarker();

        it('returns an object', () => {
            expect(typeof shuffleMarker).toBe('object');
        });

        it('has a displayName property', () => {
            expect(shuffleMarker.hasOwnProperty('displayName')).toBe(true);
            expect(shuffleMarker.displayName).toEqual('shuffle marker');
        });

        it('has an isShuffleMarker property set to true', () => {
            expect(shuffleMarker.hasOwnProperty('isShuffleMarker')).toBe(true);
            expect(shuffleMarker.isShuffleMarker).toEqual(true);
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
            for(let i=2; i<=9; i++) {
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

    describe('isAce()', () => {
        it('identifies ace', () => {
            expect(Card.isAce(ace)).toBe(true);
        });

        it('identifies non-ace', () => {
            expect(Card.isAce(two)).toBe(false);
        });
    });

    describe('isShuffleMarker', () => {
        const shuffleMarker = Card.generateShuffleMarker();
        const otherCard = {};

        it('returns true when passed a shuffle marker', () => {
            expect(Card.isShuffleMarker(shuffleMarker)).toEqual(true);
        });

        it('returns false when not passed a shuffle marker', () => {
            expect(Card.isShuffleMarker(otherCard)).toEqual(false);
        });
    });

    describe('isTen()', () => {
        it('identifies ten as ten', function() {
            expect(Card.isTen(ten)).toBe(true);
        });

        it('identifies jack as ten', () => {
            expect(Card.isTen(jack)).toBe(true);
        });

        it('identifies queen as ten', () => {
            expect(Card.isTen(queen)).toBe(true);
        });

        it('identifies king as ten', () => {
            expect(Card.isTen(king)).toBe(true);
        });

        it('identifies non-ten', () => {
            expect(Card.isAce(two)).toBe(false);
        });
    });

    describe('lowValue()', () => {
        it('identifies low value for ace', () => {
            expect(Card.lowValue(ace)).toBe(1);
        });

        it('identifies low value for non-ace', () => {
            expect(Card.lowValue(two)).toBe(2);
        });
    });
});
