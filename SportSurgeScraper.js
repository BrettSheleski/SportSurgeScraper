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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportSurgeScraper = void 0;
const phantom = __importStar(require("phantom"));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios_1 = __importDefault(require("axios"));
var SportSurgeScraper;
(function (SportSurgeScraper) {
    const SPORTSURGE_URL = "https://sportsurge.club/";
    function parseGame(tag) {
        let title = tag.title;
        let url = tag.href;
        return {
            category: getCategories(tag),
            teams: getTeams(tag),
            time: getTime(tag),
            title: title,
            url: url
        };
    }
    function getParentATag(element) {
        let parent = element.parentElement;
        if (!parent) {
            return null;
        }
        else if (parent.tagName == "A") {
            return parent;
        }
        else {
            return getParentATag(parent);
        }
    }
    function getCategories(tag) {
        let categoryDiv = tag.getElementsByClassName("col-2")[0];
        if (categoryDiv.innerText) {
            return categoryDiv.innerHTML.split(",").map(x => x.trim());
        }
        else {
            return [];
        }
    }
    function getTeams(tag) {
        let teams = Array();
        let divs = tag.getElementsByClassName("team-name-event-row");
        for (let i = 0; i < divs.length; ++i) {
            teams.push(getTeam(divs[i]));
        }
        return teams;
    }
    function getTeam(teamEventRow) {
        let name;
        let logoUrl = null;
        let imgs = teamEventRow.getElementsByTagName("img");
        let img = null;
        name = teamEventRow.getElementsByTagName("span")[0].innerHTML;
        if (imgs.length > 0) {
            img = imgs[0];
            logoUrl = img.src;
        }
        return {
            name: name,
            logoUrl: logoUrl
        };
    }
    function getTime(tag) {
        let div = tag.getElementsByClassName("col-4")[0];
        if (div.innerHTML) {
            return new Date(div.innerHTML);
        }
    }
    function getFeed() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = SPORTSURGE_URL;
            const instance = yield phantom.create();
            const page = yield instance.createPage();
            const loadedPage = yield page.on("onLoadFinished", function (e) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            });
            const status = yield page.open(url);
            const html = yield page.property("content");
            yield instance.exit();
            let games = Array();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
            var teamRows = doc.getElementsByClassName("team-name-event-row");
            let aTags = Array();
            let aTag;
            for (let i = 0; i < teamRows.length; ++i) {
                aTag = getParentATag(teamRows[i]);
                if (aTag && aTags.indexOf(aTag) == -1) {
                    aTags.push(aTag);
                    games.push(parseGame(aTag));
                }
            }
            return games;
        });
    }
    SportSurgeScraper.getFeed = getFeed;
    class GameFeed {
        constructor(record) {
            this.game = record.game;
            this.link = record.link;
            this.name = record.name;
            this.reputation = record.reputation;
            this.quality = record.quality;
            this.language = record.language;
            this.ads = record.ads;
            this.channel = record.channel;
        }
        getStreamUrl() {
            return __awaiter(this, void 0, void 0, function* () {
                let url = null;
                return url;
            });
        }
    }
    class Game {
        constructor(record) {
            this.record = record;
        }
        getFeeds() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __awaiter(this, void 0, void 0, function* () {
                var feeds = Array();
                let urlNoQuery = this.record.url.split('?')[0];
                let urlParts = urlNoQuery.split('/');
                let id = urlParts[urlParts.length - 1];
                let url = `https://sportscentral.io/streams-table/${id}/aaaa?new-ui=1&origin=sportsurge.club`;
                let response = yield axios_1.default.get(url);
                let html = response.data;
                let dom = new JSDOM(html);
                let doc = dom.window.document;
                let rows = doc.getElementsByTagName("tr");
                let row;
                let link;
                let name;
                let reputation;
                let quality;
                let language;
                let ads;
                let channel;
                for (let i = 0; i < rows.length; ++i) {
                    row = rows[i];
                    link = row.getAttribute("data-stream-link");
                    if (link) {
                        name = (_b = (_a = row.querySelector("td:nth-child(3) > span > span")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                        reputation = (_d = (_c = row.querySelector("td:nth-child(4) > span")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
                        quality = (_f = (_e = row.querySelector("td:nth-child(5) > span ")) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim();
                        language = (_h = (_g = row.querySelector("td:nth-child(6) > span ")) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim();
                        ads = (_k = (_j = row.querySelector("td:nth-child(7) > span ")) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.trim();
                        channel = (_m = (_l = row.querySelector("td:nth-child(8) > span ")) === null || _l === void 0 ? void 0 : _l.textContent) === null || _m === void 0 ? void 0 : _m.trim();
                        feeds.push(new GameFeed({
                            ads: ads,
                            channel: channel,
                            game: this,
                            language: language,
                            link: link,
                            name: name,
                            quality: quality,
                            reputation: reputation
                        }));
                    }
                }
                return feeds;
            });
        }
    }
    SportSurgeScraper.Game = Game;
})(SportSurgeScraper = exports.SportSurgeScraper || (exports.SportSurgeScraper = {}));
