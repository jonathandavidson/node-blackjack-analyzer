import config from './config/settings';
import * as Game from './src/game';

const game = Game.create(config);
const stats = Game.start(game).stats;

for (const name in stats) {
  console.log(`${stats[name].description}: ${stats[name].value}`);
}
