'use strict';

const assert = require('assert');
const sinon  = require('sinon');

const Hand = require('../../lib/Hand.js');
const Card = require('../../lib/Card.js');
const Players = require('../../lib/Players.js');

const ace = Card.values[0];
const two = Card.values[1];
const ten = Card.values[9];

describe('lib/Hand', function() {
    describe('deal()', function() {
        let players;
        let dealer;
        let shoe;

        const Deck = require('../../lib/Deck.js');
        Deck.generateCards = sinon.spy();

        beforeEach(function() {
            players = [
                Players.generatePlayer(),
                Players.generatePlayer()
            ];

            dealer = Players.generateDealer();

            shoe = {
                cards: [
                    'foo',
                    'bar',
                    'baz',
                    'qux',
                    'quux',
                    'corge',
                    'uier'
                ]
            };

            Hand.deal(players, dealer, shoe);
        });

        afterEach(function() {
            Deck.generateCards.reset();
        });

        describe('players get the correct cards', function() {
            it('player 1 gets first card', function() {
                assert.equal(players[0].hand.cards[0], 'foo');
            });

            it('player 2 gets second card', function() {
                assert.equal(players[1].hand.cards[0], 'bar');
            });

            it('dealer gets third card', function() {
                assert.equal(dealer.hand.cards[0], 'baz');
            });

            it('player 1 gets fourth card', function() {
                assert.equal(players[0].hand.cards[1], 'qux');
            });

            it('player 2 gets fifth card', function() {
                assert.equal(players[1].hand.cards[1], 'quux');
            });

            it('dealer gets sixth card', function() {
                assert.equal(dealer.hand.cards[1], 'corge');
            });

            it('shoe has remaining card(s)', function() {
                assert.deepEqual(shoe.cards, ['uier']);
            });
        });

        describe('The shuffle marker is not dealt to a player', function() {
            before(function() {
                shoe.cards = [
                    'foo',
                    'shuffle marker',
                    'bar',
                    'baz',
                    'qux',
                    'quux',
                    'corge',
                    'uier'
                ]
            });

            it('player 1 gets first card', function() {
                assert.equal(players[0].hand.cards[0], 'foo');
            });

            it('player 2 gets second card', function() {
                assert.equal(players[1].hand.cards[0], 'bar');
            });
        });
    });

    describe('isBlackjack()', function() {
        it('identifies blackjack with ace and ten', function() {
            const hand = {
                cards: [ace, ten]
            };

            assert.equal(Hand.isBlackjack(hand), true);
        });

        it('identifies blackjack with ten and ace', function() {
            const hand = {
                cards: [ten, ace]
            };

            assert.equal(Hand.isBlackjack(hand), true);
        });

        it('identifies non-blackjack with ace and off-card', function() {
            const hand = {
                cards: [ace, two]
            };

            assert.equal(Hand.isBlackjack(hand), false);
        });

        it('identifies non-blackjack with off-card and ace', function() {
            const hand = {
                cards: [two, ace]
            };

            assert.equal(Hand.isBlackjack(hand), false);
        });

        it('identifies non-blackjack with ten and off-card', function() {
            const hand = {
                cards: [ten, two]
            };

            assert.equal(Hand.isBlackjack(hand), false);
        });

        it('identifies non-blackjack with off-card and ten', function() {
            const hand = {
                cards: [two, ten]
            };

            assert.equal(Hand.isBlackjack(hand), false);
        });

        it('identifies non-blackjack with two off-cards', function() {
            const hand = {
                cards: [two, two]
            };

            assert.equal(Hand.isBlackjack(hand), false);
        });
    });

    describe('isBusted()', function() {
        it('identifies bust with no ace', function() {
            const hand = {
                cards: [ten, ten, two]
            };

            assert.equal(Hand.isBusted(hand), true);
        });

        it('identifies non-bust without an ace', function() {
            const hand = {
                cards: [ten, two]
            };

            assert.equal(Hand.isBusted(hand), false);
        });

        it('identifies non-bust with an ace', function() {
            const hand = {
                cards: [ace, ten, two]
            };

            assert.equal(Hand.isBusted(hand), false);
        });
    });

    /** @todo Add tests for play() */
});
