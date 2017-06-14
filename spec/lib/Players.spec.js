const Hand = require('../../lib/Hand');
const Players = require('../../lib/Players');
const Strategy = require('../../lib/Strategy');

describe('lib/Players', () => {
  describe('generate()', () => {
    let players;

    beforeEach(() => {
      spyOn(Players, 'generatePlayer').and.callThrough();
      players = Players.generate(3);
    });

    it('returns an array', () => {
      expect(Array.isArray(players)).toBe(true);
    });

    it('length of array returned is equal to the number of players', () => {
      expect(players.length).toBe(3);
    });

    it('calls the generatePlayer() method once for each player', () => {
      expect(Players.generatePlayer).toHaveBeenCalledTimes(3);
    });

    it('sets the strategy for each player to basic stragegy', () => {
      expect(players[0].strategy).toEqual(Strategy.basic);
      expect(players[1].strategy).toEqual(Strategy.basic);
    });

    it('correctly names the players', () => {
      expect(players[0].name).toBe('player 1');
      expect(players[1].name).toBe('player 2');
    });
  });

  describe('generateDealer()', () => {
    let dealer;

    beforeEach(() => {
      spyOn(Players, 'generatePlayer').and.callThrough();
      dealer = Players.generateDealer();
    });

    it('returns an object', () => {
      expect(typeof dealer).toBe('object');
    });

    it('calls the generatePlayer() method', () => {
      expect(Players.generatePlayer).toHaveBeenCalledTimes(1);
    });

    it('sets the strategy property to dealer strategy', () => {
      expect(dealer.strategy).toEqual(Strategy.dealer);
    });
  });

  describe('generatePlayer()', () => {
    const testName = 'test name';
    const testStrategy = {};
    const hand = { test: 'hand' };

    let player;

    beforeEach(() => {
      spyOn(Hand, 'create').and.returnValue(hand);
      player = Players.generatePlayer(testName, testStrategy);
    });

    it('returns an object', () => {
      expect(typeof player).toBe('object');
    });

    it('has a bankroll of zero', () => {
      expect(player.bankroll).toBe(0);
    });

    it('has a hands property of type array containing one hand', () => {
      expect(Array.isArray(player.hands)).toBe(true);
      expect(player.hands.length).toEqual(1);
      expect(player.hands[0]).toEqual(hand);
    });

    it('has a name equal to the name parameter', () => {
      expect(player.name).toEqual(testName);
    });

    it('has a strategy equal to the strategy parameter', () => {
      expect(player.strategy).toEqual(testStrategy);
    });
  });
});
