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

    type GameFeedRecord = {
        game: Game,
        link: string,
        name?: string,
        reputation?: string,
        quality?: string,
        language?: string,
        ads?: string,
        channel?: string
    };

    class GameFeed {

        game: Game;
        link: string;
        name?: string;
        reputation?: string;
        quality?: string;
        language?: string;
        ads?: string;
        channel?: string;


        constructor(record: GameFeedRecord) {

            this.game = record.game;
            this.link = record.link;

            this.name = record.name;
            this.reputation = record.reputation;
            this.quality = record.quality;
            this.language = record.language;
            this.ads = record.ads;
            this.channel = record.channel;
        }

        private async getStreamUrlStage2(url: string): Promise<string | null> {
            const instance: phantom.PhantomJS = await phantom.create();
            let page: phantom.WebPage = await instance.createPage();

            await page.property("viewportSize", { width: 1280, height: 1024 });

            const loadedPage = await page.on("onLoadFinished", async function (e: "success" | "fail") {

            });

            const status: string = await page.open(this.link);

            const html = await page.property("content");

            await instance.exit();

            console.log(html);

            return url;
        }

        async getStreamUrl(): Promise<string | null> {
            let url: string | null = null;

            const instance: phantom.PhantomJS = await phantom.create();
            let page: phantom.WebPage = await instance.createPage();

            await page.property("viewportSize", { width: 1280, height: 1024 });

            const loadedPage = await page.on("onLoadFinished", async function (e: "success" | "fail") {

            });

            const status: string = await page.open(this.link);

            const html = await page.property("content");

            await instance.exit();

            let dom = new JSDOM(html);

            let doc: Document = dom.window.document;

            let atag = <HTMLAnchorElement | null>doc.querySelector("header li a");

            if (atag) {
                return await this.getStreamUrlStage2(atag.href);
            }

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

            let name: string | null | undefined;
            let reputation: string | undefined;
            let quality: string | undefined;
            let language: string | undefined;
            let ads: string | undefined;
            let channel: string | undefined;

            for (let i = 0; i < rows.length; ++i) {
                row = <HTMLTableRowElement>rows[i];

                link = row.getAttribute("data-stream-link");

                if (link) {


                    name = row.querySelector("td:nth-child(3) > span > span")?.textContent?.trim();
                    reputation = row.querySelector("td:nth-child(4) > span")?.textContent?.trim();
                    quality = row.querySelector("td:nth-child(5) > span ")?.textContent?.trim();
                    language = row.querySelector("td:nth-child(6) > span ")?.textContent?.trim();
                    ads = row.querySelector("td:nth-child(7) > span ")?.textContent?.trim();
                    channel = row.querySelector("td:nth-child(8) > span ")?.textContent?.trim();


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
        }
    }

}