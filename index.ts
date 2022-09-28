import { SportSurgeScraper } from './SportSurgeScraper';
import * as readline from 'readline';


var menu = require('console-menu');

(async function () {

    let games = await SportSurgeScraper.getFeed();


    let rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    rl.write("Current Games:\n");

    for (let i = 0; i < games.length; ++i) {
        rl.write(`${i + 1}: ${games[i].teams[0].name} vs. ${games[i].teams[1].name}\n`);
    }

    rl.question(`Select a game [1-${games.length}]: `, async function (answer) {


        let i = parseInt(answer);

        --i;

        rl.write(`Selected game: ${games[i].teams[0].name} vs ${games[i].teams[1].name}\n`);

        let game = new SportSurgeScraper.Game(games[i]);

        let feeds = await game.getFeeds();


        if (feeds.length == 0) {
            rl.write("No Feeds Found :( ");

            rl.close();
        }
        else {



            rl.write("Feeds: \n");
            rl.write("#\tName\t\tReputation\tChannel\tAds\n");
            for (let i = 0; i < feeds.length; ++i) {
                rl.write(`${i + 1}.\t${feeds[i].name}\t\t${feeds[i].reputation}\t${feeds[i].channel}\t${feeds[i].ads}\n`);
            }

            rl.question(`Select a feed [1-${feeds.length}]: `, async function (answer) {

                let i = parseInt(answer);

                --i;

                let feed = feeds[i];

                rl.write(`Selected: ${feed.link}\n`);
                rl.write("Trying to find the URL of the Stream... ");

                let url = await feed.getStreamUrl();



                rl.close();
            });
        }
    });
})();
