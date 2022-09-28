import * as phantom from "phantom";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
import axios from 'axios';

export module SportSurgeScraper {

    const SPORTSURGE_URL = "https://sportsurge.club/";

    type Team = {
        name: string,
        logoUrl: string | null
    };

    type GameRecord = {
        title: string,
        teams: Team[],
        category?: string[],
        time?: Date,
        url: string
    };


    function parseGame(tag: HTMLAnchorElement): GameRecord {

        let title: string = tag.title;
        let url: string = tag.href;

        return {
            category: getCategories(tag),
            teams: getTeams(tag),
            time: getTime(tag),
            title: title,
            url: url
        };
    }

    function getParentATag(element: Element): HTMLAnchorElement | null {

        let parent = element.parentElement;

        if (!parent) {
            return null;
        }
        else if (parent.tagName == "A") {
            return <HTMLAnchorElement>parent;
        }
        else {
            return getParentATag(parent);
        }
    }

    function getCategories(tag: HTMLAnchorElement): string[] {

        let categoryDiv = <HTMLDivElement>tag.getElementsByClassName("col-2")[0];

        if (categoryDiv.innerText) {
            return categoryDiv.innerHTML.split(",").map(x => x.trim());
        }
        else {
            return [];
        }
    }


    function getTeams(tag: HTMLAnchorElement): Team[] {
        let teams = Array<Team>();

        let divs = tag.getElementsByClassName("team-name-event-row");

        for (let i = 0; i < divs.length; ++i) {
            teams.push(getTeam(<HTMLDivElement>divs[i]));
        }

        return teams;
    }

    function getTeam(teamEventRow: HTMLDivElement): Team {

        let name: string;
        let logoUrl: string | null = null;

        let imgs = teamEventRow.getElementsByTagName("img");


        let img: HTMLImageElement | null = null;

        name = teamEventRow.getElementsByTagName("span")[0].innerHTML;

        if (imgs.length > 0) {
            img = <HTMLImageElement>imgs[0];
            logoUrl = img.src;
        }

        return {
            name: name,
            logoUrl: logoUrl
        }
    }


    function getTime(tag: HTMLAnchorElement): Date | undefined {
        let div = <HTMLDivElement>tag.getElementsByClassName("col-4")[0];

        if (div.innerHTML) {
            return new Date(div.innerHTML);
        }
    }

    export async function getFeed(): Promise<Array<GameRecord>> {

        const url = SPORTSURGE_URL;

        const instance: phantom.PhantomJS = await phantom.create();
        const page: phantom.WebPage = await instance.createPage();

        const loadedPage = await page.on("onLoadFinished", async function (e: "success" | "fail") {

        });



        const status: string = await page.open(url);

        const html = await page.property("content");

        await instance.exit();

        let games = Array<GameRecord>();

        let dom = new JSDOM(html);

        let doc: Document = dom.window.document;

        var teamRows = doc.getElementsByClassName("team-name-event-row");

        let aTags = Array<HTMLElement>();

        let aTag: HTMLAnchorElement | null;

        for (let i = 0; i < teamRows.length; ++i) {
            aTag = getParentATag(teamRows[i]);

            if (aTag && aTags.indexOf(aTag) == -1) {
                aTags.push(aTag);

                games.push(parseGame(aTag))
            }
        }

        return games;
    }

    class GameFeed {

        game: Game;
        link: string;

        constructor(game: Game, link: string) {
            this.game = game;
            this.link = link;
        }

        async getStreamUrl(): Promise<string | null> {
            let url : string | null = null;

            return url;
        }


    }

    export class Game {

        record: GameRecord;

        constructor(record: GameRecord) {
            this.record = record;
        }

        async getFeeds(): Promise<Array<GameFeed>> {
            var feeds = Array<GameFeed>();


            let urlNoQuery = this.record.url.split('?')[0];

            let urlParts = urlNoQuery.split('/');

            let id = urlParts[urlParts.length - 1];

            let url = `https://sportscentral.io/streams-table/${id}/aaaa?new-ui=1&origin=sportsurge.club`;

            let response = await axios.get<string>(url);

            let html = response.data;

            let dom = new JSDOM(html);

            let doc: Document = dom.window.document;

            let rows = doc.getElementsByTagName("tr");
            let row: HTMLTableRowElement;
            let link: string | null;
            for (let i = 0; i < rows.length; ++i) {
                row = <HTMLTableRowElement>rows[i];

                link = row.getAttribute("data-stream-link");

                if (link) {
                    feeds.push(new GameFeed(this, link));
                }

            }

            return feeds;
        }
    }

}