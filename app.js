const Deck = require('./lib/deck.js');
const Players = require('./lib/players.js');

const deckCount = 4;
const playerCount = 3;
const handCount = 1;

const shoe = Deck.generateShoe(deckCount);
const players = Players.generate(playerCount);

for (var i = 0; i < handCount; i++) {
    players.forEach(player => {
        player.cards[0] = shoe.pop();
        player.cards[1] = shoe.pop();
    });
};
