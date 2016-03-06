function deal(players, shoe) {
    players.forEach(player => {
        player.cards[0] = shoe.pop();
        player.cards[1] = shoe.pop();
    });
}

function play(player, players, shoe) {
    console.log(player.name + ' is playing.');
}

module.exports = {
    deal,
    play
};
