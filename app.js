import config from './config/settings';
import * as Game from './lib/Game';

const game = Game.create(config);
const result = Game.start(game);

Object.keys(result.stats).forEach(name => {
  console.log(result.stats[name].description + ': ' + result.stats[name].value);
});
