const Hand = require('../../lib/Hand');
const Players = require('../../lib/Players');
const basicStrategy = require('../../lib/Strategy/Basic');
const dealerStrategy = require('../../lib/Strategy/Dealer');

describe('lib/Players', () => {
  describe('generate()', () => {
    let players;

    beforeEach(() => {
      spyOn(Players, 'generatePlayer').and.callThrough();
      players = Players.generate(2);
    });

    it('returns an array', () => {
      expect(Array.isArray(players)).toBe(true);
    });

    it('length of array returned is equal to the number of players plus the dealer', () => {
      expect(players.length).toBe(3);
    });

    it('calls the generatePlayer() method once for each player plush the dealer', () => {
      expect(Players.generatePlayer).toHaveBeenCalledTimes(3);
    });

    it('sets the strategy for each player to basic stragegy', () => {
      expect(players[0].strategy).toEqual(basicStrategy);
      expect(players[1].strategy).toEqual(basicStrategy);
      expect(players[2].strategy).toEqual(dealerStrategy);
    });

    it('correctly names the players', () => {
      expect(players[0].name).toBe('player 1');
      expect(players[1].name).toBe('player 2');
      expect(players[2].name).toBe('dealer');
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
      expect(dealer.strategy).toEqual(dealerStrategy);
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

  describe('isDealer()', () => {
    describe('when player is the dealer', () => {
      const isDealer = Players.isDealer(Players.generateDealer());

      it('returns true', () => {
        expect(isDealer).toBe(true);
      });
    });

    describe('when player is not the dealer', () => {
      const isDealer = Players.isDealer(Players.generatePlayer());

      it('returns false', () => {
        expect(isDealer).toBe(false);
      });
    });
  });
});
