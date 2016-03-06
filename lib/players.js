'use strict';

function generate(numberOfPlayers) {
    let players = [];

    for (var i = 0; i <= numberOfPlayers; i++) {
        let player = {
            name: i !== numberOfPlayers ? `player ${i+1}` : 'dealer',
            cards: []
        }

        players.push(player);
    }

    return players;
}

module.exports = {
    generate
}
