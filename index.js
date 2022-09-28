"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SportSurgeScraper_1 = require("./SportSurgeScraper");
const readline = __importStar(require("readline"));
var menu = require('console-menu');
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let games = yield SportSurgeScraper_1.SportSurgeScraper.getFeed();
        process.stdout.write("Current Games:\n");
        for (let i = 0; i < games.length; ++i) {
            process.stdout.write(`${i + 1}: ${games[i].teams[0].name} vs. ${games[i].teams[1].name}\n`);
        }
        let rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(`Select a game [1-${games.length}]: `, function (answer) {
            return __awaiter(this, void 0, void 0, function* () {
                rl.close();
                let i = parseInt(answer);
                --i;
                process.stdout.write(`Selected game: ${games[i].teams[0].name} vs ${games[i].teams[1].name}`);
                let game = new SportSurgeScraper_1.SportSurgeScraper.Game(games[i]);
                let feeds = yield game.getFeeds();
                console.log(feeds);
            });
        });
    });
})();
