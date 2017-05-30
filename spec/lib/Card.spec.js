const Card = require('../../lib/Card.js');

const ace = Card.values[0];
const two = Card.values[1];
const ten = Card.values[9];
const jack = Card.values[10];
const queen = Card.values[11];
const king = Card.values[12];

describe('lib/Card', () => {
    describe('isAce()', () => {
        it('identifies ace', () => {
            expect(Card.isAce(ace)).toBe(true);
        });

        it('identifies non-ace', () => {
            expect(Card.isAce(two)).toBe(false);
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
