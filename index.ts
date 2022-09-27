import * as phantom from "phantom";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

const SPORTSURGE_URL = "https://sportsurge.club/";

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



async function getFeed(url: string = SPORTSURGE_URL) {

    const instance: phantom.PhantomJS = await phantom.create();
    const page: phantom.WebPage = await instance.createPage();

    const loadedPage = await page.on("onLoadFinished", async function (e: "success" | "fail") {
        console.log(e);
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

    console.log(games);
    //console.log(JSON.stringify(games));
}



getFeed();

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

    name = teamEventRow.getElementsByTagName("span")[0].innerText;

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

