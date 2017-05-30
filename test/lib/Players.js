const assert = require('assert');
const sinon = require('sinon');
const Players = require('../../lib/Players');

describe('lib/Players', function () {
    describe('generate()', function () {
        let players;

        beforeEach(function () {
            players = Players.generate(3);
        });

        it('returns an array', function () {
            assert.equal(Array.isArray(players), true);
        });

        it('length of array returned is equal to the number of players', function () {
            assert.equal(players.length, 3);
        });

        it('calls the generatePlayer() method once for each player');

        it('sets the strategy for each player to basic stragegy');

        it('correctly names the players');
    });

    describe('generateDealer()', () => {
        it('returns an object');

        it('calls the generatePlayer() method');

        it('sets the strategy property to dealer strategy');
    });

    describe('generatePlayer()', () => {
        it('returns an object');

        it('has a bankroll of zero');

        it('has a hand object with a bet of zero and empty array of cards');

        it('has a name equal to the name parameter');

        it('has a strategy equal to the strategy parameter');
    });
});
