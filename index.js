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
const phantom = __importStar(require("phantom"));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
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
function getFeed(url = SPORTSURGE_URL) {
    return __awaiter(this, void 0, void 0, function* () {
        const instance = yield phantom.create();
        const page = yield instance.createPage();
        const loadedPage = yield page.on("onLoadFinished", function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(e);
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
        console.log(games);
        //console.log(JSON.stringify(games));
    });
}
getFeed();
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
    name = teamEventRow.getElementsByTagName("span")[0].innerText;
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
