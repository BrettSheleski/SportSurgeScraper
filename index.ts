import { SportSurgeScraper } from './SportSurgeScraper';
import * as readline from 'readline';


var menu = require('console-menu');

(async function () {

    let games = await SportSurgeScraper.getFeed();

    process.stdout.write("Current Games:\n");

    for (let i = 0; i < games.length; ++i) {
        process.stdout.write(`${i + 1}: ${games[i].teams[0].name} vs. ${games[i].teams[1].name}\n`);
    }


    let rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    rl.question(`Select a game [1-${games.length}]: `, async function (answer) {

        rl.close();

        let i = parseInt(answer);

        --i;

        process.stdout.write(`Selected game: ${games[i].teams[0].name} vs ${games[i].teams[1].name}`);

        let game = new SportSurgeScraper.Game(games[i]);

        let feeds = await game.getFeeds();

        console.log(feeds);
    });


})();
