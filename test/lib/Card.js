const assert = require('assert');

const Card = require('../../lib/Card.js');

const ace = Card.values[0];
const two = Card.values[1];
const ten = Card.values[9];
const jack = Card.values[10];
const queen = Card.values[11];
const king = Card.values[12];

describe('lib/Card', function() {
    describe('isAce()', function() {
        it('identifies ace', function() {
            assert.equal(Card.isAce(ace), true);
        });

        it('identifies non-ace', function() {
            assert.equal(Card.isAce(two), false);
        });
    });

    describe('isTen()', function() {
        it('identifies ten as ten', function() {
            assert.equal(Card.isTen(ten), true);
        });

        it('identifies jack as ten', function() {
            assert.equal(Card.isTen(jack), true);
        });

        it('identifies queen as ten', function() {
            assert.equal(Card.isTen(queen), true);
        });

        it('identifies king as ten', function() {
            assert.equal(Card.isTen(king), true);
        });

        it('identifies non-ten', function() {
            assert.equal(Card.isAce(two), false);
        });
    });

    describe('lowValue()', function() {
        it('identifies low value for ace', function() {
            assert.equal(Card.lowValue(ace), 1);
        });

        it('identifies low value for non-ace', function() {
            assert.equal(Card.lowValue(two), 2);
        });
    });
});
